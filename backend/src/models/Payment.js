import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: { type: String, enum: ['rent', 'wallet_topup', 'rent_help_repayment'], required: true },
    source: { type: String, enum: ['razorpay', 'wallet'], default: 'razorpay' },
    planType: { type: String, enum: ['full', 'emi'], default: 'full' },
    totalAmount: { type: Number, required: true },
    paidAmount: { type: Number, default: 0 },
    commissionAmount: { type: Number, default: 0 },
    ownerPayoutAmount: { type: Number, default: 0 },
    splitDetails: {
      cashAmount: { type: Number, default: 0 },
      rentHelpAmount: { type: Number, default: 0 },
    },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    status: { type: String, enum: ['created', 'paid', 'failed'], default: 'created' },
  },
  { timestamps: true }
);

export const Payment = mongoose.model('Payment', paymentSchema);
