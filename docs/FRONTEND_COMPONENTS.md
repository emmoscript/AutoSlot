# Frontend Components Documentation - AutoSlot

## Visión General

El frontend de AutoSlot está construido con React 19, TypeScript y TailwindCSS, siguiendo principios de componentes modulares y reutilizables. La aplicación incluye gestión de lotes de estacionamiento, precios dinámicos, terminales de pago y simulación de sensores.

## Estructura de Componentes

### Componentes de Autenticación

#### `AuthContext.tsx`
**Propósito**: Gestión centralizada del estado de autenticación
- **Estado**: Usuario actual, estado de autenticación, loading
- **Funciones**: Login, logout, actualizar usuario
- **Persistencia**: localStorage para mantener sesión
- **Credenciales**: Hardcoded (admin/admin) para desarrollo

#### `ProtectedRoute.tsx`
**Propósito**: Wrapper para proteger rutas que requieren autenticación
- **Comportamiento**: Redirige a `/login` si no hay sesión
- **Loading**: Muestra spinner mientras verifica autenticación
- **Uso**: Envuelve componentes que requieren autenticación

#### `Login.tsx`
**Propósito**: Página de autenticación
- **Diseño**: Moderno con gradientes y tema dinámico
- **Campos**: Usuario, contraseña con toggle de visibilidad
- **Credenciales**: Muestra credenciales de prueba
- **Validación**: Campos requeridos y feedback visual

#### `UserProfile.tsx`
**Propósito**: Componente de perfil de usuario en navbar
- **Dropdown**: Información del usuario y opciones
- **Información**: Nombre, email, rol, ID
- **Acciones**: Configuración y logout
- **Responsive**: Se adapta a diferentes tamaños de pantalla

### Contextos de Estado

#### `UnifiedSimulationContext.tsx` ⭐ **NUEVO**
**Propósito**: Contexto unificado que sincroniza LPR, sensores y pagos
- **Integración**: Coordina todos los sistemas de simulación
- **Flujo Realista**: LPR → Sensor → Sesión → Pago → Salida
- **Estados**:
  - `lprHistory`: Registros de reconocimiento de placas
  - `activeVehicles`: Vehículos actualmente en estacionamiento
  - `transactions`: Historial de pagos
  - `lots`: Estado de lotes y espacios
  - `vehicleSessions`: Sesiones activas de vehículos

**Funciones Principales**:
- `simulateVehicleEntry(spaceId)`: Flujo completo de entrada
- `simulateVehicleExit(spaceId)`: Flujo completo de salida
- `startAutoMode()`: Simulación automática
- `simulateManualEntry/Exit()`: Control manual por espacio

#### `ThemeContext.tsx`
**Propósito**: Gestión del tema claro/oscuro
- **Persistencia**: localStorage
- **Toggle**: Función para cambiar tema
- **Aplicación**: Clases CSS dinámicas

#### `PricingContext.tsx`
**Propósito**: Gestión de precios dinámicos
- **Factores**: Ocupación, hora, día, eventos
- **Cálculo**: Precios en tiempo real
- **Configuración**: Sliders para ajustar multiplicadores

#### `SensorContext.tsx` (Legacy)
**Propósito**: Estado de sensores (será reemplazado por UnifiedSimulationContext)
- **Funcionalidad**: Simulación de sensores individuales
- **Integración**: Con backend para actualizar espacios

### Componentes de UI Base

#### `ui/button.tsx`
**Propósito**: Botón reutilizable con variantes
- **Variantes**: default, ghost, destructive
- **Tamaños**: sm, md, lg
- **Estados**: disabled, loading

#### `ui/card.tsx`
**Propósito**: Contenedor de tarjeta con header y contenido
- **Composición**: Card, CardHeader, CardTitle, CardContent
- **Tema**: Soporte para modo oscuro/claro

#### `ui/badge.tsx`
**Propósito**: Badge para mostrar estados y etiquetas
- **Variantes**: default, secondary, destructive, outline
- **Colores**: Automáticos según variante

### Componentes de Gestión de Lotes

#### `LotsOverview.tsx`
**Propósito**: Vista general de todos los lotes
- **Funcionalidades**:
  - Mapa interactivo de lotes
  - Tabla con información detallada
  - Botón para agregar nuevos lotes
  - Navegación a detalles de lote
- **Estados**: Loading, error, datos
- **Integración**: Con `LotMap` y `AddLotModal`

#### `LotMap.tsx`
**Propósito**: Mapa interactivo de lotes
- **Tecnología**: Leaflet.js
- **Marcadores**: Ubicación de cada lote
- **Popups**: Información básica del lote
- **Navegación**: Enlaces a detalles

#### `AddLotModal.tsx`
**Propósito**: Modal para crear nuevos lotes
- **Campos**: Nombre, dirección, coordenadas
- **Validación**: Campos requeridos
- **Integración**: Con API de lotes

#### `LotDetail.tsx`
**Propósito**: Página de detalle de lote específico
- **Contenido**:
  - Información del lote
  - Floor plan por niveles
  - Tabs para diferentes vistas
- **Navegación**: Breadcrumb y botón de regreso

#### `FloorPlan.tsx`
**Propósito**: Visualización de espacios por nivel
- **Grid**: Espacios organizados en grid
- **Colores**: Verde (disponible), Rojo (ocupado)
- **Interactividad**: Hover y click
- **Responsive**: Se adapta al tamaño de pantalla

### Componentes de Simulación

#### `SensorSidebar.tsx`
**Propósito**: Panel lateral para simulación de sensores
- **Modos**: Manual y automático
- **Controles**:
  - Toggle entre modos
  - Configuración de intervalos
  - Botones de start/stop
  - Reset de espacios
- **Integración**: Con contexto de sensores

#### `LPRSimulator.tsx`
**Propósito**: Simulador de reconocimiento de placas
- **Funcionalidades**:
  - Registros de entrada/salida
  - Estadísticas de vehículos
  - Historial de placas
  - Distribución por tipo de vehículo
- **Integración**: Con contexto de simulación

### Componentes de Pagos

#### `PaymentDashboard.tsx`
**Propósito**: Dashboard completo de pagos y facturación
- **Tabs**:
  - Transacciones: Historial de pagos
  - Terminales: Estado de terminales de pago
  - Precios Dinámicos: Configuración y gráficos
- **Analytics**: Métricas de ingresos y ocupación
- **Integración**: Con contexto de precios

#### `PricingChart.tsx`
**Propósito**: Gráficos de precios dinámicos
- **Tipos**: Línea temporal, barras
- **Datos**: Precios por hora, ocupación
- **Interactividad**: Zoom, hover, tooltips

#### `DynamicPricingPanel.tsx`
**Propósito**: Panel de configuración de precios dinámicos
- **Controles**: Sliders para factores de precio
- **Vista previa**: Cálculo en tiempo real
- **Configuración**: Ocupación, hora, eventos

### Componentes de Utilidad

#### `ThemeToggle.tsx`
**Propósito**: Botón para cambiar tema
- **Iconos**: Sol (claro), Luna (oscuro)
- **Animación**: Transición suave
- **Posicionamiento**: Flexible

#### `DominicanPlate.tsx`
**Propósito**: Componente para mostrar placas dominicanas
- **Formato**: Estilo oficial dominicano
- **Responsive**: Se adapta al contenido
- **Tema**: Colores según tema actual

## Patrones de Diseño Utilizados

### 1. Context Pattern
- **Uso**: Gestión de estado global
- **Ejemplo**: `UnifiedSimulationContext`, `AuthContext`
- **Beneficios**: Evita prop drilling, centraliza estado

### 2. Component Composition
- **Uso**: Componentes modulares y reutilizables
- **Ejemplo**: `LotsOverview` + `LotMap` + `FloorPlan`
- **Beneficios**: Reutilización, mantenibilidad

### 3. Custom Hooks
- **Uso**: Lógica reutilizable
- **Ejemplo**: `useAuth`, `useUnifiedSimulationContext`
- **Beneficios**: Separación de lógica, reutilización

### 4. Conditional Rendering
- **Uso**: Mostrar/ocultar basado en estado
- **Ejemplo**: Loading states, error states
- **Beneficios**: UX mejorada, feedback claro

## Flujo de Datos

### Autenticación
```
Login → AuthContext → ProtectedRoute → Dashboard
```

### Simulación Unificada
```
User Action → UnifiedSimulationContext → API → State Update → UI Re-render
```

### Gestión de Lotes
```
User Action → API → Context Update → Component Re-render
```

## Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Adaptaciones
- **Navbar**: Colapsa en mobile
- **Sidebar**: Overlay en mobile
- **Grids**: Responsive columns
- **Modals**: Full width en mobile

## Accesibilidad

### Implementado
- **ARIA Labels**: Para elementos interactivos
- **Keyboard Navigation**: Tab navigation
- **Focus Management**: Focus visible
- **Color Contrast**: Cumple estándares WCAG

### Pendiente
- **Screen Reader**: Soporte completo
- **Voice Commands**: Navegación por voz
- **High Contrast**: Modo alto contraste

## Performance

### Optimizaciones
- **React.memo**: Para componentes pesados
- **useCallback**: Para funciones en props
- **useMemo**: Para cálculos costosos
- **Lazy Loading**: Para componentes grandes

### Monitoreo
- **React DevTools**: Profiling
- **Bundle Analyzer**: Tamaño de bundle
- **Performance Metrics**: Core Web Vitals

## Testing Strategy

### Unit Tests
- **Componentes**: Renderizado y props
- **Hooks**: Lógica de custom hooks
- **Utils**: Funciones utilitarias

### Integration Tests
- **Flujos**: Autenticación, simulación
- **Contextos**: Estado global
- **API**: Llamadas a backend

### E2E Tests
- **Casos de uso**: Flujos completos
- **Navegación**: Entre páginas
- **Interacciones**: User actions

## Estado del Desarrollo

### ✅ Completado
- Sistema de autenticación completo
- Contexto de simulación unificada
- Componentes de UI base
- Gestión de lotes y espacios
- Sistema de pagos y terminales
- Simulación de sensores y LPR
- Tema dinámico
- Responsive design

### 🚧 En Desarrollo
- Integración completa del contexto unificado
- Optimizaciones de performance
- Mejoras de accesibilidad

### 📋 Pendiente
- Tests unitarios e integración
- Documentación de API
- Optimizaciones avanzadas
- Nuevas funcionalidades 