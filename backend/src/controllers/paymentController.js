import crypto from 'crypto';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';
import { env } from '../config/env.js';
import { Booking } from '../models/Booking.js';
import { Payment } from '../models/Payment.js';
import { User } from '../models/User.js';
import { razorpayClient, splitPayment } from '../services/razorpayService.js';

const createOrderSchema = z.object({
  bookingId: z.string().optional(),
  amount: z.number().positive(),
  type: z.enum(['rent', 'wallet_topup', 'loan_repayment']),
  planType: z.enum(['full', 'emi']).default('full'),
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
  }

  return res.status(StatusCodes.OK).json({ success: true, payment });
}

export async function listMyPayments(req, res) {
  const payments = await Payment.find({ tenantId: req.user.userId }).sort({ createdAt: -1 });
  return res.status(StatusCodes.OK).json(payments);
}
