import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';
import { Listing } from '../models/Listing.js';

const listingSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  city: z.string().min(2),
  address: z.string().min(5),
  monthlyRent: z.number().positive(),
  category: z.enum(['room', 'flat', 'pg', 'hostel']).optional(),
  suitableFor: z.enum(['student', 'family', 'any']).optional(),
});

export async function createListing(req, res) {
  const payload = listingSchema.parse(req.body);
  const listing = await Listing.create({
    ...payload,
    ownerId: req.user.userId,
  });

  return res.status(StatusCodes.CREATED).json(listing);
}

export async function searchListings(req, res) {
  const { city, suitableFor, category, minRent, maxRent } = req.query;

  const filter = { isActive: true };
  if (city) filter.city = city;
  if (suitableFor) filter.suitableFor = suitableFor;
  if (category) filter.category = category;
  if (minRent || maxRent) {
    filter.monthlyRent = {};
    if (minRent) filter.monthlyRent.$gte = Number(minRent);
    if (maxRent) filter.monthlyRent.$lte = Number(maxRent);
  }

  const listings = await Listing.find(filter).sort({ createdAt: -1 });
  return res.status(StatusCodes.OK).json(listings);
}
