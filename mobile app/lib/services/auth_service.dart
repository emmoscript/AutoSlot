// services/auth_service.dart
import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/user.dart';

class AuthService {
  static User? _currentUser;
  static String? _token;

  static User? get currentUser => _currentUser;
  static String? get token => _token;

  static Future<User?> login(String email, String password) async {
    try {
      final response = await http.post(
        Uri.parse('http://10.0.0.7:4000/api/auth/login'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'email': email, 'password': password}),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        _token = data['token'];
        _currentUser = User.fromJson(data['user'] ?? data);
        return _currentUser;
      } else {
        throw Exception('Login failed: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Login error: $e');
    }
  }

  static Future<void> logout() async {
    try {
      await http.post(
        Uri.parse('http://10.0.0.7:4000/api/auth/logout'),
        headers: {'Authorization': 'Bearer $_token'},
      );
    } finally {
      _currentUser = null;
      _token = null;
    }
  }

  static Future<User?> fetchCurrentUser() async {
    try {
      final response = await http.get(
        Uri.parse('http://10.0.0.7:4000/api/auth/me'),
        headers: {'Authorization': 'Bearer $_token'},
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        _currentUser = User.fromJson(data);
        return _currentUser;
      } else {
        _currentUser = null;
        return null;
      }
    } catch (e) {
      _currentUser = null;
      return null;
    }
  }

  static Future<User?> register(
    String name,
    String email,
    String password,
    String plate,
  ) async {
    try {
      final response = await http.post(
        Uri.parse('http://10.0.0.7:4000/api/auth/register'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'name': name,
          'email': email,
          'password': password,
          'plate': plate,
        }),
      );

      if (response.statusCode == 201 || response.statusCode == 200) {
        final data = json.decode(response.body);
        _token = data['token'];
        _currentUser = User.fromJson(data['user'] ?? data);
        return _currentUser;
      } else {
        throw Exception('Registration failed: ${response.body}');
      }
    } catch (e) {
      throw Exception('Registration error: $e');
    }
  }
}
