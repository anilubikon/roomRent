import mongoose from 'mongoose';

const walletTransactionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: {
      type: String,
      enum: [
        'topup',
        'rent_payment_cash',
        'rent_payment_rent_help',
        'rent_help_credit_granted',
        'rent_help_repayment',
        'rent_help_late_fee',
      ],
      required: true,
    },
    amount: { type: Number, required: true },
    direction: { type: String, enum: ['credit', 'debit'], required: true },
    paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
    metadata: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

export const WalletTransaction = mongoose.model('WalletTransaction', walletTransactionSchema);
