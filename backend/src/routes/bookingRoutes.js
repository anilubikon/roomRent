import { Router } from 'express';
import { createBooking, getMyBookings } from '../controllers/bookingController.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();

router.post('/', authRequired, createBooking);
router.get('/mine', authRequired, getMyBookings);

export default router;
