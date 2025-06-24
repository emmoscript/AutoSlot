import '../models/user.dart';

class AuthService {
  static User? _currentUser;

  static User? get currentUser => _currentUser;

  static bool login(String email, String password) {
    // Simulación: cualquier email/contraseña válida permite login
    _currentUser = User(name: 'Juan Pérez', email: email, vehiclePlate: 'ABC123');
    return true;
  }

  static bool register(String name, String email, String password, String plate) {
    _currentUser = User(name: name, email: email, vehiclePlate: plate);
    return true;
  }

  static void logout() {
    _currentUser = null;
  }
} 