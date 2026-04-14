import { Router } from 'express';
import { getWallet, topUpWallet } from '../controllers/walletController.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();

router.get('/', authRequired, getWallet);
router.post('/topup', authRequired, topUpWallet);

export default router;
