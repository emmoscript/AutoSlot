// config/api_config.dart
class ApiConfig {
  // Para desarrollo, usamos diferentes URLs según la plataforma
  static String get baseUrl {
    // En desarrollo, intenta múltiples opciones
    return _getDevBaseUrl();
  }
  
  static String _getDevBaseUrl() {
    // Usa la IP que sabemos que funciona desde las pruebas anteriores
    return 'http://10.0.0.92:4000';
    
    // Alternativas para diferentes entornos:
    // Android emulator: 'http://10.0.2.2:4000'
    // IP local: 'http://10.0.0.92:4000'
    // Localhost: 'http://localhost:4000'
  }
  
  // URLs específicas para diferentes entornos
  static const String androidEmulatorUrl = 'http://10.0.2.2:4000';
  static const String iOSSimulatorUrl = 'http://localhost:4000';
  static const String productionUrl = 'https://autoslot-api.herokuapp.com'; // Cuando tengas producción
  
  // Endpoints de la API
  static String get authLogin => '$baseUrl/api/auth/login';
  static String get authRegister => '$baseUrl/api/auth/register';
  static String get authLogout => '$baseUrl/api/auth/logout';
  static String get authMe => '$baseUrl/api/auth/me';
  static String get authProfile => '$baseUrl/api/auth/profile';
  static String get lots => '$baseUrl/api/lots';
  
  static String lotById(int id) => '$baseUrl/api/lots/$id';
  static String spaces(int lotId) => '$baseUrl/api/spaces?lot_id=$lotId';
}