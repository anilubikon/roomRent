import 'package:go_router/go_router.dart';
import '../features/auth/presentation/screens/login_signup_screen.dart';
import '../features/auth/presentation/screens/splash_screen.dart';
import '../features/chat/presentation/screens/chat_screen.dart';
import '../features/dashboard/presentation/screens/owner_dashboard_screen.dart';
import '../features/history/presentation/screens/booking_rent_history_screen.dart';
import '../features/home/presentation/screens/home_screen.dart';
import '../features/loan/presentation/screens/loan_emi_screen.dart';
import '../features/notification/presentation/screens/notifications_screen.dart';
import '../features/payment/presentation/screens/payment_screen.dart';
import '../features/profile/presentation/screens/user_profile_screen.dart';
import '../features/property/presentation/screens/add_property_screen.dart';
import '../features/property/presentation/screens/property_detail_screen.dart';
import '../features/property/presentation/screens/property_listing_screen.dart';
import '../features/video/presentation/screens/video_call_screen.dart';
import '../features/wallet/presentation/screens/wallet_screen.dart';

final appRouter = GoRouter(
  initialLocation: '/splash',
  routes: [
    GoRoute(path: '/splash', builder: (_, __) => const SplashScreen()),
    GoRoute(path: '/auth', builder: (_, __) => const LoginSignupScreen()),
    GoRoute(path: '/', builder: (_, __) => const HomeScreen()),
    GoRoute(path: '/properties', builder: (_, __) => const PropertyListingScreen()),
    GoRoute(path: '/property-detail', builder: (_, __) => const PropertyDetailScreen()),
    GoRoute(path: '/add-property', builder: (_, __) => const AddPropertyScreen()),
    GoRoute(path: '/chat', builder: (_, __) => const ChatScreen()),
    GoRoute(path: '/video-call', builder: (_, __) => const VideoCallScreen()),
    GoRoute(path: '/wallet', builder: (_, __) => const WalletScreen()),
    GoRoute(path: '/payment', builder: (_, __) => const PaymentScreen()),
    GoRoute(path: '/loan', builder: (_, __) => const LoanEmiScreen()),
    GoRoute(path: '/profile', builder: (_, __) => const UserProfileScreen()),
    GoRoute(path: '/owner-dashboard', builder: (_, __) => const OwnerDashboardScreen()),
    GoRoute(path: '/history', builder: (_, __) => const BookingRentHistoryScreen()),
    GoRoute(path: '/notifications', builder: (_, __) => const NotificationsScreen()),
  ],
  redirect: (_, state) {
    if (state.uri.path == '/splash') return '/auth';
    if (state.uri.path == '/auth') return '/';
    return null;
  },
);
