import 'package:flutter/material.dart';
import '../../../common/presentation/feature_scaffold.dart';

class BookingRentHistoryScreen extends StatelessWidget {
  const BookingRentHistoryScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const FeatureScaffold(
      title: 'Booking / Rent History',
      description: 'Booking lifecycle, paid rent logs, receipts, and due statuses.',
    );
  }
}
