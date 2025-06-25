import 'package:flutter/material.dart';

class SavePaymentScreen extends StatefulWidget {
  const SavePaymentScreen({super.key});

  @override
  State<SavePaymentScreen> createState() => _SavePaymentScreenState();
}

class _SavePaymentScreenState extends State<SavePaymentScreen> {
  String _method = 'Tarjeta';
  final _formKey = GlobalKey<FormState>();
  String _cardNumber = '';
  String _expiry = '';
  String _cvv = '';
  bool _paid = false;
  final List<Map<String, String>> _history = [
    {
      'monto': 'RD\$ 100.00',
      'fecha': '2024-06-25',
      'metodo': 'Tarjeta',
      'estado': 'Pagado',
    },
    {
      'monto': 'RD\$ 80.00',
      'fecha': '2024-06-20',
      'metodo': 'PayPal',
      'estado': 'Pagado',
    },
    {
      'monto': 'RD\$ 120.00',
      'fecha': '2024-06-15',
      'metodo': 'Google Pay',
      'estado': 'Pagado',
    },
    {
      'monto': 'RD\$ 90.00',
      'fecha': '2024-06-10',
      'metodo': 'Apple Pay',
      'estado': 'Pagado',
    },
    {
      'monto': 'RD\$ 110.00',
      'fecha': '2024-06-05',
      'metodo': 'Stripe',
      'estado': 'Pagado',
    },
  ];

  void _pay() {
    setState(() {
      _paid = true;
      _history.insert(0, {
        'monto': 'RD\$ 100.00',
        'fecha': DateTime.now().toString().substring(0, 10),
        'metodo': _method,
        'estado': 'Pagado',
      });
    });
    ScaffoldMessenger.of(
      context,
    ).showSnackBar(const SnackBar(content: Text('¡Pago exitoso!')));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Pasarela de Pago')),
      body: ListView(
        padding: const EdgeInsets.all(24),
        children: [
          const Text(
            'Selecciona método de pago:',
            style: TextStyle(fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 12),
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: [
                _PaymentMethodButton(
                  label: 'Tarjeta',
                  icon: Icons.credit_card,
                  selected: _method == 'Tarjeta',
                  onTap: () => setState(() => _method = 'Tarjeta'),
                ),
                _PaymentMethodButton(
                  label: 'PayPal',
                  icon: Icons.account_balance_wallet,
                  selected: _method == 'PayPal',
                  onTap: () => setState(() => _method = 'PayPal'),
                ),
                _PaymentMethodButton(
                  label: 'Google Pay',
                  icon: Icons.android,
                  selected: _method == 'Google Pay',
                  onTap: () => setState(() => _method = 'Google Pay'),
                ),
                _PaymentMethodButton(
                  label: 'Apple Pay',
                  icon: Icons.phone_iphone,
                  selected: _method == 'Apple Pay',
                  onTap: () => setState(() => _method = 'Apple Pay'),
                ),
                _PaymentMethodButton(
                  label: 'Stripe',
                  icon: Icons.payment,
                  selected: _method == 'Stripe',
                  onTap: () => setState(() => _method = 'Stripe'),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),
          if (_method == 'Tarjeta') ...[
            Form(
              key: _formKey,
              child: Column(
                children: [
                  TextFormField(
                    decoration: const InputDecoration(
                      labelText: 'Número de tarjeta',
                    ),
                    keyboardType: TextInputType.number,
                    validator: (v) => v == null || v.length < 16
                        ? 'Ingrese 16 dígitos'
                        : null,
                    onSaved: (v) => _cardNumber = v ?? '',
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(
                        child: TextFormField(
                          decoration: const InputDecoration(
                            labelText: 'Expira (MM/AA)',
                          ),
                          validator: (v) =>
                              v == null || v.length < 5 ? 'MM/AA' : null,
                          onSaved: (v) => _expiry = v ?? '',
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: TextFormField(
                          decoration: const InputDecoration(labelText: 'CVV'),
                          keyboardType: TextInputType.number,
                          validator: (v) =>
                              v == null || v.length < 3 ? 'CVV' : null,
                          onSaved: (v) => _cvv = v ?? '',
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: _paid
                  ? null
                  : () {
                      if (_formKey.currentState!.validate()) {
                        _formKey.currentState!.save();
                        _pay();
                      }
                    },
              child: Text(_paid ? 'Pagado' : 'Pagar'),
            ),
          ],
          if (_method == 'PayPal') ...[
            Card(
              color: Colors.blue[50],
              child: ListTile(
                leading: const Icon(
                  Icons.account_balance_wallet,
                  color: Colors.blue,
                ),
                title: const Text('Redirigiendo a PayPal... (simulado)'),
                subtitle: const Text('Completa el pago en la web de PayPal.'),
              ),
            ),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: _paid ? null : _pay,
              child: Text(_paid ? 'Pagado' : 'Pagar con PayPal'),
            ),
          ],
          if (_method == 'Google Pay') ...[
            Card(
              color: Colors.green[50],
              child: ListTile(
                leading: const Icon(Icons.android, color: Colors.green),
                title: const Text('Google Pay (simulado)'),
                subtitle: const Text('Confirma el pago con tu huella o PIN.'),
              ),
            ),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: _paid ? null : _pay,
              child: Text(_paid ? 'Pagado' : 'Pagar con Google Pay'),
            ),
          ],
          if (_method == 'Apple Pay') ...[
            Card(
              color: Colors.grey[200],
              child: ListTile(
                leading: const Icon(Icons.phone_iphone, color: Colors.black),
                title: const Text('Apple Pay (simulado)'),
                subtitle: const Text(
                  'Confirma el pago con Face ID o Touch ID.',
                ),
              ),
            ),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: _paid ? null : _pay,
              child: Text(_paid ? 'Pagado' : 'Pagar con Apple Pay'),
            ),
          ],
          if (_method == 'Stripe') ...[
            Card(
              color: Colors.purple[50],
              child: ListTile(
                leading: const Icon(Icons.payment, color: Colors.purple),
                title: const Text('Stripe (simulado)'),
                subtitle: const Text('Completa el pago con Stripe.'),
              ),
            ),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: _paid ? null : _pay,
              child: Text(_paid ? 'Pagado' : 'Pagar con Stripe'),
            ),
          ],
          const SizedBox(height: 32),
          const Text(
            'Historial de pagos',
            style: TextStyle(fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 12),
          ..._history.map(
            (h) => Card(
              child: ListTile(
                leading: Icon(
                  h['metodo'] == 'Tarjeta'
                      ? Icons.credit_card
                      : h['metodo'] == 'PayPal'
                      ? Icons.account_balance_wallet
                      : h['metodo'] == 'Google Pay'
                      ? Icons.android
                      : h['metodo'] == 'Apple Pay'
                      ? Icons.phone_iphone
                      : Icons.payment,
                  color: h['metodo'] == 'Google Pay'
                      ? Colors.green
                      : h['metodo'] == 'Apple Pay'
                      ? Colors.black
                      : h['metodo'] == 'Stripe'
                      ? Colors.purple
                      : Colors.blue,
                ),
                title: Text('${h['monto']} - ${h['metodo']}'),
                subtitle: Text('${h['fecha']}'),
                trailing: Text(
                  h['estado']!,
                  style: const TextStyle(color: Colors.green),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _PaymentMethodButton extends StatelessWidget {
  final String label;
  final IconData icon;
  final bool selected;
  final VoidCallback onTap;
  const _PaymentMethodButton({
    required this.label,
    required this.icon,
    required this.selected,
    required this.onTap,
  });
  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        margin: const EdgeInsets.only(right: 12),
        decoration: BoxDecoration(
          color: selected ? Colors.blue[100] : Colors.grey[200],
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: selected ? Colors.blue : Colors.transparent,
            width: 2,
          ),
        ),
        child: Column(
          children: [
            Icon(icon, color: Colors.blue[700], size: 28),
            const SizedBox(height: 4),
            Text(label, style: const TextStyle(fontSize: 13)),
          ],
        ),
      ),
    );
  }
}
