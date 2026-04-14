import 'package:flutter/material.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Room Rent Marketplace')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: const [
          _FeatureTile(title: 'Search Flats/Rooms', subtitle: 'Student & family filters'),
          _FeatureTile(title: 'Add Listing', subtitle: 'Owner/Agent can post listings'),
          _FeatureTile(title: 'Rent Payment', subtitle: 'Full rent or EMI via Razorpay'),
          _FeatureTile(title: 'Realtime Chat', subtitle: 'Socket.IO chat between users and owners'),
          _FeatureTile(title: 'Video Call', subtitle: 'WebRTC signaling over Socket.IO'),
        ],
      ),
    );
  }
}

class _FeatureTile extends StatelessWidget {
  final String title;
  final String subtitle;

  const _FeatureTile({required this.title, required this.subtitle});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        title: Text(title),
        subtitle: Text(subtitle),
      ),
    );
  }
}
