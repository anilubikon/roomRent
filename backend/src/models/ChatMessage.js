import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema(
  {
    roomId: { type: String, required: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

export const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);
