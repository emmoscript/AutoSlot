# AutoSlot - Sistema de Gestión de Estacionamientos Inteligentes

## 🚗 Visión General

AutoSlot es un sistema integral de gestión de estacionamientos que combina tecnologías de reconocimiento de placas (LPR), sensores IoT, y gestión de pagos dinámicos para crear una experiencia de estacionamiento inteligente y eficiente.

## ✨ Características Principales

### 🔐 Sistema de Autenticación
- **Login seguro** con credenciales administrador
- **Persistencia de sesión** en localStorage
- **Rutas protegidas** con redirección automática
- **Perfil de usuario** con información y logout

### 🎯 Simulación Unificada y Realista
- **Flujo completo**: LPR → Sensores → Pagos
- **Entrada de vehículo**: Cámara detecta → Sensor ocupa → Sesión activa
- **Salida de vehículo**: Sensor libera → Pago generado → Sesión cerrada
- **Sincronización en tiempo real** entre todos los sistemas

### 🏢 Gestión de Lotes
- **Mapa interactivo** de lotes de estacionamiento
- **Floor plans** por niveles con espacios individuales
- **Creación y gestión** de nuevos lotes
- **Navegación intuitiva** entre vistas

### 💰 Sistema de Pagos
- **Precios dinámicos** basados en ocupación y demanda
- **Terminales de pago** múltiples (tarjeta, móvil, QR, efectivo)
- **Facturación automática** al salir del estacionamiento
- **Historial de transacciones** completo

### 📷 Reconocimiento LPR
- **Simulación de cámaras** de reconocimiento de placas
- **Placas dominicanas** realistas
- **Detección de tipos** de vehículo (carro, camión, moto, bus)
- **Historial de registros** con estadísticas

### 🎛️ Simulación de Sensores
- **Control manual** por espacio individual
- **Modo automático** con eventos aleatorios
- **Tiempo real** con notificaciones
- **Reset completo** de espacios

### 🌓 Tema Dinámico
- **Modo claro/oscuro** con persistencia
- **Diseño responsive** para todos los dispositivos
- **Transiciones suaves** entre temas

## 🏗️ Arquitectura

### Frontend
- **React 18** con TypeScript
- **Vite** como bundler
- **Tailwind CSS** para estilos
- **Context API** para estado global
- **React Router** para navegación

### Backend
- **Node.js** con Express
- **SQLite** como base de datos
- **REST API** completa
- **CORS** habilitado

### Flujo de Datos Unificado
```
Entrada: LPR detecta → Sensor ocupa → Sesión activa
Salida:  Sensor libera → Pago generado → Sesión cerrada
```

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+ 
- npm o yarn

### Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/auto-slot.git
cd auto-slot
```

2. **Instalar dependencias del backend**
```bash
cd backend-api
npm install
```

3. **Instalar dependencias del frontend**
```bash
cd ../admin-dashboard
npm install
```

4. **Configurar base de datos**
```bash
cd ../backend-api
npm run seed
```

### Ejecución

1. **Iniciar backend**
```bash
cd backend-api
npm run dev
```

2. **Iniciar frontend**
```bash
cd admin-dashboard
npm run dev
```

3. **Acceder a la aplicación**
- Frontend: http://localhost:5173
- Backend: http://localhost:4000

### Credenciales de Acceso
- **Usuario**: admin
- **Contraseña**: admin

## 📱 Uso del Sistema

### 1. Autenticación
- Acceder a la aplicación
- Ingresar credenciales admin/admin
- Sistema redirige automáticamente al dashboard

### 2. Vista General
- **Mapa de lotes**: Visualización geográfica
- **Tabla de lotes**: Información detallada
- **Crear lote**: Modal para agregar nuevos lotes
- **Navegar a detalles**: Click en lote para ver floor plan

### 3. Simulación de Estacionamiento
- **Modo manual**: Control individual de espacios
- **Modo automático**: Simulación programada
- **Flujo realista**: LPR → Sensor → Pago
- **Notificaciones**: Feedback en tiempo real

### 4. Gestión de Pagos
- **Transacciones**: Historial completo
- **Terminales**: Estado y ubicación
- **Precios dinámicos**: Configuración en tiempo real
- **Gráficos**: Visualización de tendencias

### 5. Reconocimiento LPR
- **Registros**: Historial de vehículos
- **Estadísticas**: Análisis de uso
- **Simulación**: Entrada/salida automática
- **Placas**: Formato dominicano realista

## 🔧 Configuración Avanzada

### Variables de Entorno
```bash
# Backend
PORT=4000
NODE_ENV=development
DB_PATH=./autoslot.db

# Frontend
VITE_API_URL=http://localhost:4000/api
```

### Base de Datos
- **SQLite**: Para desarrollo
- **Migrations**: Automáticas
- **Seed Data**: Incluido
- **Backup**: Manual

### API Endpoints
- Documentación completa en `/docs/API_DOCUMENTATION.md`
- Postman collection disponible
- Ejemplos de uso incluidos

## 🧪 Testing

### Frontend
```bash
cd admin-dashboard
npm run test
```

### Backend
```bash
cd backend-api
npm run test
```

### E2E (Futuro)
```bash
npm run test:e2e
```

## 📊 Monitoreo y Logs

### Frontend
- **Console logs**: Desarrollo
- **Error boundaries**: Captura de errores
- **Performance**: React DevTools

### Backend
- **Console logs**: Básicos
- **Error handling**: Centralizado
- **API metrics**: Respuesta y errores

## 🔒 Seguridad

### Implementado
- **Autenticación**: Sistema de login
- **Rutas protegidas**: Redirección automática
- **Validación**: Datos de entrada
- **CORS**: Configurado para desarrollo

### Pendiente
- **JWT**: Tokens de autenticación
- **HTTPS**: Encriptación en producción
- **Rate limiting**: Limitación de requests
- **Audit logs**: Registro de acciones

## 🚀 Despliegue

### Desarrollo
```bash
# Backend
cd backend-api && npm run dev

# Frontend  
cd admin-dashboard && npm run dev
```

### Producción (Futuro)
```bash
# Build
npm run build

# Deploy
npm run deploy
```

## 📈 Roadmap

### ✅ Completado
- [x] Sistema de autenticación
- [x] Simulación unificada LPR+Sensores+Pagos
- [x] Gestión completa de lotes
- [x] Sistema de pagos dinámicos
- [x] Reconocimiento LPR
- [x] Tema dinámico
- [x] Diseño responsive
- [x] Tests unitarios e integración
- [x] Optimizaciones de performance
- [x] Mejoras de accesibilidad


## 🤝 Contribución

### Guías de Contribución
1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

### Estándares de Código
- **TypeScript**: Tipado estricto
- **ESLint**: Linting de código
- **Prettier**: Formateo automático
- **Conventional Commits**: Mensajes de commit

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 📞 Soporte

### Documentación
- **Arquitectura**: `/docs/ARCHITECTURE.md`
- **API**: `/docs/API_DOCUMENTATION.md`
- **Componentes**: `/docs/FRONTEND_COMPONENTS.md`

### Contacto
- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions
- **Email**: soporte@autoslot.com

## 🙏 Agradecimientos

- **React Team**: Framework increíble
- **Tailwind CSS**: Estilos utilitarios
- **Lucide**: Iconos hermosos
- **SQLite**: Base de datos ligera
- **Comunidad**: Feedback y contribuciones

---

**AutoSlot** - Haciendo el estacionamiento más inteligente, un espacio a la vez. 🚗✨ 
