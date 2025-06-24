import 'package:flutter/material.dart';
import '../services/auth_service.dart';
import '../models/user.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({Key? key}) : super(key: key);

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  late User user;
  bool editing = false;
  final _formKey = GlobalKey<FormState>();
  String? _name;
  String? _email;
  String? _plate;
  String? _model = 'Toyota Corolla';
  String? _color = 'Blanco';
  String? _payment = 'Tarjeta';
  bool _notifications = true;

  @override
  void initState() {
    super.initState();
    user = AuthService.currentUser!;
    _name = user.name;
    _email = user.email;
    _plate = user.vehiclePlate;
  }

  void _save() {
    if (_formKey.currentState!.validate()) {
      _formKey.currentState!.save();
      setState(() {
        editing = false;
        user = User(name: _name!, email: _email!, vehiclePlate: _plate!);
      });
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Perfil actualizado')),
      );
    }
  }

  void _logout() {
    AuthService.logout();
    Navigator.of(context).pushNamedAndRemoveUntil('/login', (route) => false);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Mi Perfil')),
      body: Padding(
        padding: const EdgeInsets.all(24),
        child: Form(
          key: _formKey,
          child: ListView(
            children: [
              const SizedBox(height: 12),
              Center(
                child: CircleAvatar(
                  radius: 40,
                  backgroundColor: Colors.blue[100],
                  child: const Icon(Icons.person, size: 48, color: Colors.blue),
                ),
              ),
              const SizedBox(height: 16),
              Center(
                child: Text(
                  user.name,
                  style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
                ),
              ),
              const SizedBox(height: 24),
              _sectionTitle('Datos personales'),
              editing
                  ? TextFormField(
                      initialValue: _name,
                      decoration: const InputDecoration(labelText: 'Nombre'),
                      validator: (v) => v == null || v.isEmpty ? 'Ingrese su nombre' : null,
                      onSaved: (v) => _name = v,
                    )
                  : ListTile(
                      leading: const Icon(Icons.person),
                      title: Text(user.name),
                    ),
              editing
                  ? TextFormField(
                      initialValue: _email,
                      decoration: const InputDecoration(labelText: 'Email'),
                      validator: (v) => v == null || v.isEmpty ? 'Ingrese su email' : null,
                      onSaved: (v) => _email = v,
                    )
                  : ListTile(
                      leading: const Icon(Icons.email),
                      title: Text(user.email),
                    ),
              const SizedBox(height: 16),
              _sectionTitle('Vehículo'),
              editing
                  ? TextFormField(
                      initialValue: _plate,
                      decoration: const InputDecoration(labelText: 'Placa'),
                      validator: (v) => v == null || v.isEmpty ? 'Ingrese la placa' : null,
                      onSaved: (v) => _plate = v,
                    )
                  : ListTile(
                      leading: const Icon(Icons.directions_car),
                      title: Text('Placa: ${user.vehiclePlate}'),
                      subtitle: Text('Modelo: $_model, Color: $_color'),
                    ),
              editing
                  ? Row(
                      children: [
                        Expanded(
                          child: TextFormField(
                            initialValue: _model,
                            decoration: const InputDecoration(labelText: 'Modelo'),
                            onSaved: (v) => _model = v,
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: TextFormField(
                            initialValue: _color,
                            decoration: const InputDecoration(labelText: 'Color'),
                            onSaved: (v) => _color = v,
                          ),
                        ),
                      ],
                    )
                  : const SizedBox.shrink(),
              const SizedBox(height: 16),
              _sectionTitle('Método de pago principal'),
              editing
                  ? DropdownButtonFormField<String>(
                      value: _payment,
                      items: const [
                        DropdownMenuItem(value: 'Tarjeta', child: Text('Tarjeta')),
                        DropdownMenuItem(value: 'PayPal', child: Text('PayPal')),
                        DropdownMenuItem(value: 'Google Pay', child: Text('Google Pay')),
                        DropdownMenuItem(value: 'Apple Pay', child: Text('Apple Pay')),
                        DropdownMenuItem(value: 'Stripe', child: Text('Stripe')),
                      ],
                      onChanged: (v) => setState(() => _payment = v),
                      onSaved: (v) => _payment = v,
                    )
                  : ListTile(
                      leading: const Icon(Icons.credit_card),
                      title: Text(_payment ?? 'Tarjeta'),
                    ),
              const SizedBox(height: 16),
              _sectionTitle('Preferencias'),
              SwitchListTile(
                value: _notifications,
                onChanged: editing ? (v) => setState(() => _notifications = v) : null,
                title: const Text('Recibir notificaciones'),
              ),
              const SizedBox(height: 24),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  editing
                      ? ElevatedButton.icon(
                          onPressed: _save,
                          icon: const Icon(Icons.save),
                          label: const Text('Guardar'),
                        )
                      : ElevatedButton.icon(
                          onPressed: () => setState(() => editing = true),
                          icon: const Icon(Icons.edit),
                          label: const Text('Editar'),
                        ),
                  OutlinedButton.icon(
                    onPressed: _logout,
                    icon: const Icon(Icons.logout),
                    label: const Text('Cerrar sesión'),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _sectionTitle(String title) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
    );
  }
} 