import { StatusCodes } from 'http-status-codes';
import { Notification } from '../models/Notification.js';

export async function getNotifications(req, res) {
  const notifications = await Notification.find({ userId: req.user.userId }).sort({ createdAt: -1 });
  return res.status(StatusCodes.OK).json(notifications);
}

export async function markNotificationRead(req, res) {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.userId },
    { isRead: true },
    { new: true }
  );

  if (!notification) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: 'Notification not found' });
  }

  return res.status(StatusCodes.OK).json(notification);
}
