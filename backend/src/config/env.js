import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(5000),
  MONGO_URI: z.string().default(''),
  JWT_SECRET: z.string().min(8).default('dev_secret_123'),
  CORS_ORIGINS: z.string().default('http://localhost:3000,http://localhost:8080'),
  CLIENT_URL: z.string().optional(),
  RAZORPAY_KEY_ID: z.string().default(''),
  RAZORPAY_KEY_SECRET: z.string().default(''),
  REDIS_URL: z.string().default('redis://localhost:6379'),
  ENABLE_DEMO_JOBS: z
    .string()
    .optional()
    .transform((value) => value === 'true'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment configuration', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

const rawEnv = parsed.data;
const fallbackClientUrl = rawEnv.CLIENT_URL ? [rawEnv.CLIENT_URL] : [];
const corsOrigins = rawEnv.CORS_ORIGINS.split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

if (!corsOrigins.length) {
  corsOrigins.push(...fallbackClientUrl);
}

if (rawEnv.NODE_ENV === 'production') {
  const missing = [];

  if (!rawEnv.MONGO_URI) missing.push('MONGO_URI');
  if (!rawEnv.RAZORPAY_KEY_ID) missing.push('RAZORPAY_KEY_ID');
  if (!rawEnv.RAZORPAY_KEY_SECRET) missing.push('RAZORPAY_KEY_SECRET');

  if (missing.length > 0) {
    console.error(`Missing required production env vars: ${missing.join(', ')}`);
    process.exit(1);
  }
}

export const env = {
  nodeEnv: rawEnv.NODE_ENV,
  port: rawEnv.PORT,
  mongoUri: rawEnv.MONGO_URI,
  jwtSecret: rawEnv.JWT_SECRET,
  razorpayKeyId: rawEnv.RAZORPAY_KEY_ID,
  razorpayKeySecret: rawEnv.RAZORPAY_KEY_SECRET,
  redisUrl: rawEnv.REDIS_URL,
  enableDemoJobs: rawEnv.ENABLE_DEMO_JOBS ?? false,
  corsOrigins: corsOrigins.length ? corsOrigins : ['*'],
  clientUrl: corsOrigins[0] || '*',
};
