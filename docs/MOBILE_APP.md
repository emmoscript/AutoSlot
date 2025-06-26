## Ejecución de la Aplicación Móvil

1. Instalar dependencias:

   ```bash
   flutter pub get
   ```

2. Iniciar la aplicación:

   ```bash
   flutter run
   ```

Durante el proceso de inicialización, la aplicación verificará tokens de autenticación preexistentes. Para propósitos educativos, se proveen credenciales de prueba (usuario: `admin`, contraseña: `admin`).

---

## Puesta en Marcha del Servidor API

1. Instalar paquetes de Node.js:

   ```bash
   npm install
   ```

2. Iniciar el servidor:

   ```bash
   npm start
   ```

El servidor inicializa la base de datos y aplica migraciones que aseguran la correspondencia del esquema con los requerimientos de la aplicación. Posteriormente, si todo es correcto, expone los endpoints en `http://localhost:4000/api`.

---

## Metodología de Validación y Pruebas

La validación de AutoSlot adopta un enfoque de **pruebas multinivel**, que comprende:

- **Pruebas de widgets** en Flutter, orientadas a verificar la correcta renderización de componentes y su interacción con el usuario.
- **Pruebas de integración HTTP** sobre la API backend, que permiten evaluar casos de borde, validaciones y control de errores.

Este enfoque se alinea con los principios de calidad del software y asegura que los cambios introducidos no generen regresiones funcionales.

---

## Consideraciones de Despliegue y Proyección a Escenarios Reales

Si bien AutoSlot está concebido inicialmente como un prototipo educativo y de validación conceptual, su diseño modular posibilita un camino de evolución hacia entornos de producción:

- **Escalabilidad Cloud**: El backend puede desplegarse en plataformas de orquestación de contenedores como Kubernetes.
- **Persistencia avanzada**: Sustitución de SQLite por PostgreSQL o bases de datos de alta disponibilidad.
- **Integración con hardware real**: Reemplazo progresivo de los endpoints simulados por interfaces físicas con sensores IoT y cámaras.

---

## Perspectiva Académica y Valor Formativo

Desde un enfoque universitario, AutoSlot es un caso de estudio representativo de varios dominios:

- **Sistemas Ciberfísicos** (CPS): interacción entre software, sensores y entorno físico.
- **Desarrollo de Aplicaciones Móviles Multiplataforma**: Flutter como herramienta unificadora.
- **Arquitectura Orientada a Servicios (SOA)**: separación de responsabilidades entre front-end y back-end.
- **Patrones de Diseño de Software**: uso de inyección de dependencias, separación de capas y middleware.
- **Prácticas DevOps**: preparación de entornos reproducibles y automatización de despliegues.

A través de este proyecto, los estudiantes pueden interiorizar no solo habilidades técnicas específicas, sino también competencias transversales relacionadas con la **ingeniería de requisitos, validación de sistemas, documentación técnica y despliegue en entornos productivos**.

---
