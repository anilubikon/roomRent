import 'package:flutter/material.dart';
import '../../../common/presentation/feature_scaffold.dart';

class UserProfileScreen extends StatelessWidget {
  const UserProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const FeatureScaffold(
      title: 'User Profile',
      description: 'Manage identity, KYC status, preferences and account security.',
    );
  }
}
