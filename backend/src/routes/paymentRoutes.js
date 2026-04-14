import { Router } from 'express';
import {
  createPaymentOrder,
  listMyPayments,
  payRentFromWallet,
  verifyPayment,
} from '../controllers/paymentController.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();

router.post('/order', authRequired, createPaymentOrder);
router.post('/verify', authRequired, verifyPayment);
router.post('/rent/wallet', authRequired, payRentFromWallet);
router.get('/mine', authRequired, listMyPayments);

export default router;
