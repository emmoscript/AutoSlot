import 'dart:math';
import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'package:mobile_app/screens/payment_screen.dart'; // Import the new payment screen
import 'package:mobile_app/widget/slot_grid_item.dart'; // Ensure this path is correct

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
  // Random placeholder images for parking lots (if needed, though not directly used in this UI)
  final List<String> _parkingImages = [
    'https://placehold.co/600x200/AED6F1/000000?text=Parking+Lot+View+1',
    'https://placehold.co/600x200/FADBD8/000000?text=Parking+Lot+View+2',
    'https://placehold.co/600x200/D5F5E3/000000?text=Parking+Lot+View+3',
    'https://placehold.co/600x200/A9CCE3/000000?text=Parking+Lot+View+4',
    'https://placehold.co/600x200/FCF3CF/000000?text=Parking+Lot+View+5',
  ];

  final Random _random = Random();

  // All possible floors for random generation
  final List<String> _allPossibleFloors = ['P1', 'P2', 'P3', 'B1', 'B2'];
  late String _selectedFloor; // State for the currently selected floor
  late List<String> _availableFloors; // Floors available in this parking lot

  // State to manage the selected slots - now a Set
  final Set<String> _selectedSlotIds =
      {}; // Stores the IDs of the currently selected slots

  // Store the generated slots once to maintain consistency on rebuilds
  late List<Map<String, dynamic>> _allGeneratedSlots;

  // AnimationController and Animation for the button
  late AnimationController _buttonAnimationController;
  late Animation<Offset> _buttonSlideAnimation;

  @override
  void initState() {
    super.initState();
    // Initialize available slots only once
    _allGeneratedSlots = _getInitialSlots();

    // Initialize available floors based on generated slots or actual data
    _availableFloors =
        ['All'] +
              _allGeneratedSlots
                  .map((slot) => slot['floor'] as String)
                  .toSet()
                  .toList()
          ..sort();
    _selectedFloor = _availableFloors.first; // Set initial filter to 'All'

    // Initialize the AnimationController for the button
    _buttonAnimationController = AnimationController(
      vsync: this, // 'this' refers to the SingleTickerProviderStateMixin
      duration: const Duration(milliseconds: 150), // Duration for the animation
    );

    // Define the animation: move from its current position to 5% upwards
    _buttonSlideAnimation =
        Tween<Offset>(
          begin: Offset.zero, // Start at current position
          end: const Offset(0.0, -0.1), // Move 10% of its height upwards
        ).animate(
          CurvedAnimation(
            parent: _buttonAnimationController,
            curve: Curves.easeOutCubic, // A smooth easing curve
          ),
        );
  }

  @override
  void dispose() {
    _buttonAnimationController
        .dispose(); // Dispose the controller when the widget is removed
    super.dispose();
  }

  // Helper function to get initial slots, either from parking data or generated
  List<Map<String, dynamic>> _getInitialSlots() {
    List<Map<String, dynamic>> slots = widget.parking['slots'] ?? [];
    if (slots.isEmpty) {
      return _generateRandomSlots(15 + _random.nextInt(10));
    } else {
      return slots.cast<Map<String, dynamic>>();
    }
  }

  // Helper function to generate random slot data
  List<Map<String, dynamic>> _generateRandomSlots(int count) {
    final List<Map<String, dynamic>> generatedSlots = [];
    for (int i = 0; i < count; i++) {
      final String slotId =
          '${String.fromCharCode(65 + _random.nextInt(5))}${_random.nextInt(99) + 1}'; // A1-E99
      final String floor =
          _allPossibleFloors[_random.nextInt(_allPossibleFloors.length)];
      final bool isAvailable = _random.nextBool(); // true or false randomly

      generatedSlots.add({
        'id': slotId,
        'floor': floor,
        'isAvailable': isAvailable,
      });
    }
    return generatedSlots;
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
      backgroundColor: Colors.transparent, // For custom border radius
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
                color: Theme.of(context).canvasColor,
                borderRadius: const BorderRadius.vertical(
                  top: Radius.circular(20),
                ),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.1),
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
    final List<Map<String, dynamic>> filteredSlots = _selectedFloor == 'All'
        ? _allGeneratedSlots
        : _allGeneratedSlots
              .where((slot) => slot['floor'] == _selectedFloor)
              .toList();

    debugPrint('Parking info for slots screen: ${widget.parking}');

    return Stack(
      // Changed root to Stack to layer scrollable content and fixed button
      children: [
        CustomScrollView(
          controller: widget
              .scrollController, // Assign the DraggableScrollableSheet's controller
          slivers: [
            // Drag handle (common in bottom sheets)
            SliverToBoxAdapter(
              child: Center(
                child: Padding(
                  padding: const EdgeInsets.symmetric(vertical: 12.0),
                  child: Container(
                    width: 40,
                    height: 5,
                    decoration: BoxDecoration(
                      color: Colors.grey[300],
                      borderRadius: BorderRadius.circular(10),
                    ),
                  ),
                ),
              ),
            ),
            // Parking Name and Icon
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: 24.0,
                  vertical: 8.0,
                ),
                child: Row(
                  children: [
                    Icon(
                      Icons.local_parking,
                      color: Colors.blue[700],
                      size: 32,
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Text(
                        '${widget.parking['name']}',
                        style: const TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                        ),
                        overflow: TextOverflow.ellipsis, // Handle long names
                      ),
                    ),
                  ],
                ),
              ),
            ),
            // Parking Details (Tariff, Services, Availability)
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Tarifa: ${widget.parking['tarifa']}',
                      style: const TextStyle(fontSize: 16),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Servicios: ${widget.parking['servicios'].join(', ')}',
                      style: const TextStyle(fontSize: 16),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Disponibilidad: ${widget.parking['disponible'] ? 'Disponible' : 'Ocupado'}',
                      style: TextStyle(
                        fontSize: 16,
                        color: widget.parking['disponible']
                            ? Colors.green
                            : Colors.red,
                      ),
                    ),
                  ],
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
            // Floor Filter Dropdown and Slot Grid Header
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24.0),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Espacios disponibles:',
                      style: Theme.of(context).textTheme.titleLarge,
                    ),
                    DropdownButton<String>(
                      value: _selectedFloor,
                      items: _availableFloors.map<DropdownMenuItem<String>>((
                        String value,
                      ) {
                        return DropdownMenuItem<String>(
                          value: value,
                          child: Text(value),
                        );
                      }).toList(),
                      onChanged: (String? newValue) {
                        setState(() {
                          _selectedFloor = newValue!;
                          _selectedSlotIds
                              .clear(); // Clear selection when floor filter changes
                        });
                      },
                    ),
                  ],
                ),
              ),
            ),
            const SliverToBoxAdapter(child: SizedBox(height: 10)),

            // Slot Grid or "No available" message
            filteredSlots.isEmpty
                ? const SliverToBoxAdapter(
                    child: Center(
                      child: Text('No hay espacios disponibles en este piso.'),
                    ),
                  )
                : SliverPadding(
                    // Added SliverPadding to apply padding to the grid
                    padding: const EdgeInsets.symmetric(
                      horizontal: 16.0,
                    ), // Match original GridView padding
                    sliver: SliverGrid(
                      gridDelegate:
                          const SliverGridDelegateWithFixedCrossAxisCount(
                            crossAxisCount: 2,
                            crossAxisSpacing: 16.0,
                            mainAxisSpacing: 16.0,
                            childAspectRatio: 1.0, // Ensures square items
                          ),
                      delegate: SliverChildBuilderDelegate(
                        (context, index) {
                          final slot =
                              filteredSlots[index]; // Use filteredSlots here
                          return SlotGridItem(
                            key: ValueKey(slot['id']), // <--- Added Key here
                            slotId: slot['id'] as String,
                            floor: slot['floor'],
                            isAvailable: slot['isAvailable'] as bool,
                            isSelected: _selectedSlotIds.contains(
                              slot['id'],
                            ), // Check if ID is in the set
                            onTap: () {
                              // Only allow selection if the slot is available
                              if (slot['isAvailable'] == true) {
                                setState(() {
                                  if (_selectedSlotIds.contains(slot['id'])) {
                                    _selectedSlotIds.remove(
                                      slot['id'],
                                    ); // Deselect
                                    ScaffoldMessenger.of(context).showSnackBar(
                                      SnackBar(
                                        content: Text(
                                          'Slot ${slot['id']} deseleccionado.',
                                        ),
                                        duration: const Duration(
                                          milliseconds: 800,
                                        ),
                                      ),
                                    );
                                  } else {
                                    _selectedSlotIds.add(slot['id']); // Select
                                    ScaffoldMessenger.of(context).showSnackBar(
                                      SnackBar(
                                        content: Text(
                                          'Slot ${slot['id']} seleccionado!',
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
                        },
                        childCount:
                            filteredSlots.length, // Use filteredSlots length
                      ),
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
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  child: SlideTransition(
                    // Apply SlideTransition to the button's content
                    position: _buttonSlideAnimation,
                    child: Text(
                      'Reservar (${_selectedSlotIds.length} Espacio${_selectedSlotIds.length > 1 ? 's' : ''})', // Dynamic text
                      style: const TextStyle(fontSize: 18),
                    ),
                  ),
                ),
              ),
            ),
          ),
      ],
    );
  }
}
