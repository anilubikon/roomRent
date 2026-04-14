import 'package:flutter/material.dart';
import '../../../common/presentation/feature_scaffold.dart';

class PropertyDetailScreen extends StatelessWidget {
  const PropertyDetailScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const FeatureScaffold(
      title: 'Property Detail',
      description: 'Gallery, video tour, pricing, amenities, owner profile, reviews and booking CTA.',
    );
  }
}
