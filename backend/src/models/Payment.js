import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    listingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },
    planType: { type: String, enum: ['full', 'emi'], required: true },
    totalAmount: { type: Number, required: true },
    paidAmount: { type: Number, required: true },
    companyAmount: { type: Number, required: true },
    ownerPayoutAmount: { type: Number, required: true },
    razorpayOrderId: { type: String, required: true },
    razorpayPaymentId: { type: String },
    status: { type: String, enum: ['created', 'paid', 'failed'], default: 'created' },
  },
  { timestamps: true }
);

export const Payment = mongoose.model('Payment', paymentSchema);
