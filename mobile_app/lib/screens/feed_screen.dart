import 'package:flutter/material.dart';

class FeedScreen extends StatelessWidget {
  const FeedScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Inicio'),
        backgroundColor: Colors.blue,
        elevation: 0,
      ),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          // Bienvenida
          const Text('¡Hola, Juan Pérez!', style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold)),
          const SizedBox(height: 8),
          const Text('Tu resumen de hoy', style: TextStyle(fontSize: 16, color: Colors.black54)),
          const SizedBox(height: 24),
          // Resumen rápido
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              _SummaryCard(title: 'Reservas activas', value: '2', icon: Icons.event_available, color: Colors.green),
              _SummaryCard(title: 'Saldo', value: 'RD\$ 200', icon: Icons.account_balance_wallet, color: Colors.blue),
              _SummaryCard(title: 'Parqueos cerca', value: '5', icon: Icons.location_on, color: Colors.orange),
            ],
          ),
          const SizedBox(height: 32),
          // Accesos rápidos
          const Text('Accesos rápidos', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
          const SizedBox(height: 12),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _QuickAction(icon: Icons.map, label: 'Mapa', route: '/map'),
              _QuickAction(icon: Icons.list, label: 'Reservas', route: '/reservations'),
              _QuickAction(icon: Icons.payment, label: 'Pagar', route: '/payment'),
              _QuickAction(icon: Icons.person, label: 'Perfil', route: '/profile'),
            ],
          ),
          const SizedBox(height: 32),
          // Noticias/promos/tips
          const Text('Novedades', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
          const SizedBox(height: 12),
          Card(
            color: Colors.blue[50],
            child: ListTile(
              leading: const Icon(Icons.local_offer, color: Colors.blue),
              title: const Text('¡Descuento del 10% en tu próxima reserva!'),
              subtitle: const Text('Válido hasta el 30 de junio.'),
            ),
          ),
          const SizedBox(height: 16),
          Card(
            color: Colors.green[50],
            child: ListTile(
              leading: const Icon(Icons.info, color: Colors.green),
              title: const Text('Recuerda revisar la disponibilidad antes de salir.'),
            ),
          ),
        ],
      ),
    );
  }
}

class _SummaryCard extends StatelessWidget {
  final String title;
  final String value;
  final IconData icon;
  final Color color;
  const _SummaryCard({required this.title, required this.value, required this.icon, required this.color});
  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 12),
        child: Column(
          children: [
            Icon(icon, color: color, size: 28),
            const SizedBox(height: 8),
            Text(value, style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
            const SizedBox(height: 4),
            Text(title, style: const TextStyle(fontSize: 13, color: Colors.black54)),
          ],
        ),
      ),
    );
  }
}

class _QuickAction extends StatelessWidget {
  final IconData icon;
  final String label;
  final String route;
  const _QuickAction({required this.icon, required this.label, required this.route});
  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        InkWell(
          onTap: () => Navigator.of(context).pushNamed(route),
          borderRadius: BorderRadius.circular(24),
          child: CircleAvatar(
            backgroundColor: Colors.blue[100],
            radius: 24,
            child: Icon(icon, color: Colors.blue[700], size: 28),
          ),
        ),
        const SizedBox(height: 6),
        Text(label, style: const TextStyle(fontSize: 13)),
      ],
    );
  }
} 