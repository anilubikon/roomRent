import { Router } from 'express';
import { createPaymentOrder, verifyPayment } from '../controllers/paymentController.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();

router.post('/order', authRequired, createPaymentOrder);
router.post('/verify', authRequired, verifyPayment);

export default router;
