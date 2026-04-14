import 'package:flutter/material.dart';
import '../../../common/presentation/feature_scaffold.dart';

class ChatScreen extends StatelessWidget {
  const ChatScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const FeatureScaffold(
      title: 'Chat',
      description: 'Realtime Socket.io based chat for tenant-owner-agent conversations.',
    );
  }
}
