import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final items = <({String title, String route})>[
      (title: 'Properties', route: '/properties'),
      (title: 'Add Property', route: '/add-property'),
      (title: 'Chat', route: '/chat'),
      (title: 'Video Call', route: '/video-call'),
      (title: 'Wallet', route: '/wallet'),
      (title: 'Payments', route: '/payment'),
      (title: 'Loan / EMI', route: '/loan'),
      (title: 'Profile', route: '/profile'),
      (title: 'Owner Dashboard', route: '/owner-dashboard'),
      (title: 'History', route: '/history'),
      (title: 'Notifications', route: '/notifications'),
    ];

    return Scaffold(
      appBar: AppBar(title: const Text('RentFlow')),
      body: GridView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: items.length,
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2,
          mainAxisSpacing: 12,
          crossAxisSpacing: 12,
          childAspectRatio: 1.3,
        ),
        itemBuilder: (context, index) {
          final item = items[index];
          return Card(
            child: InkWell(
              onTap: () => context.push(item.route),
              child: Center(child: Text(item.title, textAlign: TextAlign.center)),
            ),
          );
        },
      ),
    );
  }
}
