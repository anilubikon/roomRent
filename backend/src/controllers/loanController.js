import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';
import { Loan } from '../models/Loan.js';

const applyLoanSchema = z.object({
  principal: z.number().positive(),
  interestRateAnnual: z.number().min(1),
  tenureMonths: z.number().int().min(1),
  bookingId: z.string().optional(),
});

function calculateEmi(principal, annualRate, months) {
  const monthlyRate = annualRate / 1200;
  const factor = (1 + monthlyRate) ** months;
  return Math.round((principal * monthlyRate * factor) / (factor - 1));
}

export async function applyLoan(req, res) {
  const payload = applyLoanSchema.parse(req.body);
  const emiAmount = calculateEmi(payload.principal, payload.interestRateAnnual, payload.tenureMonths);

  const loan = await Loan.create({
    tenantId: req.user.userId,
    bookingId: payload.bookingId,
    principal: payload.principal,
    interestRateAnnual: payload.interestRateAnnual,
    tenureMonths: payload.tenureMonths,
    emiAmount,
  });

  return res.status(StatusCodes.CREATED).json(loan);
}

export async function getMyLoans(req, res) {
  const loans = await Loan.find({ tenantId: req.user.userId }).sort({ createdAt: -1 });
  return res.status(StatusCodes.OK).json(loans);
}
