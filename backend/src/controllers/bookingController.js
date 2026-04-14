import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';
import { Booking } from '../models/Booking.js';
import { Property } from '../models/Property.js';

const bookingSchema = z.object({
  propertyId: z.string().min(1),
  startDate: z.string().date(),
});

export async function createBooking(req, res) {
  const payload = bookingSchema.parse(req.body);
  const property = await Property.findById(payload.propertyId);
  if (!property) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: 'Property not found' });
  }

  const booking = await Booking.create({
    propertyId: property._id,
    tenantId: req.user.userId,
    ownerId: property.listedBy,
    startDate: payload.startDate,
    monthlyRent: property.rent,
  });

  return res.status(StatusCodes.CREATED).json(booking);
}

export async function getMyBookings(req, res) {
  const bookings = await Booking.find({ tenantId: req.user.userId })
    .populate('propertyId')
    .sort({ createdAt: -1 });

  return res.status(StatusCodes.OK).json(bookings);
}
