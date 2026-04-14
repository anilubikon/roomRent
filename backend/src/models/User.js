import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, unique: true },
    passwordHash: { type: String },
    role: {
      type: String,
      enum: ['tenant', 'owner', 'agent', 'admin'],
      default: 'tenant',
    },
    preferredLanguage: { type: String, default: 'en' },
    kycStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
    },
    companyMarginPercent: { type: Number, default: 5 },
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);
