import Razorpay from 'razorpay';
import { env } from '../config/env.js';

export const razorpayClient = new Razorpay({
  key_id: env.razorpayKeyId,
  key_secret: env.razorpayKeySecret,
});

export function splitPayment(totalAmount, companyMarginPercent = 5) {
  const companyAmount = Math.round((totalAmount * companyMarginPercent) / 100);
  const ownerPayoutAmount = totalAmount - companyAmount;
  return { companyAmount, ownerPayoutAmount };
}
