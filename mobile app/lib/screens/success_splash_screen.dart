import 'package:flutter/material.dart';

class SuccessSplashScreen extends StatefulWidget {
  final String message; // Optional message to display

  const SuccessSplashScreen({super.key, this.message = '¡Reserva Exitosa!'});

  @override
  State<SuccessSplashScreen> createState() => _SuccessSplashScreenState();
}

class _SuccessSplashScreenState extends State<SuccessSplashScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _animationController;
  late Animation<double> _scaleAnimation;
  late Animation<double> _opacityAnimation;

  @override
  void initState() {
    super.initState();

    _animationController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1500), // Total animation duration
    );

    // Scale animation for the checkmark
    _scaleAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _animationController,
        curve: const Interval(
          0.0,
          0.7,
          curve: Curves.elasticOut,
        ), // Checkmark grows with elastic effect
      ),
    );

    // Opacity animation for the text message
    _opacityAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _animationController,
        curve: const Interval(
          0.6,
          1.0,
          curve: Curves.easeIn,
        ), // Text fades in after checkmark starts
      ),
    );

    // Start the animation when the screen initializes
    _animationController.forward();

    // Navigate back to home after a delay when the animation completes
    _animationController.addStatusListener((status) {
      if (status == AnimationStatus.completed) {
        Future.delayed(const Duration(seconds: 1), () {
          // Changed delay to 1 second
          // Check if the widget is still mounted before navigating
          if (mounted) {
            Navigator.of(context).pop(); // Pop all screens until home
          }
        });
      }
    });
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.green[300], // Green background for success
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            ScaleTransition(
              scale: _scaleAnimation,
              child: Container(
                padding: const EdgeInsets.all(20),
                decoration: const BoxDecoration(
                  color: Colors.white,
                  shape: BoxShape.circle,
                ),
                child: Icon(
                  Icons.check,
                  color: Colors.green.shade400,
                  size: 80,
                ),
              ),
            ),
            const SizedBox(height: 30),
            FadeTransition(
              opacity: _opacityAnimation,
              child: Text(
                widget.message,
                textAlign: TextAlign.center,
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 28,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
