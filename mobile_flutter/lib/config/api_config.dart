class ApiConfig {
  static const String baseUrl = 'http://82.208.22.230:3000';
  static const String apiUrl = '$baseUrl/api';
  
  // Auth endpoints
  static const String loginUrl = '$apiUrl/auth/login';
  static const String profileUrl = '$apiUrl/auth/profile';
  
  // CRUD endpoints
  static const String organisationsUrl = '$apiUrl/organisations';
  static const String sectionsUrl = '$apiUrl/sections';
  static const String villagesUrl = '$apiUrl/villages';
  static const String producteursUrl = '$apiUrl/producteurs';
  static const String parcellesUrl = '$apiUrl/parcelles';
  static const String operationsUrl = '$apiUrl/operations';
  
  // Socket.IO
  static const String socketUrl = baseUrl;
}
