import 'package:flutter/material.dart';
import '../../../common/presentation/feature_scaffold.dart';

class LoginSignupScreen extends StatelessWidget {
  const LoginSignupScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const FeatureScaffold(
      title: 'Login / Signup (OTP)',
      description: 'OTP based login/signup flow. Integrate Firebase/MessageCentral for production.',
    );
  }
}
