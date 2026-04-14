import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    type: { type: String, enum: ['house', 'flat', 'room', 'shop', 'pg'], required: true },
    bhk: { type: Number, min: 0, default: 1 },
    rent: { type: Number, required: true, min: 0 },
    securityDeposit: { type: Number, default: 0 },
    amenities: [{ type: String }],
    media: [{ type: String }],
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        index: '2dsphere',
        default: [0, 0],
      },
    },
    listedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    averageRating: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Property = mongoose.model('Property', propertySchema);
