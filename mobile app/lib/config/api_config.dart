// config/api_config.dart
class ApiConfig {
  // Production URL - Your actual Render deployment
  static const String productionUrl = 'https://autoslot-backend-api.onrender.com';
  
  // Para desarrollo, usamos diferentes URLs según la plataforma
  static String get baseUrl {
    // Siempre usa la URL de producción para asegurar conectividad
    return productionUrl;
  }
  
  static String _getDevBaseUrl() {
    // Para el emulador, usa la URL de producción
    return productionUrl;
    
    // Alternativas para diferentes entornos:
    // Android emulator: 'http://10.0.2.2:4000'
    // IP local: 'http://10.0.0.92:4000'
    // Localhost: 'http://localhost:4000'
  }
  
  // URLs específicas para diferentes entornos (mantenidas para referencia)
  // static const String androidEmulatorUrl = 'http://10.0.2.2:4000';
  // static const String iOSSimulatorUrl = 'http://localhost:4000';
  
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