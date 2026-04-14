import crypto from 'crypto';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';
import { env } from '../config/env.js';
import { Booking } from '../models/Booking.js';
import { Payment } from '../models/Payment.js';
import { User } from '../models/User.js';
import { Wallet } from '../models/Wallet.js';
import { WalletTransaction } from '../models/WalletTransaction.js';
import { razorpayClient, splitPayment } from '../services/razorpayService.js';

const createOrderSchema = z.object({
  bookingId: z.string().optional(),
  amount: z.number().positive(),
  type: z.enum(['rent', 'wallet_topup', 'rent_help_repayment']),
  planType: z.enum(['full', 'emi']).default('full'),
});

const walletRentSchema = z.object({
  bookingId: z.string(),
  amount: z.number().positive(),
  split: z
    .object({
      cashAmount: z.number().min(0).default(0),
      rentHelpAmount: z.number().min(0).default(0),
    })
    .optional(),
});

export async function createPaymentOrder(req, res) {
  const payload = createOrderSchema.parse(req.body);
  const user = await User.findById(req.user.userId);
  const booking = payload.bookingId ? await Booking.findById(payload.bookingId) : null;

  const order = await razorpayClient.orders.create({
    amount: Math.round(payload.amount * 100),
    currency: 'INR',
    notes: {
      bookingId: payload.bookingId ?? '',
      userId: req.user.userId,
      paymentType: payload.type,
      planType: payload.planType,
    },
  });

  const { commissionAmount, ownerPayoutAmount } = splitPayment(
    payload.amount,
    user?.companyMarginPercent || 5
  );

  const payment = await Payment.create({
    bookingId: booking?._id,
    tenantId: req.user.userId,
    ownerId: booking?.ownerId,
    type: payload.type,
    planType: payload.planType,
    totalAmount: payload.amount,
    commissionAmount,
    ownerPayoutAmount,
    razorpayOrderId: order.id,
    status: 'created',
    source: 'razorpay',
  });

  return res.status(StatusCodes.CREATED).json({ order, payment, keyId: env.razorpayKeyId });
}

const verifySchema = z.object({
  razorpayOrderId: z.string(),
  razorpayPaymentId: z.string(),
  razorpaySignature: z.string(),
});

export async function verifyPayment(req, res) {
  const payload = verifySchema.parse(req.body);

  const generatedSignature = crypto
    .createHmac('sha256', env.razorpayKeySecret)
    .update(`${payload.razorpayOrderId}|${payload.razorpayPaymentId}`)
    .digest('hex');

  if (generatedSignature !== payload.razorpaySignature) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Signature mismatch' });
  }

  const payment = await Payment.findOneAndUpdate(
    { razorpayOrderId: payload.razorpayOrderId },
    {
      status: 'paid',
      paidAmount: undefined,
      razorpayPaymentId: payload.razorpayPaymentId,
    },
    { new: true }
  );

  if (payment) {
    payment.paidAmount = payment.totalAmount;
    await payment.save();

    if (payment.type === 'wallet_topup') {
      await Promise.all([
        Wallet.findOneAndUpdate(
          { userId: payment.tenantId },
          { $inc: { cashBalance: payment.totalAmount } },
          { upsert: true, new: true }
        ),
        WalletTransaction.create({
          userId: payment.tenantId,
          type: 'topup',
          amount: payment.totalAmount,
          direction: 'credit',
          paymentId: payment._id,
        }),
      ]);
    }
  }

  return res.status(StatusCodes.OK).json({ success: true, payment });
}

export async function payRentFromWallet(req, res) {
  const payload = walletRentSchema.parse(req.body);
  const booking = await Booking.findById(payload.bookingId);
  if (!booking) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: 'Booking not found' });
  }

  const wallet = await Wallet.findOneAndUpdate(
    { userId: req.user.userId },
    { $setOnInsert: { cashBalance: 0, rentHelpBalance: 0 } },
    { upsert: true, new: true }
  );

  const split = payload.split || {
    cashAmount: Math.min(wallet.cashBalance, payload.amount),
    rentHelpAmount: Number((payload.amount - Math.min(wallet.cashBalance, payload.amount)).toFixed(2)),
  };

  if (Number((split.cashAmount + split.rentHelpAmount).toFixed(2)) !== payload.amount) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: 'Split amount must equal total amount',
    });
  }

  if (split.cashAmount > wallet.cashBalance || split.rentHelpAmount > wallet.rentHelpBalance) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Insufficient wallet balances' });
  }

  wallet.cashBalance = Number((wallet.cashBalance - split.cashAmount).toFixed(2));
  wallet.rentHelpBalance = Number((wallet.rentHelpBalance - split.rentHelpAmount).toFixed(2));
  await wallet.save();

  const user = await User.findById(req.user.userId);
  const { commissionAmount, ownerPayoutAmount } = splitPayment(
    payload.amount,
    user?.companyMarginPercent || 5
  );

  const payment = await Payment.create({
    bookingId: booking._id,
    tenantId: req.user.userId,
    ownerId: booking.ownerId,
    type: 'rent',
    planType: 'full',
    totalAmount: payload.amount,
    paidAmount: payload.amount,
    commissionAmount,
    ownerPayoutAmount,
    status: 'paid',
    source: 'wallet',
    splitDetails: split,
  });

  await WalletTransaction.insertMany([
    {
      userId: req.user.userId,
      type: 'rent_payment_cash',
      amount: split.cashAmount,
      direction: 'debit',
      paymentId: payment._id,
      bookingId: booking._id,
    },
    {
      userId: req.user.userId,
      type: 'rent_payment_rent_help',
      amount: split.rentHelpAmount,
      direction: 'debit',
      paymentId: payment._id,
      bookingId: booking._id,
    },
  ]);

  return res.status(StatusCodes.OK).json({ payment, wallet });
}

export async function listMyPayments(req, res) {
  const payments = await Payment.find({ tenantId: req.user.userId }).sort({ createdAt: -1 });
  return res.status(StatusCodes.OK).json(payments);
}
