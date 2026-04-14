import { Router } from 'express';
import { createPaymentOrder, listMyPayments, verifyPayment } from '../controllers/paymentController.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();

router.post('/order', authRequired, createPaymentOrder);
router.post('/verify', authRequired, verifyPayment);
router.get('/mine', authRequired, listMyPayments);

export default router;
