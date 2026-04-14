import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { ZodError } from 'zod';
import { env } from './config/env.js';
import authRoutes from './routes/authRoutes.js';
import listingRoutes from './routes/listingRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import chatRoutes from './routes/chatRoutes.js';

export const app = express();

app.use(helmet());
app.use(cors({ origin: env.clientUrl }));
app.use(morgan('dev'));
app.use(express.json());

app.get('/health', (_, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/chat', chatRoutes);

app.use((err, _req, res, _next) => {
  if (err instanceof ZodError) {
    return res.status(400).json({ message: 'Validation error', issues: err.issues });
  }

  console.error(err);
  return res.status(500).json({ message: 'Internal server error' });
});
