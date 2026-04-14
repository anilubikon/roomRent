import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';
import { RentHelpCredit } from '../models/RentHelpCredit.js';
import { Wallet } from '../models/Wallet.js';
import { WalletTransaction } from '../models/WalletTransaction.js';

const topUpSchema = z.object({ amount: z.number().positive() });

const grantRentHelpSchema = z.object({
  tenantId: z.string(),
  amount: z.number().min(5000).max(50000),
  tenureMonths: z.number().int().min(1).max(12).default(1),
  repaymentMode: z.enum(['full', 'emi']).default('emi'),
  convenienceFeePercent: z.number().min(0).max(10).default(2),
  bookingId: z.string().optional(),
});

const repaySchema = z.object({
  rentHelpCreditId: z.string(),
  amount: z.number().positive(),
});

function buildInstallments(totalPayable, tenureMonths) {
  const perInstallment = Number((totalPayable / tenureMonths).toFixed(2));

  return Array.from({ length: tenureMonths }, (_, index) => {
    const dueDate = new Date();
    dueDate.setMonth(dueDate.getMonth() + index + 1);

    return {
      dueDate,
      amount: index === tenureMonths - 1
        ? Number((totalPayable - perInstallment * (tenureMonths - 1)).toFixed(2))
        : perInstallment,
    };
  });
}

async function getOrCreateWallet(userId) {
  return Wallet.findOneAndUpdate(
    { userId },
    { $setOnInsert: { cashBalance: 0, rentHelpBalance: 0, rentHelpCreditLimit: 0, rentHelpConsumed: 0 } },
    { upsert: true, new: true }
  );
}

export async function getWallet(req, res) {
  const wallet = await getOrCreateWallet(req.user.userId);
  const recentTransactions = await WalletTransaction.find({ userId: req.user.userId })
    .sort({ createdAt: -1 })
    .limit(15);

  return res.status(StatusCodes.OK).json({ wallet, recentTransactions });
}

export async function topUpWallet(req, res) {
  const payload = topUpSchema.parse(req.body);
  const wallet = await Wallet.findOneAndUpdate(
    { userId: req.user.userId },
    { $inc: { cashBalance: payload.amount } },
    { upsert: true, new: true }
  );

  await WalletTransaction.create({
    userId: req.user.userId,
    type: 'topup',
    amount: payload.amount,
    direction: 'credit',
  });

  return res.status(StatusCodes.OK).json(wallet);
}

export async function grantRentHelp(req, res) {
  const payload = grantRentHelpSchema.parse(req.body);
  const convenienceFee = Number((payload.amount * (payload.convenienceFeePercent / 100)).toFixed(2));
  const totalPayable = Number((payload.amount + convenienceFee).toFixed(2));

  const wallet = await Wallet.findOneAndUpdate(
    { userId: payload.tenantId },
    {
      $inc: {
        rentHelpBalance: payload.amount,
        rentHelpCreditLimit: payload.amount,
        rentHelpConsumed: payload.amount,
      },
      $set: { isRentHelpBlocked: false },
    },
    { upsert: true, new: true }
  );

  const dueDate = new Date();
  dueDate.setMonth(dueDate.getMonth() + payload.tenureMonths);

  const rentHelpCredit = await RentHelpCredit.create({
    tenantId: payload.tenantId,
    bookingId: payload.bookingId,
    approvedByAdminId: req.user.userId,
    principal: payload.amount,
    convenienceFee,
    totalPayable,
    tenureMonths: payload.tenureMonths,
    dueDate,
    repaymentMode: payload.repaymentMode,
    installments:
      payload.repaymentMode === 'emi' ? buildInstallments(totalPayable, payload.tenureMonths) : [],
  });

  await WalletTransaction.create({
    userId: payload.tenantId,
    type: 'rent_help_credit_granted',
    amount: payload.amount,
    direction: 'credit',
    bookingId: payload.bookingId,
    metadata: {
      rentHelpCreditId: rentHelpCredit._id,
      convenienceFee,
      repaymentMode: payload.repaymentMode,
    },
  });

  return res.status(StatusCodes.CREATED).json({ wallet, rentHelpCredit });
}

export async function repayRentHelp(req, res) {
  const payload = repaySchema.parse(req.body);
  const credit = await RentHelpCredit.findOne({
    _id: payload.rentHelpCreditId,
    tenantId: req.user.userId,
    status: 'active',
  });

  if (!credit) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: 'Active Rent Help credit not found' });
  }

  const repayable = Math.max(0, Number((credit.totalPayable - credit.amountRepaid).toFixed(2)));
  const amount = Math.min(payload.amount, repayable);

  const wallet = await getOrCreateWallet(req.user.userId);
  if (wallet.cashBalance < amount) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Insufficient cash balance for repayment' });
  }

  wallet.cashBalance -= amount;
  credit.amountRepaid = Number((credit.amountRepaid + amount).toFixed(2));

  if (credit.repaymentMode === 'emi') {
    let remaining = amount;
    credit.installments = credit.installments.map((installment) => {
      if (remaining <= 0 || installment.status === 'paid') {
        return installment;
      }

      const installmentPending = Number((installment.amount + installment.lateFee - installment.amountPaid).toFixed(2));
      const chunk = Math.min(remaining, installmentPending);
      installment.amountPaid = Number((installment.amountPaid + chunk).toFixed(2));
      remaining = Number((remaining - chunk).toFixed(2));
      if (installment.amountPaid >= installment.amount + installment.lateFee) {
        installment.status = 'paid';
      }
      return installment;
    });
  }

  if (credit.amountRepaid >= credit.totalPayable) {
    credit.status = 'closed';
    wallet.rentHelpConsumed = Math.max(0, wallet.rentHelpConsumed - credit.principal);
  }

  await Promise.all([
    wallet.save(),
    credit.save(),
    WalletTransaction.create({
      userId: req.user.userId,
      type: 'rent_help_repayment',
      amount,
      direction: 'debit',
      metadata: { rentHelpCreditId: credit._id },
    }),
  ]);

  return res.status(StatusCodes.OK).json({ wallet, credit, repaidAmount: amount });
}

export async function getWalletTransactions(req, res) {
  const transactions = await WalletTransaction.find({ userId: req.user.userId }).sort({ createdAt: -1 });
  return res.status(StatusCodes.OK).json(transactions);
}
