import 'package:flutter/material.dart';
import 'package:qr_flutter/qr_flutter.dart';

class ReservationsScreen extends StatelessWidget {
  const ReservationsScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final mockReservations = [
      {
        'location': 'Plaza Central',
        'date': '2024-06-24 10:00',
        'status': 'Activa',
        'monto': 'RD\$ 100.00',
        'metodo': 'Tarjeta',
        'codigo': 'RES12345',
        'qr': 'RES12345',
        'tiempo': '30 min restantes',
      },
      {
        'location': 'Av. Churchill',
        'date': '2024-06-22 15:30',
        'status': 'Completada',
        'monto': 'RD\$ 80.00',
        'metodo': 'PayPal',
        'codigo': 'RES67890',
        'qr': 'RES67890',
        'tiempo': 'Finalizada',
      },
      {
        'location': 'Zona Colonial',
        'date': '2024-06-20 09:00',
        'status': 'Cancelada',
        'monto': 'RD\$ 60.00',
        'metodo': 'Google Pay',
        'codigo': 'RES54321',
        'qr': 'RES54321',
        'tiempo': 'Cancelada',
      },
    ];
    final novedades = [
      {
        'title': '¡Nuevo! Reserva anticipada',
        'desc': 'Ahora puedes reservar tu parqueo hasta con 24h de antelación.',
        'icon': Icons.new_releases,
        'color': Colors.blue,
      },
      {
        'title': 'Tip: Usa tu QR para acceso rápido',
        'desc': 'Escanea el código en la entrada para abrir la barrera.',
        'icon': Icons.qr_code,
        'color': Colors.green,
      },
      {
        'title': 'Promo: 10% de descuento',
        'desc': 'En tu próxima reserva usando Apple Pay.',
        'icon': Icons.local_offer,
        'color': Colors.orange,
      },
    ];
    return Scaffold(
      appBar: AppBar(title: const Text('Mis Reservas')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          const Text('Novedades', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
          const SizedBox(height: 8),
          ...novedades.map((n) => Card(
                color: (n['color'] as Color).withOpacity(0.1),
                child: ListTile(
                  leading: Icon(n['icon'] as IconData, color: n['color'] as Color),
                  title: Text(n['title'] as String),
                  subtitle: Text(n['desc'] as String),
                ),
              )),
          const SizedBox(height: 24),
          const Text('Historial de reservas', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
          const SizedBox(height: 8),
          ...mockReservations.map((item) => Card(
                margin: const EdgeInsets.only(bottom: 16),
                child: ExpansionTile(
                  leading: Icon(
                    item['status'] == 'Activa'
                        ? Icons.event_available
                        : item['status'] == 'Completada'
                            ? Icons.check_circle
                            : Icons.cancel,
                    color: item['status'] == 'Activa'
                        ? Colors.green
                        : item['status'] == 'Completada'
                            ? Colors.blue
                            : Colors.red,
                  ),
                  title: Text(item['location']!),
                  subtitle: Text('${item['date']}  |  ${item['status']}'),
                  children: [
                    ListTile(
                      title: Text('Monto: ${item['monto']}'),
                      subtitle: Text('Método: ${item['metodo']}'),
                    ),
                    ListTile(
                      title: Text('Código de reserva: ${item['codigo']}'),
                      subtitle: Text('Tiempo: ${item['tiempo']}'),
                    ),
                    if (item['status'] == 'Activa')
                      Padding(
                        padding: const EdgeInsets.symmetric(vertical: 8),
                        child: Center(
                          child: QrImage(
                            data: item['qr']!,
                            size: 100,
                          ),
                        ),
                      ),
                  ],
                ),
              )),
        ],
      ),
    );
  }
} 