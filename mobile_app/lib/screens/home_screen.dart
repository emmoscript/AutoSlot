import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({Key? key}) : super(key: key);

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> with SingleTickerProviderStateMixin {
  final List<Map<String, dynamic>> _zones = [
    {
      'name': 'Plaza Central',
      'center': LatLng(18.472, -69.902),
      'parkings': [
        {
          'name': 'Plaza Central 1',
          'latlng': LatLng(18.472, -69.902),
          'tarifa': 'RD\$ 50/h',
          'servicios': ['Techado', 'EV', 'Seguridad'],
          'disponible': true,
        },
        {
          'name': 'Plaza Central 2',
          'latlng': LatLng(18.473, -69.903),
          'tarifa': 'RD\$ 40/h',
          'servicios': ['EV'],
          'disponible': false,
        },
      ],
    },
    {
      'name': 'Av. Churchill',
      'center': LatLng(18.474, -69.910),
      'parkings': [
        {
          'name': 'Churchill Norte',
          'latlng': LatLng(18.474, -69.910),
          'tarifa': 'RD\$ 60/h',
          'servicios': ['Techado', 'Seguridad'],
          'disponible': true,
        },
      ],
    },
    {
      'name': 'Zona Colonial',
      'center': LatLng(18.471, -69.887),
      'parkings': [
        {
          'name': 'Colonial Parking',
          'latlng': LatLng(18.471, -69.887),
          'tarifa': 'RD\$ 30/h',
          'servicios': ['Público'],
          'disponible': true,
        },
      ],
    },
  ];

  int _selectedZone = 0;

  @override
  Widget build(BuildContext context) {
    final zone = _zones[_selectedZone];
    return Scaffold(
      appBar: AppBar(title: const Text('Mapa de Parqueos')),
      body: Column(
        children: [
          // Tabs/selector de zonas
          SizedBox(
            height: 48,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              itemCount: _zones.length,
              separatorBuilder: (_, __) => const SizedBox(width: 12),
              itemBuilder: (context, i) => ChoiceChip(
                label: Text(_zones[i]['name']),
                selected: _selectedZone == i,
                onSelected: (selected) {
                  if (selected) setState(() => _selectedZone = i);
                },
                selectedColor: Colors.blue[100],
                labelStyle: TextStyle(
                  color: _selectedZone == i ? Colors.blue[900] : Colors.black87,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ),
          Expanded(
            child: FlutterMap(
              options: MapOptions(
                initialCenter: zone['center'],
                initialZoom: 15.0,
              ),
              children: [
                TileLayer(
                  urlTemplate: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                  subdomains: const ['a', 'b', 'c'],
                ),
                MarkerLayer(
                  markers: [
                    for (final p in zone['parkings'])
                      Marker(
                        width: 40.0,
                        height: 40.0,
                        point: p['latlng'],
                        child: GestureDetector(
                          onTap: () => _showParkingDetails(context, p),
                          child: Icon(
                            Icons.local_parking,
                            color: p['disponible'] ? Colors.blue : Colors.red,
                            size: 36,
                          ),
                        ),
                      ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  void _showParkingDetails(BuildContext context, Map<String, dynamic> parking) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (_) => Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(Icons.local_parking, color: Colors.blue[700], size: 32),
                const SizedBox(width: 12),
                Text(parking['name'], style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
              ],
            ),
            const SizedBox(height: 12),
            Text('Tarifa: ${parking['tarifa']}', style: const TextStyle(fontSize: 16)),
            const SizedBox(height: 8),
            Text('Servicios: ${parking['servicios'].join(', ')}', style: const TextStyle(fontSize: 16)),
            const SizedBox(height: 8),
            Text('Disponibilidad: ${parking['disponible'] ? 'Disponible' : 'Ocupado'}', style: TextStyle(fontSize: 16, color: parking['disponible'] ? Colors.green : Colors.red)),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: parking['disponible'] ? () => Navigator.of(context).pop() : null,
              child: const Text('Reservar'),
            ),
          ],
        ),
      ),
    );
  }
} 