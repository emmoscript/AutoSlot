import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'package:mobile_app/services/lot_service.dart';
import 'available_slots_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  List<Map<String, dynamic>> _lots = [];
  bool _loading = true;
  bool _error = false;

  static const LatLng _defaultCenter = LatLng(
    18.472,
    -69.902,
  ); // Fallback center

  @override
  void initState() {
    super.initState();
    _fetchLots();
  }

  Future<void> _fetchLots() async {
    try {
      final lots = await LotService.fetchLots();
      setState(() {
        _lots = lots;
        _loading = false;
        _error = false;
      });
    } catch (e) {
      setState(() {
        _loading = false;
        _error = true;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    // Use the first lot as center if available, else fallback to default
    final LatLng center = _lots.isNotEmpty
        ? _lots.first['latlng'] as LatLng
        : _defaultCenter;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Mapa de Parqueos'),
        centerTitle: true,
        actions: [
          if (_loading)
            const Padding(
              padding: EdgeInsets.symmetric(horizontal: 16.0),
              child: SizedBox(
                width: 24,
                height: 24,
                child: CircularProgressIndicator(strokeWidth: 2),
              ),
            ),
        ],
      ),
      body: FlutterMap(
        options: MapOptions(initialCenter: center, initialZoom: 15.0),
        children: [
          TileLayer(
            urlTemplate: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            subdomains: const ['a', 'b', 'c'],
            userAgentPackageName: 'com.example.mobile_app',
          ),
          if (_lots.isNotEmpty)
            MarkerLayer(
              markers: _lots.map((lot) {
                return Marker(
                  width: 40.0,
                  height: 40.0,
                  point: lot['latlng'],
                  child: GestureDetector(
                    onTap: () async {
                      try {
                        final lotDetails = await LotService.fetchLotById(
                          lot['id'],
                        );
                        if (!mounted) return;
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) =>
                                AvailableSlotsScreen(parking: lotDetails),
                          ),
                        );
                      } catch (e, stack) {
                        print('Navigation error: $e');
                        print(stack);
                        if (mounted) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              content: Text('Error al cargar el lote: $e'),
                            ),
                          );
                        }
                      }
                    },
                    child: Icon(
                      Icons.local_parking,
                      color: Colors.blue,
                      size: 36,
                    ),
                  ),
                );
              }).toList(),
            ),
        ],
      ),
    );
  }
}
