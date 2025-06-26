import 'package:flutter/material.dart';

// Widget de Botón de Búsqueda de Parqueo (para la parte superior)
class SearchParkingButton extends StatelessWidget {
  final double horizontalPadding;
  const SearchParkingButton({super.key, required this.horizontalPadding});

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      onPressed: () {
        Navigator.of(context).pushNamed('/map');
      },
      style: ElevatedButton.styleFrom(
        backgroundColor: Colors.white,
        foregroundColor: Colors.blue.shade800,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12), // Bordes redondeados
        ),
        padding: const EdgeInsets.symmetric(
          horizontal: 20,
          vertical: 15,
        ), // Padding más generoso
        elevation: 6, // Sombra para que destaque
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.start,
        children: [
          Icon(
            Icons.search, // Icono de búsqueda
            size: 28 * MediaQuery.of(context).textScaler.scale(1),
          ),
          const SizedBox(width: 12),
          Text(
            'Busca Parqueo', // Texto del botón
            style: TextStyle(
              fontSize: 18 * MediaQuery.of(context).textScaler.scale(1),
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }
}
