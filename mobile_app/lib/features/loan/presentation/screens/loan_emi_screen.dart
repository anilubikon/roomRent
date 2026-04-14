import 'package:flutter/material.dart';
import '../../../common/presentation/feature_scaffold.dart';

class LoanEmiScreen extends StatelessWidget {
  const LoanEmiScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const FeatureScaffold(
      title: 'Loan / EMI',
      description: 'Instant rent loan, EMI calculator, repayment schedule and due reminders.',
    );
  }
}
