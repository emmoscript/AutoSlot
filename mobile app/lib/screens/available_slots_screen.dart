import 'dart:math';
import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'package:mobile_app/screens/payment_screen.dart'; // Import the new payment screen
import 'package:mobile_app/widget/slot_grid_item.dart'; // Ensure this path is correct
import 'package:mobile_app/services/lot_service.dart';
import 'package:mobile_app/screens/quick_reserve_screen.dart';

// Slot model for type safety
class Slot {
  final String id;
  final String floor;
  final bool isAvailable;

  Slot({required this.id, required this.floor, required this.isAvailable});

  factory Slot.fromJson(Map<String, dynamic> json) {
    return Slot(
      id: json['id'].toString(),
      floor: json['floor']?.toString() ?? json['level']?.toString() ?? '',
      isAvailable:
          json['isAvailable'] ??
          json['is_available'] == true || json['is_available'] == 1,
    );
  }
}

class AvailableSlotsScreen extends StatefulWidget {
  final Map<String, dynamic> parking;
  final ScrollController? scrollController; // Added scrollController parameter

  const AvailableSlotsScreen({
    super.key,
    required this.parking,
    this.scrollController,
  }); // Updated constructor

  @override
  State<AvailableSlotsScreen> createState() => _AvailableSlotsScreenState();
}

// Added SingleTickerProviderStateMixin for AnimationController
class _AvailableSlotsScreenState extends State<AvailableSlotsScreen>
    with SingleTickerProviderStateMixin {
  final Random _random = Random();

  // All possible floors for random generation
  final List<String> _allPossibleFloors = ['P1', 'P2', 'P3', 'B1', 'B2'];
  late String _selectedFloor; // State for the currently selected floor
  late List<String> _availableFloors; // Floors available in this parking lot

  // State to manage the selected slots - now a Set
  final Set<String> _selectedSlotIds =
      {}; // Stores the IDs of the currently selected slots

  // Remove random slot generation and use real slots from API
  late List<Slot> _allSlots;

  // AnimationController and Animation for the button
  late AnimationController _buttonAnimationController;
  late Animation<Offset> _buttonSlideAnimation;

  @override
  void initState() {
    super.initState();
    _loadSlots();
    
    _buttonAnimationController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 150),
    );
    _buttonSlideAnimation =
        Tween<Offset>(begin: Offset.zero, end: const Offset(0.0, -0.1)).animate(
          CurvedAnimation(
            parent: _buttonAnimationController,
            curve: Curves.easeOutCubic,
          ),
        );
  }
  
  void _loadSlots() async {
    try {
      // Use slots from API (passed in widget.parking['slots']) and parse to Slot objects
      final rawSlots = widget.parking['slots'] ?? [];
      print('Raw slots data: $rawSlots');
      
      if (rawSlots.isEmpty) {
        // If no slots in parking data, fetch them from API
        print('Fetching slots for parking ID: ${widget.parking['id']}');
        final slotsFromApi = await LotService.fetchSlotsForLot(widget.parking['id']);
        _allSlots = slotsFromApi.map((e) => Slot.fromJson(e)).toList();
      } else {
        _allSlots = rawSlots is List
            ? rawSlots.map((e) => Slot.fromJson(e as Map<String, dynamic>)).toList()
            : [];
      }

      // Initialize available floors based on real slots
      if (_allSlots.isNotEmpty) {
        _availableFloors =
            ['All'] + _allSlots.map((slot) => slot.floor).toSet().toList()
              ..sort();
      } else {
        // Provide more realistic floors based on parking lot name
        String lotName = widget.parking['name'] ?? '';
        if (lotName.toLowerCase().contains('mall') || lotName.toLowerCase().contains('center')) {
          _availableFloors = ['All', 'P1', 'P2', 'P3', 'P4']; // Shopping centers typically have more floors
        } else {
          _availableFloors = ['All', 'P1', 'P2']; // Regular lots
        }
      }
      _selectedFloor = _availableFloors.first;
      
      if (mounted) {
        setState(() {});
      }
    } catch (e) {
      print('Error loading slots: $e');
      // Set fallback floors
      _availableFloors = ['All', 'P1', 'P2'];
      _selectedFloor = _availableFloors.first;
      _allSlots = [];
      
      if (mounted) {
        setState(() {});
      }
    }
  }

  @override
  void dispose() {
    _buttonAnimationController
        .dispose(); // Dispose the controller when the widget is removed
    super.dispose();
  }

  // Remove _getInitialSlots and _generateRandomSlots, and update all usages to _allSlots

  // Helper function to calculate average price from slots
  String _calculateAveragePrice() {
    if (_allSlots.isEmpty) {
      return widget.parking['tarifa']?.toString() ?? 'Consultar';
    }
    
    // Get slots data and calculate average base_price
    final rawSlots = widget.parking['slots'] ?? widget.parking['spaces'] ?? [];
    if (rawSlots.isEmpty) {
      return 'Consultar';
    }
    
    double totalPrice = 0;
    int validPrices = 0;
    
    for (var slot in rawSlots) {
      if (slot['base_price'] != null) {
        totalPrice += double.tryParse(slot['base_price'].toString()) ?? 0;
        validPrices++;
      }
    }
    
    if (validPrices > 0) {
      double avgPrice = totalPrice / validPrices;
      return 'RD\$${avgPrice.toStringAsFixed(0)}/h';
    }
    
    return 'Consultar';
  }

  // Helper function to build quick info items
  Widget _buildQuickInfo(String label, String value, IconData icon, {Color? color}) {
    return Expanded(
      child: Column(
        children: [
          Icon(
            icon,
            size: 20,
            color: color ?? Colors.blue.shade800,
          ),
          const SizedBox(height: 4),
          Text(
            label,
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w500,
              color: Colors.grey.shade600,
            ),
          ),
          const SizedBox(height: 2),
          Text(
            value,
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w600,
              color: color ?? Colors.grey.shade800,
            ),
            textAlign: TextAlign.center,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
    );
  }

  // Function to show the payment screen as a bottom sheet
  void _showPaymentScreen(BuildContext context) {
    if (_selectedSlotIds.isEmpty) {
      // Check if any slot is selected
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text(
            'Por favor, selecciona al menos un espacio para reservar.',
          ),
          duration: Duration(seconds: 2),
        ),
      );
      return;
    }

    showModalBottomSheet(
      context: context,
      isScrollControlled: true, // Allow it to take up more space if needed
      backgroundColor: Colors.white, // Ensure white background
      builder: (context) {
        return DraggableScrollableSheet(
          initialChildSize: 0.7, // Payment screen takes 70% of height
          minChildSize: 0.3,
          maxChildSize: 0.9,
          expand: false,
          snap: true,
          snapSizes: const [0.3, 0.7, 0.9],
          builder: (BuildContext context, ScrollController scrollController) {
            return Container(
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: const BorderRadius.vertical(
                  top: Radius.circular(20),
                ),
                boxShadow: [
                  BoxShadow(
                    color: Colors.grey.withOpacity(0.1),
                    blurRadius: 10,
                    spreadRadius: 2,
                  ),
                ],
              ),
              child: SingleChildScrollView(
                // Wrap PaymentScreen in SingleChildScrollView for its own scrolling
                controller: scrollController,
                child: PaymentScreen(
                  slotIds: _selectedSlotIds
                      .toList(), // Pass the list of selected slot IDs
                  parkingName: widget.parking['name'],
                ),
              ),
            );
          },
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    // Filter slots based on selected floor from the consistently stored _allGeneratedSlots
    final List<Slot> filteredSlots = _selectedFloor == 'All'
        ? _allSlots
        : _allSlots.where((slot) => slot.floor == _selectedFloor).toList();

    debugPrint('Parking info for slots screen: ${widget.parking}');

    // Calculate availability from actual slots data
    bool? lotDisponible;
    String disponibilidadText = 'Cargando...';
    
    if (_allSlots.isNotEmpty) {
      int availableSlots = _allSlots.where((slot) => slot.isAvailable).length;
      int totalSlots = _allSlots.length;
      lotDisponible = availableSlots > 0;
      disponibilidadText = '$availableSlots de $totalSlots disponibles';
    } else {
      // Fallback if no slots data
      lotDisponible = widget.parking['disponible'];
      if (lotDisponible == null) {
        disponibilidadText = 'Información no disponible';
      } else {
        disponibilidadText = lotDisponible ? 'Disponible' : 'Ocupado';
      }
    }

    return Scaffold(
      backgroundColor: Colors.white, // Ensure white background
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              widget.parking['name'] ?? 'Estacionamiento',
              style: const TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.w600,
                fontSize: 18,
              ),
            ),
            Text(
              'Selecciona tu espacio',
              style: TextStyle(
                color: Colors.white.withOpacity(0.8),
                fontSize: 12,
                fontWeight: FontWeight.normal,
              ),
            ),
          ],
        ),
        backgroundColor: Colors.blue.shade800,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.of(context).pop(),
          tooltip: 'Volver al mapa',
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.flash_on, color: Colors.white),
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => QuickReserveScreen(parking: widget.parking),
                ),
              );
            },
            tooltip: 'Reserva Rápida',
          ),
          IconButton(
            icon: const Icon(Icons.map, color: Colors.white),
            onPressed: () => Navigator.of(context).pop(),
            tooltip: 'Volver al mapa',
          ),
        ],
      ),
      body: Stack(
        // Changed root to Stack to layer scrollable content and fixed button
        children: [
          CustomScrollView(
          controller: widget
              .scrollController, // Assign the DraggableScrollableSheet's controller
          slivers: [
            // Quick Info Card
            SliverToBoxAdapter(
              child: Container(
                margin: const EdgeInsets.all(16.0),
                child: Card(
                  elevation: 2,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceAround,
                      children: [
                        _buildQuickInfo(
                          'Tarifa', 
                          _calculateAveragePrice(),
                          Icons.attach_money,
                        ),
                        Container(width: 1, height: 30, color: Colors.grey.shade300),
                        _buildQuickInfo('Servicios', 'Disponibles', Icons.room_service),
                        Container(width: 1, height: 30, color: Colors.grey.shade300),
                        _buildQuickInfo('Estado', disponibilidadText, Icons.info_outline, 
                          color: lotDisponible == true
                              ? Colors.green.shade600
                              : lotDisponible == false
                                  ? Colors.red.shade600
                                  : Colors.grey.shade600),
                      ],
                    ),
                  ),
                ),
              ),
            ),
            const SliverToBoxAdapter(child: SizedBox(height: 20)),
            // Map Section
            SliverToBoxAdapter(
              child: SizedBox(
                height: 250, // Fixed height for the map
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16.0),
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(12),
                    child: FlutterMap(
                      options: MapOptions(
                        initialCenter: widget.parking['latlng'] as LatLng,
                        initialZoom: 15.0,
                        interactionOptions: const InteractionOptions(
                          flags: InteractiveFlag
                              .none, // Disables all user interaction (pan, zoom, rotation)
                        ),
                      ),
                      children: [
                        TileLayer(
                          urlTemplate:
                              'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                          subdomains: const ['a', 'b', 'c'],
                          userAgentPackageName: 'com.example.mobile_app',
                        ),
                        MarkerLayer(
                          markers: [
                            Marker(
                              width: 40.0,
                              height: 40.0,
                              point: widget.parking['latlng'] as LatLng,
                              child: Icon(
                                Icons.local_parking,
                                color: Colors.blue[700],
                                size: 36,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
            const SliverToBoxAdapter(
              child: SizedBox(height: 16),
            ), // Spacing below the map
            // NEW POSITION: Section to display selected slots (moved here)
            if (_selectedSlotIds.isNotEmpty) // Only show if slots are selected
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(24.0, 24.0, 24.0, 8.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Espacios Seleccionados:',
                        style: Theme.of(context).textTheme.titleLarge,
                      ),
                      const SizedBox(height: 8),
                      Wrap(
                        spacing: 8.0, // horizontal spacing between items
                        runSpacing: 4.0, // vertical spacing between lines
                        children: _selectedSlotIds
                            .map(
                              (slotId) => Chip(
                                label: Text(slotId),
                                onDeleted: () {
                                  setState(() {
                                    _selectedSlotIds.remove(
                                      slotId,
                                    ); // Allow removing from display
                                    ScaffoldMessenger.of(context).showSnackBar(
                                      SnackBar(
                                        content: Text(
                                          'Slot $slotId deseleccionado.',
                                        ),
                                        duration: const Duration(
                                          milliseconds: 800,
                                        ),
                                      ),
                                    );
                                  });
                                },
                                deleteIcon: const Icon(Icons.cancel, size: 18),
                                backgroundColor: Colors.blue.shade100,
                                labelStyle: TextStyle(
                                  color: Colors.blue.shade800,
                                ),
                              ),
                            )
                            .toList(),
                      ),
                    ],
                  ),
                ),
              ),
            const SliverToBoxAdapter(
              child: SizedBox(height: 10),
            ), // Spacing below selected slots or map if no slots selected
            // Floor Filter Section
            SliverToBoxAdapter(
              child: Container(
                margin: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
                child: Card(
                  elevation: 1,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'Espacios disponibles',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.w600,
                            color: Colors.grey.shade800,
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                          decoration: BoxDecoration(
                            color: Colors.blue.shade50,
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(color: Colors.blue.shade200),
                          ),
                          child: DropdownButtonHideUnderline(
                            child: DropdownButton<String>(
                              value: _selectedFloor,
                              items: _availableFloors.map<DropdownMenuItem<String>>((
                                String value,
                              ) {
                                return DropdownMenuItem<String>(
                                  value: value,
                                  child: Text(
                                    value,
                                    style: TextStyle(
                                      color: Colors.blue.shade800,
                                      fontWeight: FontWeight.w500,
                                    ),
                                  ),
                                );
                              }).toList(),
                              onChanged: (String? newValue) {
                                setState(() {
                                  _selectedFloor = newValue!;
                                  _selectedSlotIds
                                      .clear(); // Clear selection when floor filter changes
                                });
                              },
                              icon: Icon(
                                Icons.keyboard_arrow_down,
                                color: Colors.blue.shade800,
                              ),
                              iconSize: 20,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
            const SliverToBoxAdapter(child: SizedBox(height: 10)),

            // Slot Grid or "No available" message
            filteredSlots.isEmpty
                ? SliverToBoxAdapter(
                    child: Container(
                      margin: const EdgeInsets.all(16.0),
                      child: Card(
                        elevation: 1,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Padding(
                          padding: const EdgeInsets.all(32.0),
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(
                                Icons.car_rental,
                                size: 48,
                                color: Colors.grey.shade400,
                              ),
                              const SizedBox(height: 16),
                              Text(
                                'No hay espacios disponibles en este piso',
                                style: TextStyle(
                                  fontSize: 16,
                                  color: Colors.grey.shade600,
                                  fontWeight: FontWeight.w500,
                                ),
                                textAlign: TextAlign.center,
                              ),
                              const SizedBox(height: 8),
                              Text(
                                'Prueba seleccionar otro piso',
                                style: TextStyle(
                                  fontSize: 14,
                                  color: Colors.grey.shade500,
                                ),
                                textAlign: TextAlign.center,
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  )
                : SliverPadding(
                    padding: const EdgeInsets.symmetric(horizontal: 16.0),
                    sliver: SliverGrid(
                      gridDelegate:
                          const SliverGridDelegateWithFixedCrossAxisCount(
                            crossAxisCount: 2,
                            crossAxisSpacing: 16.0,
                            mainAxisSpacing: 16.0,
                            childAspectRatio: 1.0,
                          ),
                      delegate: SliverChildBuilderDelegate((context, index) {
                        final slot = filteredSlots[index];
                        return SlotGridItem(
                          key: ValueKey(slot.id),
                          slotId: slot.id,
                          floor: slot.floor,
                          isAvailable: slot.isAvailable,
                          isSelected: _selectedSlotIds.contains(slot.id),
                          onTap: () {
                            if (slot.isAvailable) {
                              setState(() {
                                if (_selectedSlotIds.contains(slot.id)) {
                                  _selectedSlotIds.remove(slot.id);
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    SnackBar(
                                      content: Text(
                                        'Slot ${slot.id} deseleccionado.',
                                      ),
                                      duration: const Duration(
                                        milliseconds: 800,
                                      ),
                                    ),
                                  );
                                } else {
                                  _selectedSlotIds.add(slot.id);
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    SnackBar(
                                      content: Text(
                                        'Slot ${slot.id} seleccionado!',
                                      ),
                                      duration: const Duration(
                                        milliseconds: 800,
                                      ),
                                    ),
                                  );
                                }
                              });
                            } else {
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(
                                  content: Text(
                                    'Este espacio no está disponible.',
                                  ),
                                  duration: Duration(milliseconds: 800),
                                ),
                              );
                            }
                          },
                        );
                      }, childCount: filteredSlots.length),
                    ),
                  ),
            // Added a bottom padding to the CustomScrollView so the content isn't obscured by the floating button
            SliverPadding(
              padding: EdgeInsets.only(
                bottom: _selectedSlotIds.isNotEmpty ? 90.0 : 24.0,
              ), // Adjust based on button height
              sliver: SliverToBoxAdapter(child: Container()),
            ),
          ],
        ),

        // The "Confirmar Reserva" Button - now positioned at the bottom of the Stack
        if (_selectedSlotIds
            .isNotEmpty) // Only show if at least one slot is selected
          Align(
            alignment: Alignment.bottomCenter,
            child: Padding(
              padding: const EdgeInsets.only(
                bottom: 24.0,
                left: 24.0,
                right: 24.0,
              ), // Padding from bottom and sides
              child: SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () async {
                    // Play animation forward
                    if (!_buttonAnimationController.isAnimating) {
                      await _buttonAnimationController.forward();
                      await Future.delayed(
                        const Duration(milliseconds: 50),
                      ); // Short pause at peak
                      await _buttonAnimationController
                          .reverse(); // Play animation reverse
                      await Future.delayed(
                        const Duration(milliseconds: 50),
                      ); // Short pause after animation
                    }
                    _showPaymentScreen(context); // Then show the payment screen
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.blue.shade800,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    elevation: 4,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  child: SlideTransition(
                    // Apply SlideTransition to the button's content
                    position: _buttonSlideAnimation,
                    child: Text(
                      'Reservar (${_selectedSlotIds.length} Espacio${_selectedSlotIds.length > 1 ? 's' : ''})', // Dynamic text
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
