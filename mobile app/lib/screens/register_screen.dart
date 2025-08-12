// screens/register_screen.dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../main.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  final _phoneController = TextEditingController();
  final _plateController = TextEditingController();
  final _vehicleModelController = TextEditingController();

  // Lista de marcas populares en República Dominicana
  final List<String> _vehicleBrands = [
    'Toyota',
    'Honda',
    'Nissan',
    'Hyundai',
    'Kia',
    'Ford',
    'Chevrolet',
    'Mazda',
    'Mitsubishi',
    'Suzuki',
    'Volkswagen',
    'BMW',
    'Mercedes-Benz',
    'Audi',
    'Jeep',
    'Subaru',
    'Isuzu',
    'Otra',
  ];

  String? _selectedBrand;
  bool _isLoading = false;
  String? _error;
  bool _passwordVisible = false;
  bool _confirmPasswordVisible = false;
  bool _acceptTerms = false;

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    _phoneController.dispose();
    _plateController.dispose();
    _vehicleModelController.dispose();
    super.dispose();
  }

  Future<void> _register() async {
    if (_formKey.currentState!.validate()) {
      if (!_acceptTerms) {
        setState(() => _error = 'Debes aceptar los términos y condiciones');
        return;
      }
      
      if (_passwordController.text != _confirmPasswordController.text) {
        setState(() => _error = 'Las contraseñas no coinciden');
        return;
      }

      setState(() {
        _isLoading = true;
        _error = null;
      });

      try {
        final userProvider = Provider.of<UserProvider>(context, listen: false);
        final success = await userProvider.register(
          _nameController.text,
          _emailController.text,
          _passwordController.text,
          _plateController.text,
          _selectedBrand ?? '',
          _vehicleModelController.text,
          '', // color eliminado
          _phoneController.text,
        );

        if (success && mounted) {
          Navigator.pushReplacementNamed(context, '/feed');
        } else {
          setState(() => _error = 'Error en el registro');
        }
      } catch (e) {
        setState(() {
          _error = e.toString().replaceAll('Exception: ', '');
        });
      } finally {
        if (mounted) {
          setState(() => _isLoading = false);
        }
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: Text(
          'Crear Cuenta',
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.w600),
        ),
        backgroundColor: Colors.blue.shade800,
        iconTheme: IconThemeData(color: Colors.white),
        elevation: 0,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Header
                Text(
                  '¡Bienvenido!',
                  style: TextStyle(
                    fontSize: 28,
                    fontWeight: FontWeight.bold,
                    color: Colors.blue.shade800,
                  ),
                ),
                SizedBox(height: 8),
                Text(
                  'Crea tu cuenta para comenzar a usar AutoSlot',
                  style: TextStyle(
                    fontSize: 16,
                    color: Colors.grey.shade600,
                  ),
                ),
                SizedBox(height: 32),

                // Name field
                _buildTextField(
                  controller: _nameController,
                  label: 'Nombre completo',
                  icon: Icons.person_outline,
                  validator: (value) {
                    if (value?.trim().isEmpty ?? true) return 'Ingresa tu nombre';
                    if (value!.trim().length < 2) return 'Nombre muy corto';
                    return null;
                  },
                ),
                SizedBox(height: 16),

                // Email field
                _buildTextField(
                  controller: _emailController,
                  label: 'Correo electrónico',
                  icon: Icons.email_outlined,
                  keyboardType: TextInputType.emailAddress,
                  validator: (value) {
                    if (value?.trim().isEmpty ?? true) return 'Ingresa tu correo';
                    if (!RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$').hasMatch(value!)) {
                      return 'Correo inválido';
                    }
                    return null;
                  },
                ),
                SizedBox(height: 16),

                // Phone field (new)
                _buildTextField(
                  controller: _phoneController,
                  label: 'Teléfono',
                  icon: Icons.phone_outlined,
                  keyboardType: TextInputType.phone,
                  validator: (value) {
                    if (value?.trim().isEmpty ?? true) return 'Ingresa tu teléfono';
                    if (value!.trim().length < 10) return 'Teléfono inválido';
                    return null;
                  },
                ),
                SizedBox(height: 16),

                // Vehicle information section
                Text(
                  'Información del Vehículo',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                    color: Colors.blue.shade800,
                  ),
                ),
                SizedBox(height: 16),

                // Vehicle brand dropdown
                Container(
                  decoration: BoxDecoration(
                    border: Border.all(color: Colors.grey.shade300),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: DropdownButtonFormField<String>(
                    decoration: InputDecoration(
                      labelText: 'Marca del vehículo',
                      prefixIcon: Icon(Icons.directions_car_outlined, color: Colors.blue.shade800),
                      border: InputBorder.none,
                      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
                    ),
                    value: _selectedBrand,
                    items: _vehicleBrands.map((String brand) {
                      return DropdownMenuItem<String>(
                        value: brand,
                        child: Text(brand),
                      );
                    }).toList(),
                    onChanged: (String? newValue) {
                      setState(() {
                        _selectedBrand = newValue;
                      });
                    },
                    validator: (value) {
                      if (value == null || value.isEmpty) return 'Selecciona una marca';
                      return null;
                    },
                  ),
                ),
                SizedBox(height: 16),

                // Vehicle model field
                _buildTextField(
                  controller: _vehicleModelController,
                  label: 'Modelo del vehículo',
                  icon: Icons.car_rental_outlined,
                  validator: (value) {
                    if (value?.trim().isEmpty ?? true) return 'Ingresa el modelo';
                    return null;
                  },
                ),
                SizedBox(height: 16),

                // Vehicle plate field with format example
                _buildTextField(
                  controller: _plateController,
                  label: 'Placa del vehículo',
                  hintText: 'Ej: A123456 o G123456',
                  icon: Icons.confirmation_number_outlined,
                  validator: (value) {
                    if (value?.trim().isEmpty ?? true) return 'Ingresa la placa';
                    // Validación básica para formato dominicano: Letra + 6 dígitos
                    if (!RegExp(r'^[A-Z]\d{6}$').hasMatch(value!.trim().toUpperCase())) {
                      return 'Formato: 1 letra + 6 números (Ej: A123456)';
                    }
                    return null;
                  },
                ),
                SizedBox(height: 16),

                // Password field
                _buildTextField(
                  controller: _passwordController,
                  label: 'Contraseña',
                  icon: Icons.lock_outline,
                  obscureText: !_passwordVisible,
                  suffixIcon: IconButton(
                    icon: Icon(_passwordVisible ? Icons.visibility_off : Icons.visibility),
                    onPressed: () => setState(() => _passwordVisible = !_passwordVisible),
                  ),
                  validator: (value) {
                    if (value?.isEmpty ?? true) return 'Ingresa una contraseña';
                    if (value!.length < 6) return 'Mínimo 6 caracteres';
                    return null;
                  },
                ),
                SizedBox(height: 16),

                // Confirm password field
                _buildTextField(
                  controller: _confirmPasswordController,
                  label: 'Confirmar contraseña',
                  icon: Icons.lock_outline,
                  obscureText: !_confirmPasswordVisible,
                  suffixIcon: IconButton(
                    icon: Icon(_confirmPasswordVisible ? Icons.visibility_off : Icons.visibility),
                    onPressed: () => setState(() => _confirmPasswordVisible = !_confirmPasswordVisible),
                  ),
                  validator: (value) {
                    if (value?.isEmpty ?? true) return 'Confirma tu contraseña';
                    return null;
                  },
                ),
                SizedBox(height: 20),

                // Terms and conditions
                Row(
                  children: [
                    Checkbox(
                      value: _acceptTerms,
                      onChanged: (value) => setState(() => _acceptTerms = value!),
                      activeColor: Colors.blue.shade800,
                    ),
                    Expanded(
                      child: Text(
                        'Acepto los términos y condiciones',
                        style: TextStyle(color: Colors.grey.shade700),
                      ),
                    ),
                  ],
                ),
                SizedBox(height: 16),

                // Error message
                if (_error != null)
                  Container(
                    padding: EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Colors.red.shade50,
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: Colors.red.shade200),
                    ),
                    child: Row(
                      children: [
                        Icon(Icons.error_outline, color: Colors.red.shade600),
                        SizedBox(width: 8),
                        Expanded(
                          child: Text(
                            _error!,
                            style: TextStyle(color: Colors.red.shade600),
                          ),
                        ),
                      ],
                    ),
                  ),
                if (_error != null) SizedBox(height: 16),

                // Register button
                SizedBox(
                  width: double.infinity,
                  height: 50,
                  child: ElevatedButton(
                    onPressed: _isLoading ? null : _register,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.blue.shade800,
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                      elevation: 2,
                    ),
                    child: _isLoading
                        ? SizedBox(
                            width: 20,
                            height: 20,
                            child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                          )
                        : Text('Crear Cuenta', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600)),
                  ),
                ),
                SizedBox(height: 20),

                // Login link
                Center(
                  child: TextButton(
                    onPressed: () => Navigator.pushReplacementNamed(context, '/login'),
                    child: RichText(
                      text: TextSpan(
                        text: '¿Ya tienes cuenta? ',
                        style: TextStyle(color: Colors.grey.shade600),
                        children: [
                          TextSpan(
                            text: 'Inicia sesión',
                            style: TextStyle(
                              color: Colors.blue.shade800,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildTextField({
    required TextEditingController controller,
    required String label,
    required IconData icon,
    required FormFieldValidator<String> validator,
    TextInputType? keyboardType,
    bool obscureText = false,
    Widget? suffixIcon,
    String? hintText,
  }) {
    return TextFormField(
      controller: controller,
      decoration: InputDecoration(
        labelText: label,
        hintText: hintText,
        prefixIcon: Icon(icon, color: Colors.blue.shade800),
        suffixIcon: suffixIcon,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: BorderSide(color: Colors.grey.shade300),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: BorderSide(color: Colors.blue.shade800, width: 2),
        ),
        filled: true,
        fillColor: Colors.grey.shade50,
      ),
      keyboardType: keyboardType,
      obscureText: obscureText,
      validator: validator,
    );
  }
}
