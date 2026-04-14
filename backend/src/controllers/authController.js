import bcrypt from 'bcryptjs';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';
import { User } from '../models/User.js';
import { signToken } from '../utils/jwt.js';

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  password: z.string().min(6),
  role: z.enum(['student', 'family', 'owner', 'agent']).optional(),
});

export async function register(req, res) {
  const payload = registerSchema.parse(req.body);

  const exists = await User.findOne({ email: payload.email });
  if (exists) {
    return res.status(StatusCodes.CONFLICT).json({ message: 'Email already exists' });
  }

  const passwordHash = await bcrypt.hash(payload.password, 10);
  const user = await User.create({ ...payload, passwordHash });
  const token = signToken({ userId: user._id, role: user.role, email: user.email });

  return res.status(StatusCodes.CREATED).json({ token, user });
}

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function login(req, res) {
  const payload = loginSchema.parse(req.body);
  const user = await User.findOne({ email: payload.email });

  if (!user) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid credentials' });
  }

  const ok = await bcrypt.compare(payload.password, user.passwordHash);
  if (!ok) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid credentials' });
  }

  const token = signToken({ userId: user._id, role: user.role, email: user.email });
  return res.status(StatusCodes.OK).json({ token, user });
}
