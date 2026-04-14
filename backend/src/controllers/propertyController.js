import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';
import { Property } from '../models/Property.js';

const createPropertySchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  type: z.enum(['house', 'flat', 'room', 'shop', 'pg']),
  bhk: z.number().min(0).optional(),
  rent: z.number().positive(),
  securityDeposit: z.number().min(0).optional(),
  amenities: z.array(z.string()).optional(),
  media: z.array(z.string()).optional(),
  address: z.string().min(5),
  city: z.string().min(2),
  state: z.string().min(2),
  pincode: z.string().min(4),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

export async function createProperty(req, res) {
  const payload = createPropertySchema.parse(req.body);
  const property = await Property.create({
    ...payload,
    location: {
      type: 'Point',
      coordinates: [payload.lng ?? 0, payload.lat ?? 0],
    },
    listedBy: req.user.userId,
  });
  return res.status(StatusCodes.CREATED).json(property);
}

export async function getProperties(req, res) {
  const { city, type, minRent, maxRent, bhk, lat, lng, radiusKm = 5 } = req.query;
  const filter = { isActive: true };

  if (city) filter.city = city;
  if (type) filter.type = type;
  if (bhk) filter.bhk = Number(bhk);
  if (minRent || maxRent) {
    filter.rent = {};
    if (minRent) filter.rent.$gte = Number(minRent);
    if (maxRent) filter.rent.$lte = Number(maxRent);
  }

  if (lat && lng) {
    filter.location = {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [Number(lng), Number(lat)],
        },
        $maxDistance: Number(radiusKm) * 1000,
      },
    };
  }

  const properties = await Property.find(filter).sort({ isFeatured: -1, createdAt: -1 }).limit(100);
  return res.status(StatusCodes.OK).json(properties);
}

export async function getPropertyById(req, res) {
  const property = await Property.findById(req.params.id).populate('listedBy', 'name role phone');
  if (!property) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: 'Property not found' });
  }
  return res.status(StatusCodes.OK).json(property);
}
