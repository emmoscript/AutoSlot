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
    // Calculate center and bounds to show all parking lots
    LatLng center = _defaultCenter;
    double zoom = 12.0; // Start with a more zoomed out view
    
    if (_lots.isNotEmpty) {
      // Calculate the center point of all parking lots
      double avgLat = _lots.map((lot) => lot['latitude'] as double).reduce((a, b) => a + b) / _lots.length;
      double avgLng = _lots.map((lot) => lot['longitude'] as double).reduce((a, b) => a + b) / _lots.length;
      center = LatLng(avgLat, avgLng);
      
      // Calculate appropriate zoom based on the number of lots
      if (_lots.length >= 6) {
        zoom = 10.5; // More zoomed out for 6+ lots
      } else if (_lots.length > 3) {
        zoom = 11.0; // Medium zoom for 4-5 lots
      } else if (_lots.length > 1) {
        zoom = 11.5; // Less zoomed out for 2-3 lots
      }
    }

    return Scaffold(
      appBar: AppBar(
        title: Text(
          'AutoSlot - Estacionamientos',
          style: TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.w600,
          ),
        ),
        backgroundColor: Colors.blue.shade800,
        centerTitle: true,
        iconTheme: IconThemeData(color: Colors.white), // Iconos blancos
        actions: [
          if (_loading)
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16.0),
              child: SizedBox(
                width: 20,
                height: 20,
                child: CircularProgressIndicator(
                  strokeWidth: 2,
                  valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                ),
              ),
            ),
        ],
      ),
      body: FlutterMap(
        options: MapOptions(
          initialCenter: center, 
          initialZoom: zoom,
          minZoom: 9.0,
          maxZoom: 18.0,
        ),
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
                  width: 100.0,
                  height: 70.0,
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
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(color: Colors.blue.shade800, width: 2),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withOpacity(0.2),
                                blurRadius: 4,
                                offset: const Offset(0, 2),
                              ),
                            ],
                          ),
                          child: Text(
                            lot['name'] ?? 'Parking',
                            style: TextStyle(
                              color: Colors.blue.shade800,
                              fontSize: 10,
                              fontWeight: FontWeight.w600,
                            ),
                            textAlign: TextAlign.center,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Container(
                          padding: const EdgeInsets.all(4),
                          decoration: BoxDecoration(
                            color: Colors.blue.shade800,
                            shape: BoxShape.circle,
                          ),
                          child: Icon(
                            Icons.local_parking,
                            color: Colors.white,
                            size: 20,
                          ),
                        ),
                      ],
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
