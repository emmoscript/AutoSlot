import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'screens/splash_screen.dart';
import 'screens/feed_screen.dart';
import 'screens/home_screen.dart';
import 'screens/reservations_screen.dart';
import 'screens/save_payment_screen.dart';
import 'screens/profile_screen.dart';
import 'screens/login_screen.dart';
import 'screens/register_screen.dart';
import 'models/user.dart';
import 'services/auth_service.dart';

class UserProvider extends ChangeNotifier {
  User? _user;
  User? get user => _user;

  Future<void> loadUser() async {
    _user = await AuthService.fetchCurrentUser();
    notifyListeners();
  }

  Future<bool> login(String email, String password) async {
    try {
      final user = await AuthService.login(email, password);
      if (user != null) {
        _user = user;
        notifyListeners();
        return true;
      }
      return false;
    } catch (e) {
      print('Login error in UserProvider: $e');
      return false;
    }
  }

  Future<bool> register(String name, String email, String password, String plate, String brand, String model, String color, String phone) async {
    try {
      final user = await AuthService.register(name, email, password, plate, brand, model, color, phone);
      if (user != null) {
        _user = user;
        notifyListeners();
        return true;
      }
      return false;
    } catch (e) {
      print('Register error in UserProvider: $e');
      return false;
    }
  }

  Future<bool> updateProfile({
    String? name,
    String? vehiclePlate,
    String? phone,
  }) async {
    try {
      final updatedUser = await AuthService.updateProfile(
        name: name,
        vehiclePlate: vehiclePlate,
        phone: phone,
      );
      if (updatedUser != null) {
        _user = updatedUser;
        notifyListeners();
        return true;
      }
      return false;
    } catch (e) {
      print('Update profile error in UserProvider: $e');
      return false;
    }
  }

  Future<void> logout() async {
    await AuthService.logout();
    _user = null;
    notifyListeners();
  }
}

void main() {
  runApp(
    ChangeNotifierProvider(
      create: (_) => UserProvider()..loadUser(),
      child: const AutoSlotApp(),
    ),
  );
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
        '/feed': (context) => _requireAuth(context, const FeedScreen()),
        '/map': (context) => _requireAuth(context, const HomeScreen()),
        '/reservations': (context) =>
            _requireAuth(context, const ReservationsScreen()),
        '/payment': (context) =>
            _requireAuth(context, const SavePaymentScreen()),
        '/profile': (context) => _requireAuth(context, const ProfileScreen()),
      },
      debugShowCheckedModeBanner: false,
    );
  }
}

Widget _requireAuth(BuildContext context, Widget screen) {
  return Consumer<UserProvider>(
    builder: (context, userProvider, child) {
      if (userProvider.user == null) {
        // Redirect to login instead of returning LoginScreen directly
        WidgetsBinding.instance.addPostFrameCallback((_) {
          Navigator.of(context).pushReplacementNamed('/login');
        });
        return const Scaffold(
          body: Center(child: CircularProgressIndicator()),
        );
      }
      return screen;
    },
  );
}
