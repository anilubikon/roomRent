import { Router } from 'express';
import { getNotifications, markNotificationRead } from '../controllers/notificationController.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();

router.get('/', authRequired, getNotifications);
router.patch('/:id/read', authRequired, markNotificationRead);

export default router;
