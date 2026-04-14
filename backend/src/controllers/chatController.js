import { StatusCodes } from 'http-status-codes';
import { ChatMessage } from '../models/ChatMessage.js';

export async function getMessages(req, res) {
  const { roomId } = req.params;
  const messages = await ChatMessage.find({ roomId }).sort({ createdAt: 1 }).limit(200);
  return res.status(StatusCodes.OK).json(messages);
}
