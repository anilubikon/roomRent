import mongoose from 'mongoose';

const repaymentInstallmentSchema = new mongoose.Schema(
  {
    dueDate: { type: Date, required: true },
    amount: { type: Number, required: true, min: 0 },
    amountPaid: { type: Number, default: 0, min: 0 },
    status: {
      type: String,
      enum: ['pending', 'paid', 'late'],
      default: 'pending',
    },
    lateFee: { type: Number, default: 0, min: 0 },
  },
  { _id: false }
);

const rentHelpCreditSchema = new mongoose.Schema(
  {
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
    approvedByAdminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    principal: { type: Number, required: true, min: 1 },
    convenienceFee: { type: Number, default: 0, min: 0 },
    totalPayable: { type: Number, required: true, min: 1 },
    amountRepaid: { type: Number, default: 0, min: 0 },
    tenureMonths: { type: Number, default: 1, min: 1 },
    dueDate: { type: Date, required: true },
    repaymentMode: { type: String, enum: ['full', 'emi'], default: 'full' },
    installments: { type: [repaymentInstallmentSchema], default: [] },
    status: { type: String, enum: ['active', 'closed', 'defaulted'], default: 'active' },
  },
  { timestamps: true }
);

export const RentHelpCredit = mongoose.model('RentHelpCredit', rentHelpCreditSchema);
