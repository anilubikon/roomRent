import bcrypt from 'bcryptjs';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';
import { OtpCode } from '../models/OtpCode.js';
import { User } from '../models/User.js';
import { signToken } from '../utils/jwt.js';

const sendOtpSchema = z.object({
  phone: z.string().min(8),
});

export async function sendOtp(req, res) {
  const payload = sendOtpSchema.parse(req.body);
  const code = process.env.NODE_ENV === 'production' ? '******' : '123456';

  await OtpCode.findOneAndUpdate(
    { phone: payload.phone },
    {
      code: '123456',
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    },
    { upsert: true, new: true }
  );

  return res.status(StatusCodes.OK).json({ message: 'OTP sent', otpForDev: code });
}

const verifyOtpSchema = z.object({
  phone: z.string().min(8),
  otp: z.string().length(6),
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  role: z.enum(['tenant', 'owner', 'agent']).optional(),
});

export async function verifyOtp(req, res) {
  const payload = verifyOtpSchema.parse(req.body);
  const otpDoc = await OtpCode.findOne({ phone: payload.phone });

  if (!otpDoc || otpDoc.code !== payload.otp || otpDoc.expiresAt < new Date()) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid or expired OTP' });
  }

  let user = await User.findOne({ phone: payload.phone });
  if (!user) {
    user = await User.create({
      phone: payload.phone,
      name: payload.name ?? 'New User',
      email: payload.email ?? `${payload.phone}@example.local`,
      role: payload.role ?? 'tenant',
    });
  }

  await OtpCode.deleteMany({ phone: payload.phone });
  const token = signToken({ userId: user._id, role: user.role, phone: user.phone });

  return res.status(StatusCodes.OK).json({ token, user });
}

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(8),
  password: z.string().min(6),
  role: z.enum(['tenant', 'owner', 'agent']).optional(),
});

export async function register(req, res) {
  const payload = registerSchema.parse(req.body);

  const exists = await User.findOne({ $or: [{ email: payload.email }, { phone: payload.phone }] });
  if (exists) {
    return res.status(StatusCodes.CONFLICT).json({ message: 'User already exists' });
  }

  const passwordHash = await bcrypt.hash(payload.password, 10);
  const user = await User.create({ ...payload, passwordHash });
  const token = signToken({ userId: user._id, role: user.role, email: user.email });

  return res.status(StatusCodes.CREATED).json({ token, user });
}
