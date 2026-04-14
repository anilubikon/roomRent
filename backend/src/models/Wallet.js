import mongoose from 'mongoose';

const walletSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true, required: true },
    cashBalance: { type: Number, default: 0, min: 0 },
    rentHelpBalance: { type: Number, default: 0, min: 0 },
    rentHelpCreditLimit: { type: Number, default: 0, min: 0 },
    rentHelpConsumed: { type: Number, default: 0, min: 0 },
    isRentHelpBlocked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

walletSchema.virtual('totalBalance').get(function totalBalance() {
  return (this.cashBalance || 0) + (this.rentHelpBalance || 0);
});

walletSchema.virtual('availableRentHelp').get(function availableRentHelp() {
  return Math.max(0, (this.rentHelpCreditLimit || 0) - (this.rentHelpConsumed || 0));
});

export const Wallet = mongoose.model('Wallet', walletSchema);
