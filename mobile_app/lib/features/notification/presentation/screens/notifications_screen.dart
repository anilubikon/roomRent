import 'package:flutter/material.dart';
import '../../../common/presentation/feature_scaffold.dart';

class NotificationsScreen extends StatelessWidget {
  const NotificationsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const FeatureScaffold(
      title: 'Notifications',
      description: 'Rent due reminders, payment success alerts, new property recommendations.',
    );
  }
}
