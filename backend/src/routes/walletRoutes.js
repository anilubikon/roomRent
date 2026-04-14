import { Router } from 'express';
import {
  getWallet,
  getWalletTransactions,
  grantRentHelp,
  repayRentHelp,
  topUpWallet,
} from '../controllers/walletController.js';
import { allowRoles, authRequired } from '../middleware/auth.js';

const router = Router();

router.get('/', authRequired, getWallet);
router.get('/transactions', authRequired, getWalletTransactions);
router.post('/topup', authRequired, topUpWallet);
router.post('/rent-help/grant', authRequired, allowRoles('admin'), grantRentHelp);
router.post('/rent-help/repay', authRequired, repayRentHelp);

export default router;
