# API Documentation - AutoSlot

## Base URL
```
http://localhost:4000/api
```

## Autenticación

### POST /auth/login
**Descripción**: Autenticación de usuario
- **Credenciales**: admin/admin (hardcoded para desarrollo)
- **Respuesta**: Token de sesión y datos de usuario

**Request Body**:
```json
{
  "username": "admin",
  "password": "admin"
}
```

**Response**:
```json
{
  "success": true,
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@autoslot.com",
    "role": "admin",
    "name": "Administrador"
  },
  "token": "jwt_token_here"
}
```

### POST /auth/logout
**Descripción**: Cerrar sesión
- **Headers**: Authorization: Bearer {token}
- **Respuesta**: Confirmación de logout

### GET /auth/me
**Descripción**: Obtener usuario actual
- **Headers**: Authorization: Bearer {token}
- **Respuesta**: Datos del usuario autenticado

## Gestión de Lotes

### GET /lots
**Descripción**: Obtener todos los lotes de estacionamiento
- **Respuesta**: Array de lotes con espacios

**Response**:
```json
[
  {
    "id": 1,
    "name": "Centro Comercial Plaza",
    "address": "Av. Principal 123",
    "total_spaces": 50,
    "spaces": [
      {
        "id": 1,
        "lot_id": 1,
        "name": "A1",
        "level": 1,
        "is_available": true
      }
    ],
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
]
```

### POST /lots
**Descripción**: Crear nuevo lote
- **Request Body**: Datos del lote
- **Respuesta**: Lote creado

### GET /lots/:id
**Descripción**: Obtener lote específico
- **Params**: ID del lote
- **Respuesta**: Lote con espacios

### PUT /lots/:id
**Descripción**: Actualizar lote
- **Params**: ID del lote
- **Request Body**: Datos a actualizar

### DELETE /lots/:id
**Descripción**: Eliminar lote
- **Params**: ID del lote

## Gestión de Espacios

### GET /spaces
**Descripción**: Obtener todos los espacios
- **Query Params**: 
  - `lot_id`: Filtrar por lote
  - `level`: Filtrar por nivel
  - `available`: Filtrar por disponibilidad

### GET /spaces/:id
**Descripción**: Obtener espacio específico
- **Params**: ID del espacio

### PUT /spaces/:id
**Descripción**: Actualizar espacio
- **Params**: ID del espacio
- **Request Body**: Datos a actualizar

### POST /spaces/reset
**Descripción**: Resetear todos los espacios a disponibles
- **Respuesta**: Confirmación de reset

## Simulación de Sensores

### POST /sensors/simulate
**Descripción**: Simular evento de sensor
- **Request Body**:
```json
{
  "space_id": 1,
  "event_type": "vehicle_entered" | "vehicle_exited"
}
```

**Response**:
```json
{
  "success": true,
  "space": {
    "id": 1,
    "lot_id": 1,
    "name": "A1",
    "level": 1,
    "is_available": false,
    "lot_name": "Centro Comercial Plaza"
  }
}
```

### POST /sensors/simulate-random
**Descripción**: Simulación automática de eventos
- **Request Body**:
```json
{
  "count": 3,
  "lotId": 1
}
```

**Response**:
```json
{
  "success": true,
  "events": [
    {
      "space_id": 1,
      "lot_id": 1,
      "level": 1,
      "new_availability": false,
      "event_type": "vehicle_entered",
      "space_name": "A1",
      "lot_name": "Centro Comercial Plaza"
    }
  ]
}
```

## Registros LPR (License Plate Recognition)

### GET /lpr
**Descripción**: Obtener registros LPR
- **Query Params**:
  - `lot_id`: Filtrar por lote
  - `status`: Filtrar por estado (entered, exited)
  - `limit`: Limitar resultados

**Response**:
```json
[
  {
    "id": 1,
    "lot_id": 1,
    "license_plate": "ABC123",
    "vehicle_type": "car",
    "entry_time": "2024-01-01T10:00:00Z",
    "exit_time": "2024-01-01T12:00:00Z",
    "camera_location": "entrance",
    "confidence_score": 0.95,
    "status": "exited",
    "payment_status": "paid",
    "duration_minutes": 120,
    "created_at": "2024-01-01T10:00:00Z",
    "updated_at": "2024-01-01T12:00:00Z"
  }
]
```

### POST /lpr
**Descripción**: Crear registro LPR
- **Request Body**: Datos del vehículo detectado

### PUT /lpr/:id
**Descripción**: Actualizar registro LPR
- **Params**: ID del registro
- **Request Body**: Datos a actualizar

## Reservas y Pagos

### GET /reservations
**Descripción**: Obtener reservas/pagos
- **Query Params**:
  - `space_id`: Filtrar por espacio
  - `status`: Filtrar por estado
  - `date_from`: Filtrar desde fecha
  - `date_to`: Filtrar hasta fecha

**Response**:
```json
[
  {
    "id": 1,
    "parking_space_id": 1,
    "user_phone": "SIMULATED",
    "start_time": "2024-01-01T10:00:00Z",
    "end_time": "2024-01-01T12:00:00Z",
    "actual_duration": 120,
    "total_cost": 100.00,
    "status": "completed",
    "license_plate": "ABC123",
    "created_at": "2024-01-01T10:00:00Z"
  }
]
```

### POST /reservations
**Descripción**: Crear reserva/pago
- **Request Body**: Datos de la reserva

### GET /reservations/:id
**Descripción**: Obtener reserva específica
- **Params**: ID de la reserva

## Flujo Unificado de Simulación

### Entrada de Vehículo
```
1. POST /lpr
   - Detecta placa y tipo de vehículo
   - Crea registro con status "entered"

2. POST /sensors/simulate
   - Confirma ocupación del espacio
   - Marca espacio como no disponible

3. PUT /spaces/:id
   - Actualiza estado del espacio
   - Sincroniza con frontend
```

### Salida de Vehículo
```
1. POST /sensors/simulate
   - Detecta salida del vehículo
   - Libera espacio

2. POST /reservations
   - Calcula duración y costo
   - Genera transacción de pago

3. PUT /lpr/:id
   - Actualiza registro LPR
   - Marca como "exited" y "paid"

4. PUT /spaces/:id
   - Confirma espacio disponible
   - Sincroniza con frontend
```

## Códigos de Error

### 400 Bad Request
- Datos de entrada inválidos
- Parámetros faltantes

### 401 Unauthorized
- Token de autenticación inválido
- Sesión expirada

### 404 Not Found
- Recurso no encontrado
- ID inválido

### 500 Internal Server Error
- Error interno del servidor
- Problemas de base de datos

## Headers Requeridos

### Autenticación
```
Authorization: Bearer {jwt_token}
```

### Content-Type
```
Content-Type: application/json
```

### CORS
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
```

## Rate Limiting

### Límites Actuales
- **Requests por minuto**: 100
- **Burst**: 20 requests por segundo
- **Simulación**: Sin límites (desarrollo)

## Webhooks (Futuro)

### Eventos Disponibles
- `vehicle.entered`: Vehículo entra al estacionamiento
- `vehicle.exited`: Vehículo sale del estacionamiento
- `payment.completed`: Pago completado
- `space.status_changed`: Estado de espacio cambió

### Formato de Webhook
```json
{
  "event": "vehicle.entered",
  "timestamp": "2024-01-01T10:00:00Z",
  "data": {
    "space_id": 1,
    "license_plate": "ABC123",
    "vehicle_type": "car"
  }
}
```

## Ejemplos de Uso

### Simulación Completa de Entrada
```bash
# 1. Detectar vehículo con LPR
curl -X POST http://localhost:4000/api/lpr \
  -H "Content-Type: application/json" \
  -d '{
    "lot_id": 1,
    "license_plate": "ABC123",
    "vehicle_type": "car",
    "camera_location": "entrance"
  }'

# 2. Confirmar ocupación con sensor
curl -X POST http://localhost:4000/api/sensors/simulate \
  -H "Content-Type: application/json" \
  -d '{
    "space_id": 1,
    "event_type": "vehicle_entered"
  }'
```

### Simulación Completa de Salida
```bash
# 1. Detectar salida con sensor
curl -X POST http://localhost:4000/api/sensors/simulate \
  -H "Content-Type: application/json" \
  -d '{
    "space_id": 1,
    "event_type": "vehicle_exited"
  }'

# 2. Generar pago
curl -X POST http://localhost:4000/api/reservations \
  -H "Content-Type: application/json" \
  -d '{
    "parking_space_id": 1,
    "license_plate": "ABC123",
    "start_time": "2024-01-01T10:00:00Z",
    "end_time": "2024-01-01T12:00:00Z",
    "total_cost": 100.00
  }'
```

## Notas de Desarrollo

### Base de Datos
- **SQLite**: Para desarrollo
- **Migrations**: Automáticas al iniciar
- **Seed Data**: Datos de prueba incluidos

### Logging
- **Console**: Logs básicos
- **Errors**: Captura y reporte de errores
- **Performance**: Métricas de respuesta

### Testing
- **Endpoints**: Tests unitarios
- **Integration**: Flujos completos
- **Mock Data**: Datos de prueba consistentes 