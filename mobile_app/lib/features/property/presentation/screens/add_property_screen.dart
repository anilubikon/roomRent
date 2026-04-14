import 'package:flutter/material.dart';
import '../../../common/presentation/feature_scaffold.dart';

class AddPropertyScreen extends StatelessWidget {
  const AddPropertyScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const FeatureScaffold(
      title: 'Add Property',
      description: 'Owner/Agent property onboarding with Cloudinary media upload and KYC checks.',
    );
  }
}
