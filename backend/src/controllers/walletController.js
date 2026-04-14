import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';
import { Wallet } from '../models/Wallet.js';

const topUpSchema = z.object({ amount: z.number().positive() });

export async function getWallet(req, res) {
  const wallet = await Wallet.findOneAndUpdate(
    { userId: req.user.userId },
    { $setOnInsert: { balance: 0 } },
    { upsert: true, new: true }
  );

  return res.status(StatusCodes.OK).json(wallet);
}

export async function topUpWallet(req, res) {
  const payload = topUpSchema.parse(req.body);
  const wallet = await Wallet.findOneAndUpdate(
    { userId: req.user.userId },
    { $inc: { balance: payload.amount } },
    { upsert: true, new: true }
  );

  return res.status(StatusCodes.OK).json(wallet);
}
