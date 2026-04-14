import 'package:socket_io_client/socket_io_client.dart' as io;

class SocketService {
  io.Socket? socket;

  void connect(String baseUrl) {
    socket = io.io(
      baseUrl,
      io.OptionBuilder().setTransports(['websocket']).enableAutoConnect().build(),
    );
  }

  void joinRoom(String roomId) => socket?.emit('join_room', {'roomId': roomId});

  void sendChat(Map<String, dynamic> payload) => socket?.emit('chat_message', payload);

  void sendOffer({required String roomId, required Map<String, dynamic> offer, required String from}) {
    socket?.emit('webrtc_offer', {'roomId': roomId, 'offer': offer, 'from': from});
  }

  void sendAnswer({required String roomId, required Map<String, dynamic> answer, required String from}) {
    socket?.emit('webrtc_answer', {'roomId': roomId, 'answer': answer, 'from': from});
  }

  void sendIceCandidate({required String roomId, required Map<String, dynamic> candidate, required String from}) {
    socket?.emit('webrtc_ice_candidate', {'roomId': roomId, 'candidate': candidate, 'from': from});
  }

  void dispose() => socket?.dispose();
}
