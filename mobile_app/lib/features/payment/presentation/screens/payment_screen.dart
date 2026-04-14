import 'package:flutter/material.dart';
import '../../../common/presentation/feature_scaffold.dart';

class PaymentScreen extends StatelessWidget {
  const PaymentScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const FeatureScaffold(
      title: 'Payment',
      description: 'Razorpay checkout integration with secure signature verification and receipts.',
    );
  }
}
