import 'package:flutter/material.dart';
import 'package:mobile_app/services/lot_service.dart';
import 'package:mobile_app/screens/payment_screen.dart';

class QuickReserveScreen extends StatefulWidget {
  final Map<String, dynamic> parking;

  const QuickReserveScreen({super.key, required this.parking});

  @override
  State<QuickReserveScreen> createState() => _QuickReserveScreenState();
}

class _QuickReserveScreenState extends State<QuickReserveScreen> {
  bool _isLoading = false;
  String? _error;
  Map<String, dynamic>? _optimalSpaces;

  @override
  void initState() {
    super.initState();
    _loadOptimalSpaces();
  }

  Future<void> _loadOptimalSpaces() async {
    try {
      final spaces = await LotService.getOptimalSpaces(widget.parking['id']);
      setState(() {
        _optimalSpaces = spaces;
      });
    } catch (e) {
      setState(() {
        _error = 'Error cargando espacios: $e';
      });
    }
  }

  Future<void> _quickReserve() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final reservation = await LotService.quickReserve(widget.parking['id'], 1); // Mock user ID
      
      if (reservation['success']) {
        if (!mounted) return;
        
        // Navigate to payment with reservation details
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => PaymentScreen(
              slotIds: [reservation['space']['name']],
              parkingName: widget.parking['name'] ?? 'Estacionamiento',
            ),
          ),
        );
      } else {
        setState(() {
          _error = reservation['message'] ?? 'Error en la reserva';
        });
      }
    } catch (e) {
      setState(() {
        _error = 'Error: $e';
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: Text(
          'Reserva Rápida',
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.w600),
        ),
        backgroundColor: Colors.blue.shade800,
        leading: IconButton(
          icon: Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Parking info card
            Card(
              elevation: 4,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Row(
                  children: [
                    Container(
                      padding: EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: Colors.blue.shade800,
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Icon(Icons.local_parking, color: Colors.white, size: 24),
                    ),
                    SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            widget.parking['name'] ?? 'Estacionamiento',
                            style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600),
                          ),
                          SizedBox(height: 4),
                          Text(
                            widget.parking['address'] ?? '',
                            style: TextStyle(color: Colors.grey.shade600, fontSize: 14),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
            
            SizedBox(height: 24),
            
            // Quick reserve section
            Text(
              '🎯 Reserva Automática',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.w700, color: Colors.blue.shade800),
            ),
            SizedBox(height: 8),
            Text(
              'Te asignaremos el mejor espacio disponible automáticamente',
              style: TextStyle(color: Colors.grey.shade600, fontSize: 14),
            ),
            
            SizedBox(height: 16),
            
            // Optimal spaces preview
            if (_optimalSpaces != null && _optimalSpaces!['optimal_spaces'].isNotEmpty)
              Card(
                elevation: 2,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                child: Padding(
                  padding: const EdgeInsets.all(12.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Espacios disponibles:',
                        style: TextStyle(fontWeight: FontWeight.w600, fontSize: 14),
                      ),
                      SizedBox(height: 8),
                      ...(_optimalSpaces!['optimal_spaces'] as List).take(3).map((space) => 
                        Padding(
                          padding: const EdgeInsets.only(bottom: 4.0),
                          child: Row(
                            children: [
                              Icon(Icons.check_circle, color: Colors.green, size: 16),
                              SizedBox(width: 8),
                              Text('${space['name']} - Piso ${space['level']} - RD\$${space['base_price']}/h'),
                            ],
                          ),
                        ),
                      ).toList(),
                    ],
                  ),
                ),
              ),
            
            SizedBox(height: 24),
            
            // Error message
            if (_error != null)
              Container(
                padding: EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.red.shade50,
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: Colors.red.shade200),
                ),
                child: Row(
                  children: [
                    Icon(Icons.error_outline, color: Colors.red.shade600),
                    SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        _error!,
                        style: TextStyle(color: Colors.red.shade600),
                      ),
                    ),
                  ],
                ),
              ),
            
            Spacer(),
            
            // Action buttons
            Column(
              children: [
                // Quick reserve button
                SizedBox(
                  width: double.infinity,
                  height: 50,
                  child: ElevatedButton(
                    onPressed: _isLoading ? null : _quickReserve,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.blue.shade800,
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                      elevation: 2,
                    ),
                    child: _isLoading
                        ? SizedBox(
                            width: 20,
                            height: 20,
                            child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                          )
                        : Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(Icons.flash_on, size: 20),
                              SizedBox(width: 8),
                              Text('Reservar Automáticamente', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600)),
                            ],
                          ),
                  ),
                ),
                
                SizedBox(height: 12),
                
                // Manual selection button
                SizedBox(
                  width: double.infinity,
                  height: 50,
                  child: OutlinedButton(
                    onPressed: () => Navigator.pop(context),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: Colors.blue.shade800,
                      side: BorderSide(color: Colors.blue.shade800),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.grid_view, size: 20),
                        SizedBox(width: 8),
                        Text('Elegir Manualmente', style: TextStyle(fontSize: 16)),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}