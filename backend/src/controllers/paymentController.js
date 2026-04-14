import crypto from 'crypto';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';
import { env } from '../config/env.js';
import { Payment } from '../models/Payment.js';
import { User } from '../models/User.js';
import { razorpayClient, splitPayment } from '../services/razorpayService.js';

const createOrderSchema = z.object({
  listingId: z.string().min(1),
  amount: z.number().positive(),
  planType: z.enum(['full', 'emi']),
});

export async function createPaymentOrder(req, res) {
  const payload = createOrderSchema.parse(req.body);
  const user = await User.findById(req.user.userId);

  const order = await razorpayClient.orders.create({
    amount: Math.round(payload.amount * 100),
    currency: 'INR',
    notes: {
      listingId: payload.listingId,
      userId: req.user.userId,
      planType: payload.planType,
    },
  });

  const { companyAmount, ownerPayoutAmount } = splitPayment(
    payload.amount,
    user?.companyMarginPercent || 5
  );

  const payment = await Payment.create({
    userId: req.user.userId,
    listingId: payload.listingId,
    planType: payload.planType,
    totalAmount: payload.amount,
    paidAmount: 0,
    companyAmount,
    ownerPayoutAmount,
    razorpayOrderId: order.id,
    status: 'created',
  });

  return res.status(StatusCodes.CREATED).json({
    order,
    payment,
    keyId: env.razorpayKeyId,
  });
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
