import 'package:flutter/material.dart';
import 'screens/splash_screen.dart';
import 'screens/feed_screen.dart';
import 'screens/home_screen.dart';
import 'screens/reservations_screen.dart';
import 'screens/save_payment_screen.dart';
import 'screens/profile_screen.dart';
import 'screens/login_screen.dart';
import 'screens/register_screen.dart';
import 'services/auth_service.dart';

void main() {
  runApp(const AutoSlotApp());
}

class AutoSlotApp extends StatelessWidget {
  const AutoSlotApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'AutoSlot',
      theme: ThemeData(primarySwatch: Colors.blue),
      initialRoute: '/',
      routes: {
        '/': (context) => const SplashScreen(),
        '/login': (context) => const LoginScreen(),
        '/register': (context) => const RegisterScreen(),
        '/feed': (context) => _requireAuth(const FeedScreen()),
        '/map': (context) => _requireAuth(const HomeScreen()),
        '/reservations': (context) => _requireAuth(const ReservationsScreen()),
        '/payment': (context) => _requireAuth(const SavePaymentScreen()),
        '/profile': (context) => _requireAuth(const ProfileScreen()),
      },
      debugShowCheckedModeBanner: false,
    );
  }
}

Widget _requireAuth(Widget screen) {
  if (AuthService.currentUser == null) {
    return const LoginScreen();
  }
  return screen;
}
