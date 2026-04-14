import 'package:flutter/material.dart';
import '../../../common/presentation/feature_scaffold.dart';

class OwnerDashboardScreen extends StatelessWidget {
  const OwnerDashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const FeatureScaffold(
      title: 'Owner Dashboard',
      description: 'Monthly earnings, pending dues, occupancy, and graph analytics overview.',
    );
  }
}
