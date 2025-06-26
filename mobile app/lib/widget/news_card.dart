import 'package:flutter/material.dart';

// Widget para las Tarjetas de Novedades
class NewsCard extends StatelessWidget {
  final int index;
  const NewsCard({super.key, required this.index});

  @override
  Widget build(BuildContext context) {
    String title;
    String? subtitle;
    IconData icon;
    Color color;

    if (index == 0) {
      title = '¡Descuento del 10% en tu próxima reserva!';
      subtitle = 'Válido hasta el 30 de junio.';
      icon = Icons.local_offer;
      color = Colors.blue.shade500;
    } else if (index == 1) {
      title = 'Recuerda revisar la disponibilidad antes de salir.';
      icon = Icons.info;
      color = Colors.green.shade700;
    } else if (index == 2) {
      title = 'Nueva función: historial de parqueo disponible.';
      subtitle = 'Explora tus reservas pasadas y futuras.';
      icon = Icons.history_edu; // Icono diferente
      color = Colors.purple.shade700;
    } else if (index == 3) {
      title = '¡Gana puntos extra refiriendo amigos!';
      subtitle = 'Invita a tus amigos y obtén beneficios.';
      icon = Icons.people_alt;
      color = Colors.amber.shade700;
    } else {
      title = 'Actualización de seguridad: tu cuenta más protegida.';
      subtitle = 'Conoce las nuevas medidas de seguridad.';
      icon = Icons.security;
      color = Colors.teal.shade700;
    }

    return Card(
      color: color.withOpacity(0.2),
      child: ListTile(
        contentPadding: const EdgeInsets.symmetric(horizontal: 16),
        leading: Icon(
          icon,
          color: color,
          size: 28 * MediaQuery.of(context).textScaler.scale(1),
        ),
        title: Text(
          title,
          style: TextStyle(
            fontSize: 16 * MediaQuery.of(context).textScaler.scale(1),
            fontWeight: FontWeight.w600,
            color: Colors.black87,
          ),
        ),
        subtitle: subtitle != null
            ? Text(
                subtitle,
                style: TextStyle(
                  fontSize: 13 * MediaQuery.of(context).textScaler.scale(1),
                  color: Colors.black54,
                ),
              )
            : null,
        onTap: () {
          ScaffoldMessenger.of(
            context,
          ).showSnackBar(SnackBar(content: Text('Novedad: "$title"')));
          // Lógica para ver el detalle de la novedad
        },
      ),
    );
  }
}
