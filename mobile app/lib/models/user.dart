class User {
  final String name;
  final String email;
  final String? vehiclePlate;
  final String? vehicleBrand;
  final String? vehicleModel;
  final String? vehicleColor;
  final String? phone;
  final String? token; // Add token field
  final String? id; // Add id field
  final String? role; // Add role field

  User({
    required this.name,
    required this.email,
    this.vehiclePlate,
    this.vehicleBrand,
    this.vehicleModel,
    this.vehicleColor,
    this.phone,
    this.token,
    this.id,
    this.role,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    print('📋 Parsing user from JSON: $json');
    final user = User(
      id: json['id']?.toString(),
      name: json['name'] ?? '',
      email: json['email'] ?? '',
      vehiclePlate: json['vehicle_plate'] ?? json['plate'] ?? json['vehiclePlate'],
      vehicleBrand: json['vehicle_brand'],
      vehicleModel: json['vehicle_model'],
      vehicleColor: json['vehicle_color'],
      phone: json['phone'],
      token: json['token'],
      role: json['role'],
    );
    print('✅ User parsed successfully: ${user.email}');
    return user;
  }

  Map<String, dynamic> toJson() => {
    'name': name,
    'email': email,
    'vehicle_plate': vehiclePlate,
    'vehicle_brand': vehicleBrand,
    'vehicle_model': vehicleModel,
    'vehicle_color': vehicleColor,
    'phone': phone,
    'token': token,
    'id': id,
    'role': role,
  };
}
