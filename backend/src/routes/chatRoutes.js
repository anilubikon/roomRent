import { Router } from 'express';
import { getMessages } from '../controllers/chatController.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();

router.get('/:roomId/messages', authRequired, getMessages);

export default router;
