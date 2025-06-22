# Arquitectura del Sistema AutoSlot

## Visión General

AutoSlot es un sistema integral de gestión de estacionamientos inteligentes que combina tecnologías de reconocimiento de placas (LPR), sensores IoT, y gestión de pagos dinámicos.

## Arquitectura del Frontend

### Estructura de Componentes

```
admin-dashboard/
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── ui/             # Componentes base (Button, Card, etc.)
│   │   ├── FloorPlan.tsx   # Visualización de planos de estacionamiento
│   │   ├── LotMap.tsx      # Mapa interactivo de lotes
│   │   ├── UserProfile.tsx # Perfil de usuario y logout
│   │   └── ...
│   ├── contexts/           # Contextos de React
│   │   ├── AuthContext.tsx           # Autenticación y gestión de sesión
│   │   ├── UnifiedSimulationContext.tsx # Simulación sincronizada LPR+Sensores+Pagos
│   │   ├── ThemeContext.tsx          # Gestión de tema claro/oscuro
│   │   ├── PricingContext.tsx        # Precios dinámicos
│   │   └── SensorContext.tsx         # Estado de sensores (legacy)
│   ├── pages/              # Páginas principales
│   │   ├── Login.tsx       # Página de autenticación
│   │   ├── Dashboard.tsx   # Dashboard principal
│   │   └── LotDetail.tsx   # Detalle de lote específico
│   └── services/           # Servicios de API
```

### Sistema de Autenticación

#### AuthContext
- **Propósito**: Gestión centralizada de autenticación
- **Funcionalidades**:
  - Login/logout con credenciales hardcoded (admin/admin)
  - Persistencia de sesión en localStorage
  - Protección de rutas
  - Gestión de estado de usuario

#### ProtectedRoute
- **Propósito**: Componente wrapper para proteger rutas
- **Comportamiento**: Redirige a `/login` si no hay sesión activa

#### Flujo de Autenticación
1. Usuario accede a ruta protegida
2. `ProtectedRoute` verifica autenticación
3. Si no autenticado → redirige a `/login`
4. Login exitoso → redirige a dashboard
5. Sesión persistida en localStorage

### Sistema de Simulación Unificada

#### UnifiedSimulationContext
- **Propósito**: Sincronización completa del flujo de estacionamiento
- **Integración**: LPR + Sensores + Pagos

#### Flujo de Entrada de Vehículo
```
1. LPR detecta vehículo (simula cámara)
   ├── Genera placa dominicana aleatoria
   ├── Determina tipo de vehículo
   └── Crea registro LPR

2. Sensor confirma ocupación
   ├── Marca espacio como ocupado
   ├── Actualiza estado de lotes
   └── Muestra notificación

3. Se crea sesión activa
   ├── Vincula LPR + Espacio + Tiempo
   └── Mantiene estado hasta salida
```

#### Flujo de Salida de Vehículo
```
1. Sensor detecta salida
   ├── Libera espacio
   ├── Actualiza estado de lotes
   └── Muestra notificación

2. Sistema genera pago
   ├── Calcula duración y costo
   ├── Crea transacción
   └── Actualiza registro LPR

3. Sesión se cierra
   ├── Marca como inactiva
   ├── Actualiza historial
   └── Limpia vehículos activos
```

#### Modos de Simulación
- **Manual**: Control directo por espacio
- **Automático**: Eventos aleatorios programados
- **Sincronizado**: Todos los sistemas coordinados

## Arquitectura del Backend

### Estructura de Base de Datos

```sql
-- Tabla de lotes de estacionamiento
parking_lots (
  id, name, address, total_spaces, 
  created_at, updated_at
)

-- Tabla de espacios individuales
parking_spaces (
  id, lot_id, name, level, is_available,
  created_at, updated_at
)

-- Tabla de sensores (simulada)
sensors (
  id, space_id, sensor_type, status,
  last_reading, created_at, updated_at
)

-- Tabla de registros LPR
lpr_records (
  id, lot_id, license_plate, vehicle_type,
  entry_time, exit_time, camera_location,
  confidence_score, status, payment_status,
  duration_minutes, created_at, updated_at
)

-- Tabla de reservas/pagos
reservations (
  id, parking_space_id, user_phone,
  start_time, end_time, actual_duration,
  total_cost, status, license_plate,
  created_at
)
```

### API Endpoints

#### Autenticación
- `POST /api/auth/login` - Login de usuario
- `POST /api/auth/logout` - Logout de usuario
- `GET /api/auth/me` - Obtener usuario actual

#### Gestión de Lotes
- `GET /api/lots` - Listar todos los lotes
- `POST /api/lots` - Crear nuevo lote
- `GET /api/lots/:id` - Obtener lote específico
- `PUT /api/lots/:id` - Actualizar lote
- `DELETE /api/lots/:id` - Eliminar lote

#### Gestión de Espacios
- `GET /api/spaces` - Listar espacios
- `GET /api/spaces/:id` - Obtener espacio específico
- `PUT /api/spaces/:id` - Actualizar espacio
- `POST /api/spaces/reset` - Resetear todos los espacios

#### Simulación de Sensores
- `POST /api/sensors/simulate` - Simular evento de sensor
- `POST /api/sensors/simulate-random` - Simulación automática

#### Registros LPR
- `GET /api/lpr` - Listar registros LPR
- `POST /api/lpr` - Crear registro LPR
- `PUT /api/lpr/:id` - Actualizar registro LPR

#### Reservas y Pagos
- `GET /api/reservations` - Listar reservas
- `POST /api/reservations` - Crear reserva
- `GET /api/reservations/:id` - Obtener reserva específica

## Flujo de Datos

### Entrada de Vehículo
1. **LPR Detection**: Cámara detecta placa → API `/api/lpr`
2. **Sensor Update**: Sensor confirma ocupación → API `/api/sensors/simulate`
3. **Space Update**: Espacio marcado como ocupado → API `/api/spaces/:id`
4. **State Sync**: Frontend actualiza todos los contextos

### Salida de Vehículo
1. **Sensor Detection**: Sensor detecta salida → API `/api/sensors/simulate`
2. **Payment Generation**: Sistema calcula pago → API `/api/reservations`
3. **LPR Update**: Registro LPR marcado como pagado → API `/api/lpr/:id`
4. **Space Liberation**: Espacio marcado como disponible → API `/api/spaces/:id`

## Tecnologías Utilizadas

### Frontend
- **React 18** con TypeScript
- **Vite** como bundler
- **Tailwind CSS** para estilos
- **Lucide React** para iconos
- **React Router** para navegación
- **React Hot Toast** para notificaciones

### Backend
- **Node.js** con TypeScript
- **Express.js** como framework
- **SQLite** como base de datos
- **CORS** habilitado para desarrollo

### Características Principales
- **Autenticación**: Sistema de login con persistencia
- **Simulación Realista**: Flujo completo LPR → Sensores → Pagos
- **Tema Dinámico**: Soporte para modo claro/oscuro
- **Responsive Design**: Adaptable a diferentes dispositivos
- **Tiempo Real**: Actualizaciones en vivo de sensores y LPR

## Consideraciones de Seguridad

### Autenticación
- Credenciales hardcoded para desarrollo
- Sesiones persistidas en localStorage
- Rutas protegidas con redirección automática

### API
- Validación de datos en endpoints
- Manejo de errores centralizado
- CORS configurado para desarrollo

## Escalabilidad

### Frontend
- Contextos modulares y reutilizables
- Componentes desacoplados
- Estado centralizado por funcionalidad

### Backend
- Estructura modular de controladores
- Servicios separados por dominio
- Base de datos normalizada

### Futuras Mejoras
- Implementación de JWT para autenticación
- Base de datos PostgreSQL para producción
- Sistema de notificaciones en tiempo real
- Integración con sistemas de pago reales 