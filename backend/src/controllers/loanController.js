import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';
import { RentHelpCredit } from '../models/RentHelpCredit.js';

const simulateRentHelpSchema = z.object({
  principal: z.number().positive(),
  convenienceFeePercent: z.number().min(0).max(10).default(2),
  tenureMonths: z.number().int().min(1),
});

function calculateEmi(principal, months) {
  return Number((principal / months).toFixed(2));
}

export async function applyLoan(req, res) {
  const payload = simulateRentHelpSchema.parse(req.body);
  const fee = Number((payload.principal * (payload.convenienceFeePercent / 100)).toFixed(2));
  const totalPayable = Number((payload.principal + fee).toFixed(2));

  const simulation = {
    principal: payload.principal,
    convenienceFee: fee,
    totalPayable,
    tenureMonths: payload.tenureMonths,
    emiAmount: calculateEmi(totalPayable, payload.tenureMonths),
    message: 'Simulation only. Admin approval is required to disburse Rent Help credit.',
  };

  return res.status(StatusCodes.OK).json(simulation);
}

export async function getMyLoans(req, res) {
  const credits = await RentHelpCredit.find({ tenantId: req.user.userId }).sort({ createdAt: -1 });
  return res.status(StatusCodes.OK).json(credits);
}
