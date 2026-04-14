import { Router } from 'express';
import { register, sendOtp, verifyOtp } from '../controllers/authController.js';

const router = Router();

router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/register', register);

export default router;
