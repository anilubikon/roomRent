import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ['student', 'family', 'owner', 'agent', 'admin'],
      default: 'student',
    },
    companyMarginPercent: { type: Number, default: 5 },
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);
