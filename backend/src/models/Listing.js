import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    city: { type: String, required: true },
    address: { type: String, required: true },
    monthlyRent: { type: Number, required: true },
    category: {
      type: String,
      enum: ['room', 'flat', 'pg', 'hostel'],
      default: 'room',
    },
    suitableFor: {
      type: String,
      enum: ['student', 'family', 'any'],
      default: 'any',
    },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Listing = mongoose.model('Listing', listingSchema);
