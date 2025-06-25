import 'package:flutter/material.dart';

class FeedScreen extends StatelessWidget {
  const FeedScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final double horizontalPadding =
        MediaQuery.of(context).size.width * 0.05; // Margen horizontal dinámico

    return Scaffold(
      appBar: AppBar(
        title: Row(
          // Usar Row para el icono y el texto
          mainAxisSize: MainAxisSize.min, // Ajustar al contenido
          children: [
            Icon(
              Icons.directions_car,
              color: Colors.white,
              size: 28,
            ), // Icono de auto (confirmado por el usuario)
            SizedBox(width: 8), // Espacio entre el icono y el texto
            Text(
              'ParkEasy', // Nombre de la app más prominente
              style: TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.bold,
                fontSize: 22,
              ),
            ),
          ],
        ),
        backgroundColor: Colors.blue.shade800, // Azul más oscuro y premium
        elevation: 0, // Sin sombra para un look más plano
        centerTitle: false, // Alineación del título a la izquierda
        actions: [
          Builder(
            builder: (context) => IconButton(
              icon: const Icon(
                Icons.account_circle,
                color: Colors.white,
                size: 30,
              ), // Icono de perfil más visible
              onPressed: () {
                Scaffold.of(
                  context,
                ).openEndDrawer(); // Abre el cajón lateral derecho
              },
            ),
          ),
        ],
      ),
      endDrawer: const _UserDrawer(), // Widget del cajón de usuario
      body: NestedScrollView(
        headerSliverBuilder: (BuildContext context, bool innerBoxIsScrolled) {
          return <Widget>[
            SliverList(
              delegate: SliverChildListDelegate([
                // Sección de Bienvenida y Búsqueda
                Container(
                  color: Colors
                      .blue
                      .shade800, // Mismo color que AppBar para una transición suave
                  padding: EdgeInsets.only(
                    left: horizontalPadding,
                    right: horizontalPadding,
                    top: 10,
                    bottom: 30, // Más padding inferior
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Hola, Juan Pérez.',
                        style: TextStyle(
                          fontSize:
                              28 * MediaQuery.of(context).textScaler.scale(1),
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        '¿A dónde vamos hoy?',
                        style: TextStyle(
                          fontSize:
                              16 * MediaQuery.of(context).textScaler.scale(1),
                          color: Colors.white70,
                        ),
                      ),
                      const SizedBox(height: 24),
                      // Barra de búsqueda/botón principal
                      _SearchParkingButton(
                        horizontalPadding: horizontalPadding,
                      ),
                    ],
                  ),
                ),

                // --- Tarjetas de Resumen (Estadísticas) ---
                Padding(
                  padding: EdgeInsets.symmetric(
                    horizontal: horizontalPadding,
                    vertical: 24,
                  ), // Padding simétrico
                  child: Align(
                    alignment: Alignment.centerLeft,
                    child: Text(
                      'Tu actividad hoy',
                      style: TextStyle(
                        fontSize:
                            20 * MediaQuery.of(context).textScaler.scale(1),
                        fontWeight: FontWeight.bold,
                        color: Colors.grey.shade800,
                      ),
                    ),
                  ),
                ),
                Padding(
                  padding: EdgeInsets.symmetric(horizontal: horizontalPadding),
                  child: Wrap(
                    spacing: 12.0, // Espacio horizontal
                    runSpacing: 12.0, // Espacio vertical entre filas
                    alignment: WrapAlignment.start, // Alinea al inicio
                    children: [
                      _SummaryCard(
                        title: 'Reservas activas',
                        value: '2',
                        icon: Icons.bookmark_added, // Icono más moderno
                        color: Colors.green.shade600,
                      ),
                      _SummaryCard(
                        title: 'Saldo en cartera', // Texto más descriptivo
                        value: '\$200',
                        icon: Icons.account_balance_wallet,
                        color: Colors.blue.shade600,
                      ),
                      _SummaryCard(
                        title: 'Parqueos cercanos',
                        value: '5',
                        icon: Icons.location_on,
                        color: Colors.orange.shade600,
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 40),

                // --- Acciones Rápidas ---
                Padding(
                  padding: EdgeInsets.symmetric(horizontal: horizontalPadding),
                  child: Align(
                    alignment: Alignment.centerLeft,
                    child: Text(
                      'Acciones rápidas',
                      style: TextStyle(
                        fontSize:
                            20 * MediaQuery.of(context).textScaler.scale(1),
                        fontWeight: FontWeight.bold,
                        color: Colors.grey.shade800,
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                Padding(
                  padding: EdgeInsets.symmetric(horizontal: horizontalPadding),
                  child: Wrap(
                    spacing: 16.0,
                    runSpacing: 16.0,
                    alignment: WrapAlignment.spaceAround,
                    children: [
                      _QuickAction(
                        icon: Icons.map_outlined,
                        label: 'Ver Mapa',
                        route: '/map',
                      ),
                      _QuickAction(
                        icon: Icons.history, // Icono de historial
                        label: 'Historial', // Texto actualizado
                        route: '/reservations',
                      ),
                      _QuickAction(
                        icon: Icons.payments,
                        label: 'Recargar', // Texto actualizado
                        route: '/payment',
                      ),
                      _QuickAction(
                        icon: Icons.person_outline,
                        label: 'Mi Perfil',
                        route: '/profile',
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 40),
              ]),
            ),
            // "Novedades" section title, remains visible until scrolled
            SliverAppBar(
              pinned: true,
              primary: false,
              backgroundColor: Theme.of(context).scaffoldBackgroundColor,
              elevation: 0,
              toolbarHeight: 60, // Aumentado para el título
              titleSpacing: horizontalPadding,
              title: Align(
                alignment: Alignment.centerLeft,
                child: Text(
                  'Novedades',
                  style: TextStyle(
                    fontSize: 20 * MediaQuery.of(context).textScaler.scale(1),
                    fontWeight: FontWeight.bold,
                    color: Colors.grey.shade800,
                  ),
                ),
              ),
            ),
          ];
        },
        body: Padding(
          padding: EdgeInsets.symmetric(horizontal: horizontalPadding),
          child: ListView.builder(
            padding: EdgeInsets.zero,
            itemCount: 5, // Ejemplo de 5 elementos de noticias/promociones
            itemBuilder: (context, index) {
              return Padding(
                padding: const EdgeInsets.only(
                  bottom: 12.0,
                ), // Espacio entre tarjetas de novedades
                child: _NewsCard(
                  index: index,
                ), // Usar un widget separado para las tarjetas de novedades
              );
            },
          ),
        ),
      ),
    );
  }
}

// Widget de Botón de Búsqueda de Parqueo (para la parte superior)
class _SearchParkingButton extends StatelessWidget {
  final double horizontalPadding;
  const _SearchParkingButton({required this.horizontalPadding});

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

// Widget para las Tarjetas de Resumen (Estadísticas)
class _SummaryCard extends StatelessWidget {
  final String title;
  final String value;
  final IconData icon;
  final Color color;
  const _SummaryCard({
    required this.title,
    required this.value,
    required this.icon,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    // Calcula el ancho de la tarjeta para adaptarse a 2 o 3 por fila
    final double screenWidth = MediaQuery.of(context).size.width;
    final double cardPadding = 12.0; // Padding del Wrap
    final double horizontalScreenPadding =
        screenWidth * 0.05; // Padding del ListView

    // Ancho total disponible para las tarjetas
    final double totalAvailableWidth =
        screenWidth - (2 * horizontalScreenPadding);

    // Calcular ancho si hay 3 tarjetas en una fila (2 espacios de 12.0)
    double calculatedWidthFor3 = (totalAvailableWidth - (2 * cardPadding)) / 3;
    // Calcular ancho si hay 2 tarjetas en una fila (1 espacio de 12.0)
    double calculatedWidthFor2 = (totalAvailableWidth - (1 * cardPadding)) / 2;

    // Decidir el ancho, priorizando 3 si es suficientemente grande, sino 2
    final double cardDesiredWidth = (calculatedWidthFor3 > 100)
        ? calculatedWidthFor3
        : calculatedWidthFor2;

    return SizedBox(
      width: cardDesiredWidth.clamp(
        140.0,
        180.0,
      ), // Asegura un tamaño mínimo y máximo razonable
      child: Card(
        elevation: 4, // Sombra sutil
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ), // Bordes redondeados
        child: Padding(
          padding: const EdgeInsets.all(12.0),
          child: Column(
            mainAxisSize: MainAxisSize.min, // Ajusta el tamaño al contenido
            crossAxisAlignment:
                CrossAxisAlignment.start, // Alinea el texto a la izquierda
            children: [
              // Fila para icono y valor
              Row(
                children: [
                  Icon(
                    icon,
                    color: color,
                    size: 28 * MediaQuery.of(context).textScaler.scale(1),
                  ), // Icono más grande
                  const SizedBox(
                    width: 4,
                  ), // Reducido para dar más espacio al texto
                  Expanded(
                    child: Text(
                      value,
                      style: TextStyle(
                        fontSize:
                            20 * // Reducido ligeramente para mayor seguridad
                            MediaQuery.of(context).textScaler.scale(1),
                        fontWeight: FontWeight.bold,
                        color: Colors.black87,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Text(
                title,
                textAlign: TextAlign.left,
                style: TextStyle(
                  fontSize: 13 * MediaQuery.of(context).textScaler.scale(1),
                  color: Colors.black54,
                ),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// Widget para las Acciones Rápidas (Estilo Barra)
class _QuickAction extends StatelessWidget {
  final IconData icon;
  final String label;
  final String route;
  const _QuickAction({
    required this.icon,
    required this.label,
    required this.route,
  });

  @override
  Widget build(BuildContext context) {
    const double barHeight = 65.0; // Altura de la barra
    const double iconSize = 26.0; // Tamaño del icono
    const double labelFontSize = 14.0; // Tamaño de la etiqueta

    // Para que los elementos se distribuyan bien en el Wrap
    final double screenWidth = MediaQuery.of(context).size.width;
    final double itemWidth = screenWidth < 400
        ? (screenWidth / 2 - 2 * 16 - 16)
        : 160.0; // Responsive width

    return SizedBox(
      width: itemWidth.clamp(120.0, 160.0), // Ancho de la barra, con límites
      height: barHeight,
      child: Card(
        color: Colors.blue.shade50,
        elevation: 3, // Sombra sutil
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12), // Bordes redondeados
        ),
        clipBehavior: Clip.antiAlias,
        child: InkWell(
          onTap: () {
            if (route.isNotEmpty) {
              Navigator.of(context).pushNamed(route);
            } else {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text('Ruta para "$label" no definida.')),
              );
            }
          },
          child: Padding(
            padding: const EdgeInsets.symmetric(
              horizontal: 12.0,
              vertical: 8.0,
            ),
            child: Row(
              // Usar Row para icono y texto en una línea
              mainAxisAlignment: MainAxisAlignment.start, // Alinea al inicio
              children: [
                Icon(
                  icon,
                  color: Colors.blue.shade700,
                  size: iconSize * MediaQuery.of(context).textScaler.scale(1),
                ),
                const SizedBox(width: 8),
                Expanded(
                  // Permite que el texto se ajuste
                  child: Text(
                    label,
                    style: TextStyle(
                      overflow: TextOverflow.ellipsis,
                      fontSize:
                          labelFontSize *
                          MediaQuery.of(context).textScaler.scale(1),
                      color: Colors.black87,
                      fontWeight: FontWeight.w500,
                    ),
                    textAlign: TextAlign.left,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

// Widget para las Tarjetas de Novedades
class _NewsCard extends StatelessWidget {
  final int index;
  const _NewsCard({required this.index});

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
      color = Colors.blue.shade700;
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
      color: color.withOpacity(0.05), // Fondo muy sutil del color del icono
      elevation: 2, // Sombra más ligera
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: ListTile(
        contentPadding: const EdgeInsets.symmetric(
          horizontal: 16,
          vertical: 12,
        ),
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

// Widget del Cajón de Usuario (Drawer)
class _UserDrawer extends StatelessWidget {
  const _UserDrawer({super.key});

  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: ListView(
        padding: EdgeInsets.zero,
        children: <Widget>[
          UserAccountsDrawerHeader(
            accountName: Text(
              'Juan Pérez',
              style: TextStyle(
                color: Colors.white,
                fontSize: 20 * MediaQuery.of(context).textScaler.scale(1),
                fontWeight: FontWeight.bold,
              ),
            ),
            accountEmail: Text(
              'juan.perez@example.com',
              style: TextStyle(
                color: Colors.white70,
                fontSize: 14 * MediaQuery.of(context).textScaler.scale(1),
              ),
            ),
            currentAccountPicture: CircleAvatar(
              backgroundColor: Colors.white,
              child: Icon(Icons.person, size: 40, color: Colors.blue.shade700),
            ),
            decoration: BoxDecoration(color: Colors.blue.shade700),
          ),
          ListTile(
            leading: Icon(
              Icons.account_circle,
              color: Colors.blue.shade600,
              size: 22,
            ),
            title: Text(
              'Ver Perfil',
              style: TextStyle(
                fontSize: 15 * MediaQuery.of(context).textScaler.scale(1),
              ),
            ),
            onTap: () {
              Navigator.of(context).pop();
              Navigator.of(context).pushNamed('/profile');
            },
          ),
          ListTile(
            leading: Icon(
              Icons.map_outlined,
              color: Colors.blue.shade600,
              size: 22,
            ),
            title: Text(
              'Mapa',
              style: TextStyle(
                fontSize: 15 * MediaQuery.of(context).textScaler.scale(1),
              ),
            ),
            onTap: () {
              Navigator.of(context).pop();
              Navigator.of(context).pushNamed('/map');
            },
          ),
          ListTile(
            leading: Icon(
              Icons.payments,
              color: Colors.blue.shade600,
              size: 22,
            ),
            title: Text(
              'Agregar Fondos',
              style: TextStyle(
                fontSize: 15 * MediaQuery.of(context).textScaler.scale(1),
              ),
            ),
            onTap: () {
              Navigator.of(context).pop();
              Navigator.of(context).pushNamed('/payment');
            },
          ),
          ListTile(
            leading: Icon(Icons.history, color: Colors.blue.shade600, size: 22),
            title: Text(
              'Historial de Reservas',
              style: TextStyle(
                fontSize: 15 * MediaQuery.of(context).textScaler.scale(1),
              ),
            ),
            onTap: () {
              Navigator.of(context).pop();
              Navigator.of(context).pushNamed('/payment');
            },
          ),
          const Divider(),
          ListTile(
            leading: Icon(Icons.logout, color: Colors.red.shade600, size: 22),
            title: Text(
              'Cerrar Sesión',
              style: TextStyle(
                fontSize: 15 * MediaQuery.of(context).textScaler.scale(1),
                color: Colors.red.shade600,
              ),
            ),
            onTap: () {
              Navigator.of(context).pop();
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Cerrando sesión...')),
              );
            },
          ),
        ],
      ),
    );
  }
}
