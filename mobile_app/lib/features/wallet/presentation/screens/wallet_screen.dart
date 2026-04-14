import 'package:flutter/material.dart';
import '../../../common/presentation/feature_scaffold.dart';

class WalletScreen extends StatelessWidget {
  const WalletScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const FeatureScaffold(
      title: 'Wallet',
      description: 'Add money, wallet balance, auto-rent debit and transaction timeline.',
    );
  }
}
