import 'package:flutter/material.dart';
import '../../../common/presentation/feature_scaffold.dart';

class PropertyListingScreen extends StatelessWidget {
  const PropertyListingScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const FeatureScaffold(
      title: 'Property Listings',
      description: 'Location-based search, filters (price/type/BHK), maps and nearby discovery.',
    );
  }
}
