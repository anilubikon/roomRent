import mongoose from 'mongoose';
import { env } from './env.js';

export async function connectDb() {
  if (!env.mongoUri) {
    console.warn('MONGO_URI missing; running without DB connection');
    return;
  }

  await mongoose.connect(env.mongoUri);
  console.log('MongoDB connected');
}
