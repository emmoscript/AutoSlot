import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../main.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  String _email = '';
  String _password = '';
  String? _error;
  bool _isLoading = false;

  void _login() async {
    if (_formKey.currentState!.validate()) {
      _formKey.currentState!.save();
      setState(() {
        _error = null;
        _isLoading = true;
      });
      
      try {
        final userProvider = Provider.of<UserProvider>(context, listen: false);
        final success = await userProvider.login(_email, _password);
        
        if (success) {
          // Login successful, navigate to main app
          Navigator.of(context).pushReplacementNamed('/feed');
        } else {
          setState(() => _error = 'Login incorrecto');
        }
      } catch (e) {
        setState(() => _error = 'Error de conexión: ${e.toString()}');
      } finally {
        setState(() => _isLoading = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Padding(
        padding: const EdgeInsets.all(24),
        child: Form(
          key: _formKey,
          child: Column(
            mainAxisAlignment: MainAxisAlignment
                .center, // Keeps the rest of the content centered
            children: [
              Icon(Icons.local_parking, size: 80, color: Colors.blue),
              SizedBox(height: 16), // Add some spacing after the icon
              Text(
                "Iniciar Sessión",
                style: const TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  color: Colors.blue,
                ),
              ), // Keep "Iniciar Sessión" if desired, otherwise remove.
              const SizedBox(height: 16), // Add some spacing after the title
              TextFormField(
                decoration: const InputDecoration(labelText: 'Email'),
                keyboardType: TextInputType.emailAddress,
                validator: (v) =>
                    v == null || v.isEmpty ? 'Ingrese su email' : null,
                onSaved: (v) => _email = v ?? '',
              ),
              const SizedBox(height: 16),
              TextFormField(
                decoration: const InputDecoration(labelText: 'Contraseña'),
                obscureText: true,
                validator: (v) =>
                    v == null || v.isEmpty ? 'Ingrese su contraseña' : null,
                onSaved: (v) => _password = v ?? '',
              ),
              if (_error != null) ...[
                const SizedBox(height: 12),
                Text(_error!, style: const TextStyle(color: Colors.red)),
              ],
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: _isLoading ? null : _login,
                child: _isLoading 
                  ? const SizedBox(
                      width: 20,
                      height: 20,
                      child: CircularProgressIndicator(strokeWidth: 2),
                    )
                  : const Text('Entrar'),
              ),
              const SizedBox(height: 16),
              TextButton(
                onPressed: () => Navigator.of(context).pushNamed('/register'),
                child: const Text('¿No tienes cuenta? Regístrate'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
