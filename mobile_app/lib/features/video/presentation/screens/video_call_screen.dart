import 'package:flutter/material.dart';
import '../../../common/presentation/feature_scaffold.dart';

class VideoCallScreen extends StatelessWidget {
  const VideoCallScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const FeatureScaffold(
      title: 'Video Call',
      description: 'WebRTC based call screen with signaling via socket events.',
    );
  }
}
