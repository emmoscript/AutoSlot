// services/auth_service.dart
import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/user.dart';
import '../config/api_config.dart';

class AuthService {
  static User? _currentUser;
  static String? _token;

  static User? get currentUser => _currentUser;
  static String? get token => _token;

  static Future<User?> login(String email, String password) async {
    try {
      print('🔄 Attempting login for: $email');
      final response = await http.post(
        Uri.parse(ApiConfig.authLogin),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'email': email, 'password': password}),
      );

      print('📡 Login response status: ${response.statusCode}');
      print('📡 Login response body: ${response.body}');

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        
        // Check if login was actually successful
        if (data['token'] != null && data['user'] != null) {
          _token = data['token'];
          _currentUser = User.fromJson(data['user']);
          print('✅ Login successful, user: ${_currentUser?.email}');
          return _currentUser;
        } else {
          print('❌ Login failed - no token or user: ${data}');
          return null;
        }
      } else {
        print('❌ HTTP Error: ${response.statusCode} - ${response.body}');
        return null;
      }
    } catch (e) {
      print('❌ Exception during login: $e');
      return null;
    }
  }

  static Future<void> logout() async {
    try {
      await http.post(
        Uri.parse(ApiConfig.authLogout),
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
        Uri.parse(ApiConfig.authMe),
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
    String brand,
    String model,
    String color,
    String phone,
  ) async {
    try {
      print('🔄 Attempting registration for: $email');
      print('📡 Registration URL: ${ApiConfig.authRegister}');
      
      final requestBody = {
        'name': name,
        'email': email,
        'password': password,
        'vehicle_plate': plate,
        'vehicle_brand': brand,
        'vehicle_model': model,
        'vehicle_color': color,
        'phone': phone,
      };
      
      print('📤 Request body: ${jsonEncode(requestBody)}');
      
      final response = await http.post(
        Uri.parse(ApiConfig.authRegister),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(requestBody),
      ).timeout(
        const Duration(seconds: 30),
        onTimeout: () {
          throw Exception('Request timeout');
        },
      );

      print('📡 Registration response status: ${response.statusCode}');
      print('📡 Registration response body: ${response.body}');

      if (response.statusCode == 201 || response.statusCode == 200) {
        final data = json.decode(response.body);
        _token = data['token'];
        _currentUser = User.fromJson(data['user'] ?? data);
        print('✅ Registration successful for: ${_currentUser?.email}');
        return _currentUser;
      } else {
        print('❌ Registration failed with status: ${response.statusCode}');
        print('❌ Error response: ${response.body}');
        throw Exception('Registration failed: ${response.body}');
      }
    } catch (e) {
      print('❌ Exception during registration: $e');
      throw Exception('Registration error: $e');
    }
  }

  static Future<User?> updateProfile({
    String? name,
    String? vehiclePlate,
    String? vehicleBrand,
    String? vehicleModel,
    String? vehicleColor,
    String? phone,
  }) async {
    try {
      final Map<String, dynamic> updateData = {};
      if (name != null) updateData['name'] = name;
      if (vehiclePlate != null) updateData['vehicle_plate'] = vehiclePlate;
      if (vehicleBrand != null) updateData['vehicle_brand'] = vehicleBrand;
      if (vehicleModel != null) updateData['vehicle_model'] = vehicleModel;
      if (vehicleColor != null) updateData['vehicle_color'] = vehicleColor;
      if (phone != null) updateData['phone'] = phone;

      print('🔄 Updating profile with: $updateData');
      
      final response = await http.put(
        Uri.parse(ApiConfig.authProfile),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $_token',
        },
        body: jsonEncode(updateData),
      );

      print('📡 Update profile response status: ${response.statusCode}');
      print('📡 Update profile response body: ${response.body}');

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true && data['user'] != null) {
          _currentUser = User.fromJson(data['user']);
          print('✅ Profile updated successfully');
          return _currentUser;
        }
      }
      
      throw Exception('Failed to update profile: ${response.body}');
    } catch (e) {
      print('❌ Exception during profile update: $e');
      throw Exception('Profile update error: $e');
    }
  }
}
