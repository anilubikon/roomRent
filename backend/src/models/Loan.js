import mongoose from 'mongoose';

const loanSchema = new mongoose.Schema(
  {
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
    principal: { type: Number, required: true },
    interestRateAnnual: { type: Number, required: true },
    tenureMonths: { type: Number, required: true },
    emiAmount: { type: Number, required: true },
    amountPaid: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'closed', 'defaulted'], default: 'active' },
    dueDayOfMonth: { type: Number, default: 5 },
  },
  { timestamps: true }
);

export const Loan = mongoose.model('Loan', loanSchema);
