import { Router } from 'express';
import { applyLoan, getMyLoans } from '../controllers/loanController.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();

router.post('/apply', authRequired, applyLoan);
router.get('/mine', authRequired, getMyLoans);

export default router;
