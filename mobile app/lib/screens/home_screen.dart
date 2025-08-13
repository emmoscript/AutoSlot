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
      print('🏠 HomeScreen: Starting to fetch lots...');
      final lots = await LotService.fetchLots();
      print('🏠 HomeScreen: Received ${lots.length} lots');
      
      for (var lot in lots) {
        print('🏠 HomeScreen: Lot ${lot['name']} at ${lot['latitude']}, ${lot['longitude']}');
        print('🏠 HomeScreen: Lot latlng: ${lot['latlng']}');
      }
      
      setState(() {
        _lots = lots;
        _loading = false;
        _error = false;
      });
      print('🏠 HomeScreen: State updated with ${_lots.length} lots');
    } catch (e) {
      print('🏠 HomeScreen: Error fetching lots: $e');
      setState(() {
        _loading = false;
        _error = true;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    print('🏠 HomeScreen: Building with ${_lots.length} lots');
    
    // Use fixed center and zoom for now
    final center = LatLng(18.472, -69.902);
    final zoom = 12.0;

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
        iconTheme: IconThemeData(color: Colors.white),
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
          if (!_loading && !_error)
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16.0),
              child: Container(
                padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: Colors.green,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  '${_lots.length} estacionamientos',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
        ],
      ),
      body: _error 
        ? Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.error, size: 64, color: Colors.red),
                SizedBox(height: 16),
                Text('Error al cargar los estacionamientos'),
                SizedBox(height: 16),
                ElevatedButton(
                  onPressed: _fetchLots,
                  child: Text('Reintentar'),
                ),
              ],
            ),
          )
        : FlutterMap(
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
              // Always show a test marker
              MarkerLayer(
                markers: [
                  Marker(
                    width: 150.0,
                    height: 100.0,
                    point: LatLng(18.469696652249976, -69.93889928441415),
                    child: Container(
                      padding: EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: Colors.red,
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(color: Colors.white, width: 3),
                      ),
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(Icons.local_parking, color: Colors.white, size: 30),
                          SizedBox(height: 4),
                          Text(
                            'TEST MARKER',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
              // Show actual lots if available
              if (_lots.isNotEmpty)
                MarkerLayer(
                  markers: _lots.map((lot) {
                    print('🗺️ Creating marker for: ${lot['name']} at ${lot['latlng']}');
                    return Marker(
                      width: 150.0,
                      height: 100.0,
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
                        child: Container(
                          padding: EdgeInsets.all(8),
                          decoration: BoxDecoration(
                            color: Colors.blue,
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(color: Colors.white, width: 3),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withOpacity(0.5),
                                blurRadius: 8,
                                offset: const Offset(0, 4),
                              ),
                            ],
                          ),
                          child: Column(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(
                                Icons.local_parking,
                                color: Colors.white,
                                size: 30,
                              ),
                              SizedBox(height: 4),
                              Text(
                                lot['name'] ?? 'Parking',
                                style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 12,
                                  fontWeight: FontWeight.bold,
                                ),
                                textAlign: TextAlign.center,
                                maxLines: 2,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ],
                          ),
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
