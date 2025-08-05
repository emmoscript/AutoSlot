class User {
  final String name;
  final String email;
  final String? vehiclePlate;
  final String? token; // Add token field
  final String? id; // Add id field
  final String? role; // Add role field

  User({
    required this.name,
    required this.email,
    this.vehiclePlate,
    this.token,
    this.id,
    this.role,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id']?.toString(),
      name: json['name'] ?? '',
      email: json['email'] ?? '',
      vehiclePlate: json['plate'] ?? json['vehiclePlate'],
      token: json['token'],
      role: json['role'],
    );
  }

  Map<String, dynamic> toJson() => {
    'name': name,
    'email': email,
    'plate': vehiclePlate,
    'token': token,
    'id': id,
    'role': role,
  };
}
