import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../main.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({Key? key}) : super(key: key);

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _animation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 2),
    );
    _animation = CurvedAnimation(parent: _controller, curve: Curves.easeInOut);
    _controller.forward();
    
    _checkAuthAndNavigate();
  }
  
  void _checkAuthAndNavigate() async {
    // Wait for the splash animation
    await Future.delayed(const Duration(seconds: 2));
    
    if (!mounted) return;
    
    // Check if user is logged in
    final userProvider = Provider.of<UserProvider>(context, listen: false);
    
    if (userProvider.user != null) {
      // User is logged in, go to feed
      Navigator.of(context).pushReplacementNamed('/feed');
    } else {
      // User not logged in, go to login
      Navigator.of(context).pushReplacementNamed('/login');
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.blue[50],
      body: Center(
        child: FadeTransition(
          opacity: _animation,
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: const [
              Icon(Icons.local_parking, size: 80, color: Colors.blue),
              SizedBox(height: 24),
              Text('AutoSlot', style: TextStyle(fontSize: 36, fontWeight: FontWeight.bold, color: Colors.blue)),
              SizedBox(height: 12),
              Text('Smart Parking System', style: TextStyle(fontSize: 18, color: Colors.black54)),
            ],
          ),
        ),
      ),
    );
  }
} 