import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/auth_service.dart';
import '../models/user.dart';
import '../main.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

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
    final userProvider = Provider.of<UserProvider>(context, listen: false);
    user = userProvider.user!;
    _name = user.name;
    _email = user.email;
    _plate = user.vehiclePlate;
  }

  void _save() async {
    if (_formKey.currentState!.validate()) {
      _formKey.currentState!.save();
      
      // Show loading
      setState(() => editing = false);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Actualizando perfil...')),
      );
      
      try {
        // Update profile via API
        final userProvider = Provider.of<UserProvider>(context, listen: false);
        final success = await userProvider.updateProfile(
          name: _name,
          vehiclePlate: _plate,
          // phone: _phone, // Add phone when available
        );
        
        if (success) {
          // Update local user data
          setState(() {
            user = userProvider.user!;
          });
          
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('✅ Perfil actualizado correctamente'),
              backgroundColor: Colors.green,
            ),
          );
        } else {
          // Revert to editing mode on failure
          setState(() => editing = true);
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('❌ Error al actualizar el perfil'),
              backgroundColor: Colors.red,
            ),
          );
        }
      } catch (e) {
        // Revert to editing mode on error
        setState(() => editing = true);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('❌ Error: ${e.toString()}'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  void _logout() async {
    await Provider.of<UserProvider>(context, listen: false).logout();
    if (mounted) {
      Navigator.of(context).pushNamedAndRemoveUntil('/login', (route) => false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final userProvider = Provider.of<UserProvider>(context);
    user = userProvider.user!;
    return Scaffold(
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: const Text('Mi Perfil'),
        actions: [
          if (!editing)
            IconButton(
              icon: const Icon(Icons.edit),
              tooltip: 'Editar',
              onPressed: () => setState(() => editing = true),
            ),
        ],
      ),
      floatingActionButton: editing
          ? FloatingActionButton.extended(
              onPressed: _save,
              icon: const Icon(Icons.save),
              label: const Text('Guardar'),
            )
          : null,
      body: Stack(
        children: [
          // Gradient header
          Container(
            height: 220,
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                colors: [Color(0xFF1976D2), Color(0xFF64B5F6)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
            ),
          ),
          // Main content
          Padding(
            padding: const EdgeInsets.only(top: 100),
            child: Form(
              key: _formKey,
              child: ListView(
                padding: const EdgeInsets.symmetric(
                  horizontal: 20,
                  vertical: 0,
                ),
                children: [
                  // Avatar and name
                  Center(
                    child: Stack(
                      alignment: Alignment.center,
                      children: [
                        Material(
                          elevation: 8,
                          shape: const CircleBorder(),
                          child: CircleAvatar(
                            radius: 54,
                            backgroundColor: Colors.white,
                            child: CircleAvatar(
                              radius: 50,
                              backgroundColor: Colors.blue[100],
                              child: const Icon(
                                Icons.person,
                                size: 56,
                                color: Colors.blue,
                              ),
                            ),
                          ),
                        ),
                        if (editing)
                          Positioned(
                            bottom: 0,
                            right: 0,
                            child: CircleAvatar(
                              radius: 18,
                              backgroundColor: theme.colorScheme.primary,
                              child: const Icon(
                                Icons.edit,
                                color: Colors.white,
                                size: 18,
                              ),
                            ),
                          ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 12),
                  Center(
                    child: Text(
                      user.name,
                      style: theme.textTheme.titleLarge?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  const SizedBox(height: 24),
                  // Profile Card
                  Card(
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(20),
                    ),
                    elevation: 4,
                    child: Padding(
                      padding: const EdgeInsets.all(20),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          _sectionTitle('Datos personales'),
                          editing
                              ? TextFormField(
                                  initialValue: _name,
                                  decoration: const InputDecoration(
                                    labelText: 'Nombre',
                                  ),
                                  validator: (v) => v == null || v.isEmpty
                                      ? 'Ingrese su nombre'
                                      : null,
                                  onSaved: (v) => _name = v,
                                )
                              : ListTile(
                                  leading: const Icon(Icons.person),
                                  title: Text(user.name),
                                ),
                          editing
                              ? TextFormField(
                                  initialValue: _email,
                                  decoration: const InputDecoration(
                                    labelText: 'Email',
                                  ),
                                  validator: (v) => v == null || v.isEmpty
                                      ? 'Ingrese su email'
                                      : null,
                                  onSaved: (v) => _email = v,
                                )
                              : ListTile(
                                  leading: const Icon(Icons.email),
                                  title: Text(user.email),
                                ),
                          const Divider(height: 32),
                          _sectionTitle('Vehículo'),
                          editing
                              ? TextFormField(
                                  initialValue: _plate,
                                  decoration: const InputDecoration(
                                    labelText: 'Placa',
                                  ),
                                  validator: (v) => v == null || v.isEmpty
                                      ? 'Ingrese la placa'
                                      : null,
                                  onSaved: (v) => _plate = v,
                                )
                              : ListTile(
                                  leading: const Icon(Icons.directions_car),
                                  title: Text('Placa: ${user.vehiclePlate}'),
                                  subtitle: Text(
                                    'Modelo: $_model, Color: $_color',
                                  ),
                                ),
                          editing
                              ? Row(
                                  children: [
                                    Expanded(
                                      child: TextFormField(
                                        initialValue: _model,
                                        decoration: const InputDecoration(
                                          labelText: 'Modelo',
                                        ),
                                        onSaved: (v) => _model = v,
                                      ),
                                    ),
                                    const SizedBox(width: 12),
                                    Expanded(
                                      child: TextFormField(
                                        initialValue: _color,
                                        decoration: const InputDecoration(
                                          labelText: 'Color',
                                        ),
                                        onSaved: (v) => _color = v,
                                      ),
                                    ),
                                  ],
                                )
                              : const SizedBox.shrink(),
                          const Divider(height: 32),
                          _sectionTitle('Método de pago principal'),
                          editing
                              ? DropdownButtonFormField<String>(
                                  value: _payment,
                                  items: const [
                                    DropdownMenuItem(
                                      value: 'Tarjeta',
                                      child: Text('Tarjeta'),
                                    ),
                                    DropdownMenuItem(
                                      value: 'PayPal',
                                      child: Text('PayPal'),
                                    ),
                                    DropdownMenuItem(
                                      value: 'Google Pay',
                                      child: Text('Google Pay'),
                                    ),
                                    DropdownMenuItem(
                                      value: 'Apple Pay',
                                      child: Text('Apple Pay'),
                                    ),
                                    DropdownMenuItem(
                                      value: 'Stripe',
                                      child: Text('Stripe'),
                                    ),
                                  ],
                                  onChanged: (v) =>
                                      setState(() => _payment = v),
                                  onSaved: (v) => _payment = v,
                                )
                              : ListTile(
                                  leading: const Icon(Icons.credit_card),
                                  title: Text(_payment ?? 'Tarjeta'),
                                ),
                          const Divider(height: 32),
                          _sectionTitle('Preferencias'),
                          SwitchListTile(
                            value: _notifications,
                            onChanged: editing
                                ? (v) => setState(() => _notifications = v)
                                : null,
                            title: const Text('Recibir notificaciones'),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 24),
                  // Logout button
                  Center(
                    child: OutlinedButton.icon(
                      onPressed: _logout,
                      icon: const Icon(Icons.logout),
                      label: const Text('Cerrar sesión'),
                      style: OutlinedButton.styleFrom(
                        foregroundColor: theme.colorScheme.error,
                        side: BorderSide(color: theme.colorScheme.error),
                        padding: const EdgeInsets.symmetric(
                          horizontal: 24,
                          vertical: 12,
                        ),
                        textStyle: const TextStyle(fontSize: 16),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 32),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _sectionTitle(String title) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Text(
        title,
        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
      ),
    );
  }
}
