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

  void dispose() => socket?.dispose();
}
