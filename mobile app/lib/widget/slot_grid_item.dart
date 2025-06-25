import 'package:flutter/material.dart';

// A custom widget to display each slot in the grid
class SlotGridItem extends StatelessWidget {
  final String slotId;
  final String floor; // No longer nullable
  final bool isAvailable;
  final VoidCallback? onTap;
  final bool isSelected;

  const SlotGridItem({
    super.key,
    required this.slotId,
    required this.floor, // No longer nullable
    required this.isAvailable,
    this.onTap,
    this.isSelected = false,
  });

  @override
  Widget build(BuildContext context) {
    Color cardColor = isAvailable ? Colors.green.shade100 : Colors.red.shade100;
    Color borderColor = Colors.transparent; // Default border color

    if (!isAvailable) {
      // If not available, it cannot be selected, so just use red.
      borderColor = Colors.red.shade400;
    } else if (isSelected) {
      // If available and selected, use blue border.
      cardColor = Colors.blue.shade50; // Slightly lighter blue background
      borderColor = Colors.blue.shade400;
    } else {
      // If available and not selected, use green border.
      borderColor = Colors.green.shade400;
    }

    return GestureDetector(
      onTap:
          onTap, // <--- Removed the `isAvailable ? ... : null` condition here
      behavior: HitTestBehavior.opaque,
      child: Card(
        color: cardColor,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
          side: BorderSide(color: borderColor, width: 2),
        ),
        elevation: isSelected ? 8.0 : 2.0,
        child: Padding(
          padding: const EdgeInsets.all(8.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                slotId,
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: isAvailable
                      ? Colors.green.shade700
                      : Colors.red.shade900,
                ),
              ),
              Text(
                'Piso $floor',
                style: TextStyle(
                  fontSize: 14,
                  color: isAvailable ? Colors.green[700] : Colors.red[700],
                ),
              ),
              const SizedBox(height: 4),
              Icon(
                isAvailable ? Icons.check_circle : Icons.cancel,
                color: isAvailable ? Colors.green[700] : Colors.red[700],
                size: 28,
              ),
              Text(
                isAvailable ? 'Libre' : 'Ocupado',
                style: TextStyle(
                  fontSize: 12,
                  color: isAvailable ? Colors.green[700] : Colors.red[700],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
