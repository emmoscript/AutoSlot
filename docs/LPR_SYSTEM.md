# Sistema LPR (License Plate Recognition) - Documentación

## Descripción General

El Sistema LPR (License Plate Recognition) de AutoSlot es una solución avanzada de reconocimiento automático de matrículas que permite identificar, rastrear y gestionar vehículos en tiempo real. Este sistema utiliza tecnología de visión por computadora y machine learning para proporcionar una identificación precisa y confiable de vehículos.

## Arquitectura del Sistema

### Componentes Principales

1. **LPRSimulator** - Interfaz de simulación y monitoreo
2. **LPRRecord** - Modelo de datos para registros LPR
3. **LPRAnalytics** - Análisis de actividad vehicular
4. **Cámaras LPR** - Dispositivos de captura de imágenes
5. **Motor de Reconocimiento** - Algoritmos de procesamiento de imágenes

### Flujo de Procesamiento

```
Captura de Imagen → Preprocesamiento → Detección de Placa → OCR → Validación → Registro → Analytics
       ↓                ↓                ↓              ↓        ↓           ↓          ↓
   Cámara LPR      Filtros y Ajustes   Localización   Lectura   Verificación Base de    Reportes
                   de Imagen          de Matrícula   de Texto   de Formato   Datos      en Tiempo Real
```

## Modelos de Datos

### LPRRecord

```typescript
interface LPRRecord {
  id: number;                    // ID único del registro
  lot_id: number;               // ID del lote de estacionamiento
  license_plate: string;         // Placa reconocida (ABC-1234)
  vehicle_type: 'car' | 'truck' | 'motorcycle' | 'bus';
  entry_time: string;           // Timestamp de entrada
  exit_time?: string;           // Timestamp de salida (opcional)
  duration_minutes?: number;     // Duración de estancia
  camera_location: 'entrance' | 'exit' | 'level_1' | 'level_2';
  confidence_score: number;     // Puntuación de confianza (0-1)
  image_url?: string;           // URL de la imagen capturada
  status: 'entered' | 'exited' | 'active';
  payment_status: 'unpaid' | 'paid' | 'pending';
  transaction_id?: string;      // ID de transacción asociada
  created_at: string;
  updated_at: string;
  parking_lot?: ParkingLot;
}
```

### LPRAnalytics

```typescript
interface LPRAnalytics {
  total_vehicles: number;        // Total de vehículos registrados
  active_vehicles: number;       // Vehículos actualmente en estacionamiento
  average_duration: number;      // Duración promedio en minutos
  vehicles_by_type: Record<string, number>;  // Distribución por tipo
  vehicles_by_hour: Record<string, number>;  // Actividad por hora
  top_plates: Array<{ plate: string; visits: number }>;  // Placas más frecuentes
  recent_activity: LPRRecord[];  // Actividad reciente
}
```

## Tecnología de Reconocimiento

### Proceso de Reconocimiento

#### 1. Captura de Imagen
- **Resolución**: Mínimo 1920x1080 (Full HD)
- **FPS**: 30 frames por segundo
- **Iluminación**: Adaptativa con IR para condiciones nocturnas
- **Ángulo**: Optimizado para captura frontal y trasera

#### 2. Preprocesamiento
- **Filtrado de Ruido**: Eliminación de artefactos
- **Ajuste de Contraste**: Mejora de legibilidad
- **Corrección de Perspectiva**: Normalización de ángulos
- **Redimensionamiento**: Optimización para procesamiento

#### 3. Detección de Placa
- **Detección de Regiones**: Identificación de áreas candidatas
- **Filtrado por Forma**: Validación de proporciones
- **Análisis de Textura**: Identificación de caracteres
- **Localización Precisa**: Delimitación exacta de la placa

#### 4. OCR (Optical Character Recognition)
- **Segmentación**: Separación de caracteres individuales
- **Reconocimiento**: Identificación de letras y números
- **Validación**: Verificación de formato dominicano
- **Corrección**: Aplicación de reglas de formato

### Algoritmos Utilizados

#### Detección de Objetos
- **YOLO (You Only Look Once)**: Detección rápida de vehículos
- **SSD (Single Shot Detector)**: Localización de placas
- **R-CNN**: Detección de regiones de interés

#### Reconocimiento de Caracteres
- **Tesseract OCR**: Motor de reconocimiento de texto
- **CNN (Convolutional Neural Networks)**: Clasificación de caracteres
- **LSTM (Long Short-Term Memory)**: Secuencias de caracteres

#### Post-procesamiento
- **Validación de Formato**: Reglas específicas para placas dominicanas
- **Corrección de Errores**: Aplicación de diccionarios y reglas
- **Confianza**: Cálculo de puntuación de precisión

## Formato de Placas Dominicanas

### Tipos de Placa Soportados

#### 1. Placas Estándar (ABC-1234)
- **Formato**: 3 letras + guión + 4 números
- **Ejemplos**: ABC-1234, XYZ-5678, DEF-9012
- **Validación**: Letras A-Z, números 0-9

#### 2. Placas Cortas (ABC-123)
- **Formato**: 3 letras + guión + 3 números
- **Ejemplos**: ABC-123, XYZ-567, DEF-901
- **Validación**: Formato alternativo válido

#### 3. Placas Especiales
- **Diplomáticas**: Formato especial para embajadas
- **Gobierno**: Placas oficiales
- **Temporales**: Placas de prueba

### Reglas de Validación

```typescript
const PLATE_VALIDATION_RULES = {
  standard: /^[A-Z]{3}-\d{4}$/,      // ABC-1234
  short: /^[A-Z]{3}-\d{3}$/,         // ABC-123
  diplomatic: /^[A-Z]{2}-\d{4}$/,    // CD-1234
  government: /^[A-Z]{2}-\d{3}$/,    // GO-123
  temporary: /^[A-Z]{2}-\d{2}$/      // TE-12
};
```

## Interfaz de Usuario

### Dashboard LPR

#### Métricas Principales
- **Vehículos Totales**: Número de vehículos registrados hoy
- **Vehículos Activos**: Vehículos actualmente en estacionamiento
- **Tasa de Reconocimiento**: Porcentaje de precisión del sistema
- **Tiempo Promedio**: Duración media de estancia

#### Simulador en Tiempo Real
- **Control de Simulación**: Iniciar/detener simulación
- **Actividad Actual**: Última placa detectada
- **Estado de Cámaras**: Monitoreo de dispositivos
- **Procesamiento**: Métricas de rendimiento

### Visualización de Datos

#### Registros LPR
- **Placa Simulada**: Visualización de matrícula reconocida
- **Tipo de Vehículo**: Icono y clasificación
- **Ubicación de Cámara**: Entrada, salida, niveles
- **Puntuación de Confianza**: Porcentaje de precisión
- **Estado de Pago**: Pagado, pendiente, sin pagar
- **Timestamps**: Hora de entrada/salida

#### Analytics de Vehículos
- **Distribución por Tipo**: Carros, camiones, motos, buses
- **Placas Más Frecuentes**: Ranking de visitas
- **Actividad por Hora**: Patrones temporales
- **Duración Promedio**: Tiempo de estancia

## Configuración de Cámaras

### Ubicaciones Estratégicas

#### 1. Entrada Principal
- **Propósito**: Detección de entrada de vehículos
- **Configuración**: Captura frontal
- **Iluminación**: Adaptativa diurna/nocturna
- **Resolución**: 4K para máxima precisión

#### 2. Salida Principal
- **Propósito**: Detección de salida de vehículos
- **Configuración**: Captura trasera
- **Iluminación**: IR para condiciones nocturnas
- **Resolución**: 4K para máxima precisión

#### 3. Niveles de Estacionamiento
- **Propósito**: Monitoreo de ocupación
- **Configuración**: Captura lateral
- **Iluminación**: LED integrado
- **Resolución**: Full HD

### Parámetros Técnicos

#### Configuración de Cámara
- **Resolución**: 3840x2160 (4K) / 1920x1080 (Full HD)
- **Frame Rate**: 30 FPS
- **Lente**: 3.6mm f/1.8 (entrada/salida), 2.8mm f/1.6 (niveles)
- **IR Range**: 20-30 metros
- **IP Rating**: IP67 (resistente a agua y polvo)

#### Configuración de Red
- **Protocolo**: RTSP, ONVIF
- **Compresión**: H.264/H.265
- **Ancho de Banda**: 10/100 Mbps
- **Latencia**: <100ms
- **Backup**: Almacenamiento local + cloud

## Integración con Otros Sistemas

### Sistema de Pagos
- **Detección de Salida**: Trigger para cálculo de tarifa
- **Verificación de Pago**: Estado de obligaciones
- **Asociación de Transacciones**: Vinculación placa-transacción
- **Historial de Pagos**: Seguimiento de patrones

### Sistema de Sensores
- **Validación Cruzada**: Confirmación de ocupación
- **Detección de Discrepancias**: Alertas de inconsistencias
- **Optimización de Precisión**: Mejora de algoritmos
- **Análisis de Patrones**: Comportamiento vehicular

### Sistema de Precios Dinámicos
- **Detección de Vehículos**: Input para cálculos de ocupación
- **Análisis de Flujo**: Patrones de entrada/salida
- **Optimización de Precios**: Datos de demanda en tiempo real
- **Predicción de Ocupación**: Machine learning

## Analytics y Reportes

### Métricas de Rendimiento

#### Precisión del Sistema
- **Tasa de Reconocimiento**: Porcentaje de placas detectadas
- **Tasa de Falsos Positivos**: Errores de identificación
- **Tasa de Falsos Negativos**: Placas no detectadas
- **Confianza Promedio**: Puntuación media de confianza

#### Análisis de Tráfico
- **Volumen por Hora**: Vehículos por período
- **Patrones Semanales**: Actividad por día de la semana
- **Picos de Demanda**: Horas de mayor actividad
- **Duración Promedio**: Tiempo de estancia típico

### Reportes Disponibles

#### 1. Reporte Diario
- Resumen de actividad del día
- Vehículos únicos detectados
- Placas más frecuentes
- Métricas de precisión

#### 2. Reporte Semanal
- Comparación con semanas anteriores
- Tendencias de tráfico
- Análisis de patrones
- Optimizaciones recomendadas

#### 3. Reporte Mensual
- Resumen completo de actividad
- Análisis de rendimiento del sistema
- Proyecciones de tráfico
- Mantenimiento programado

## Seguridad y Privacidad

### Protección de Datos
- **Encriptación**: Datos en tránsito y en reposo
- **Anonimización**: Opcional para análisis
- **Retención**: Políticas de almacenamiento
- **Acceso**: Control de permisos granular

### Cumplimiento Legal
- **Ley de Protección de Datos**: Cumplimiento local
- **Consentimiento**: Notificación a usuarios
- **Auditoría**: Logs de acceso y uso
- **Eliminación**: Derecho al olvido

## Monitoreo y Mantenimiento

### Estado del Sistema
- **Monitoreo de Cámaras**: Estado operativo en tiempo real
- **Calidad de Imagen**: Métricas de resolución y claridad
- **Conectividad de Red**: Estado de conexiones
- **Almacenamiento**: Uso de espacio y rendimiento

### Mantenimiento Preventivo
- **Limpieza de Lentes**: Programación mensual
- **Calibración**: Ajuste de parámetros
- **Actualización de Firmware**: Mejoras de seguridad
- **Backup de Configuración**: Respaldo de ajustes

### Alertas Automáticas
- **Cámara Offline**: Notificación inmediata
- **Baja Precisión**: Alertas de rendimiento
- **Error de Reconocimiento**: Patrones de fallo
- **Problemas de Red**: Conectividad interrumpida

## Casos de Uso

### Escenario 1: Entrada de Vehículo
1. Vehículo se acerca a la entrada
2. Cámara LPR captura imagen frontal
3. Sistema detecta y localiza la placa
4. OCR procesa y valida el formato
5. Sistema registra entrada con timestamp
6. Se asigna espacio de estacionamiento
7. Barrera se abre automáticamente
8. Datos se envían a analytics

### Escenario 2: Salida de Vehículo
1. Vehículo se acerca a la salida
2. Cámara LPR captura imagen trasera
3. Sistema reconoce la placa
4. Se calcula duración de estancia
5. Se verifica estado de pago
6. Se procesa transacción si es necesario
7. Barrera se abre tras confirmación
8. Se registra salida en sistema

### Escenario 3: Vehículo No Reconocido
1. Sistema detecta vehículo pero no reconoce placa
2. Se genera alerta de baja confianza
3. Se captura imagen para revisión manual
4. Se notifica al operador
5. Se permite entrada manual si es necesario
6. Se registra incidente para análisis
7. Se ajustan parámetros si es necesario

## Solución de Problemas

### Problemas Comunes

#### Baja Tasa de Reconocimiento
- **Causas**: Iluminación deficiente, ángulo incorrecto, suciedad en lente
- **Soluciones**: Ajustar iluminación, recalibrar cámara, limpiar lente
- **Prevención**: Monitoreo continuo, mantenimiento programado

#### Falsos Positivos
- **Causas**: Texto similar a placas, reflejos, sombras
- **Soluciones**: Ajustar algoritmos, mejorar preprocesamiento
- **Prevención**: Validación cruzada, reglas de formato

#### Problemas de Red
- **Causas**: Ancho de banda insuficiente, latencia alta
- **Soluciones**: Optimizar compresión, mejorar conectividad
- **Prevención**: Monitoreo de red, redundancia

### Herramientas de Debug
- **Logs del Sistema**: Historial detallado de eventos
- **Análisis de Imágenes**: Revisión de capturas problemáticas
- **Métricas de Rendimiento**: KPIs en tiempo real
- **Simulador de Pruebas**: Validación de configuraciones

## Mejoras Futuras

### Tecnología Avanzada
- **Deep Learning**: Modelos más precisos
- **IA Generativa**: Mejora de imágenes pobres
- **Edge Computing**: Procesamiento local
- **5G Integration**: Baja latencia, alta velocidad

### Funcionalidades Avanzadas
- **Reconocimiento de Marca/Modelo**: Identificación de vehículos
- **Detección de Color**: Características adicionales
- **Análisis de Comportamiento**: Patrones sospechosos
- **Predicción de Ocupación**: Machine learning avanzado

### Integración Expandida
- **APIs de Tráfico**: Datos de congestión
- **Sistemas de Seguridad**: Alertas automáticas
- **Aplicaciones Móviles**: Notificaciones en tiempo real
- **IoT Integration**: Sensores adicionales

## Configuración y Personalización

### Configuración de Cámaras
- **Parámetros de Captura**: Resolución, frame rate, compresión
- **Configuración de Lente**: Foco, zoom, ángulo
- **Iluminación**: IR, LED, adaptativa
- **Red**: IP, protocolos, seguridad

### Configuración de Algoritmos
- **Umbrales de Confianza**: Niveles de aceptación
- **Reglas de Validación**: Formatos específicos
- **Filtros de Preprocesamiento**: Ajustes de imagen
- **Parámetros de OCR**: Configuración de reconocimiento

### Configuración de Analytics
- **Métricas Personalizadas**: KPIs específicos
- **Alertas Configurables**: Notificaciones personalizadas
- **Reportes Automáticos**: Programación de envíos
- **Dashboards Personalizados**: Vistas específicas

## Conclusión

El Sistema LPR de AutoSlot representa una solución integral y avanzada para el reconocimiento automático de matrículas. Con su tecnología de punta, integración completa con otros sistemas y capacidades de analytics, proporciona una base sólida para la gestión inteligente de estacionamientos.

La arquitectura modular y escalable permite adaptación a diferentes entornos y necesidades, mientras que las características de seguridad y privacidad aseguran cumplimiento con regulaciones y protección de datos de usuarios.

El sistema no solo mejora la eficiencia operativa, sino que también proporciona insights valiosos para la optimización del negocio y la experiencia del usuario.

The License Plate Recognition (LPR) system is a core feature of AutoSlot, designed to automate vehicle entry and exit logging. This document provides an overview of its simulation within the admin dashboard.

---

### **1. LPR Simulator Component**

The simulation is encapsulated in the `LPRSimulator.tsx` component.

-   **File:** `src/components/LPRSimulator.tsx`
-   **Purpose:** To provide a real-time demonstration of the LPR system's capabilities without needing physical cameras.

---

### **2. Key Features**

#### **a. Realistic Plate Generation**

-   The simulator generates authentic-looking Dominican Republic license plates.
-   **Format:** It combines a standard prefix (e.g., `A`, `G`, `OE`, `DD`) with a variable number of digits.
-   **Logic:** The number of digits is automatically adjusted (from 5 to 6) based on the length of the prefix to ensure the total character count does not exceed 7, preventing visual overflow on the plate component.

#### **b. Styled Plate Visualization**

-   Instead of using placeholder images, the simulator now uses a dedicated `DominicanPlate.tsx` component.
-   This component styles each plate according to its type, using official color codes (e.g., white for private, yellow for public transport, blue for diplomatic).

#### **c. Real-Time Activity Feed**

-   The component simulates vehicle entries and exits at random intervals.
-   A live feed displays the most recent activity, including the license plate number and vehicle type.

#### **d. LPR Analytics**

The dashboard includes several key performance indicators (KPIs) derived from the simulated LPR data:
-   **Total Vehicles:** Total number of unique plates recorded.
-   **Active Vehicles:** Number of vehicles currently inside the lot.
-   **Recognition Rate:** A simulated accuracy percentage for the LPR cameras.
-   **Average Duration:** The average time a vehicle spends in the parking lot.
-   **Distribution by Type:** A breakdown of vehicles by type (car, truck, etc.).
-   **Most Frequent Plates:** A list of "frequent flyer" vehicles.

---

### **3. Technical Implementation**

-   **State Management:** The component uses React's `useState` and `useEffect` hooks to manage the list of records, analytics data, and the simulation state.
-   **Simulation Logic:** A `setInterval` function triggers new LPR events periodically, creating new `LPRRecord` objects.
-   **Data Types:** All data structures (`LPRRecord`, `LPRAnalytics`) are strongly typed and defined in `shared/types/index.ts`. 