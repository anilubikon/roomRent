import { ChatMessage } from '../models/ChatMessage.js';

export function registerSocket(io) {
  io.on('connection', (socket) => {
    socket.on('join_room', ({ roomId }) => {
      socket.join(roomId);
    });

    socket.on('chat_message', async (payload) => {
      const message = await ChatMessage.create(payload);
      io.to(payload.roomId).emit('chat_message', message);
    });

    // WebRTC signaling for video call
    socket.on('webrtc_offer', ({ roomId, offer, from }) => {
      socket.to(roomId).emit('webrtc_offer', { offer, from });
    });

    socket.on('webrtc_answer', ({ roomId, answer, from }) => {
      socket.to(roomId).emit('webrtc_answer', { answer, from });
    });

    socket.on('webrtc_ice_candidate', ({ roomId, candidate, from }) => {
      socket.to(roomId).emit('webrtc_ice_candidate', { candidate, from });
    });
  });
}
