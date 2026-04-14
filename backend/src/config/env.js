import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI || '',
  jwtSecret: process.env.JWT_SECRET || 'dev_secret',
  razorpayKeyId: process.env.RAZORPAY_KEY_ID || '',
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET || '',
  clientUrl: process.env.CLIENT_URL || '*',
  redisUrl: process.env.REDIS_URL || '',
  enableDemoJobs: process.env.ENABLE_DEMO_JOBS === 'true',
};
