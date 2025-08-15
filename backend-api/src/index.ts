import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import routes from './routes';
import { getDb } from './database';
import { seedDatabaseWithDb } from './seedData';

const app = express();
const PORT = parseInt(process.env.PORT || '4000', 10);
const NODE_ENV = process.env.NODE_ENV || 'development';

// Middlewares de seguridad y configuración
app.use(cors({
  origin: NODE_ENV === 'production' ? '*' : true,
  credentials: true
}));
app.use(helmet());
app.use(express.json());
app.use(rateLimit({ 
  windowMs: 60 * 1000, 
  max: NODE_ENV === 'production' ? 200 : 100, 
  message: "Too many requests, please try again later."
}));

// Initialize database and start server
async function startServer() {
  try {
    // Initialize database
    const db = await getDb();
    console.log('✅ Database initialized successfully');

    // Auto-seed database on startup (especially important for Render deployments)
    try {
      console.log('🌱 Starting automatic database seeding...');
      await seedDatabaseWithDb(db);
      console.log('✅ Database seeding completed successfully');
    } catch (seedError) {
      console.warn('⚠️ Database seeding failed, but continuing startup:', seedError);
    }

    // Ruta de bienvenida a la API
    app.get('/', (req, res) => {
      res.json({
        message: '🚗 AutoSlot API - Sistema de Gestión de Estacionamientos',
        version: '1.2.0',
        status: 'running',
        endpoints: {
          auth: '/api/auth',
          parking_lots: '/api/parking-lots',
          parking_spaces: '/api/parking-spaces',
          reservations: '/api/reservations',
          sensors: '/api/sensors',
          health: '/api/health'
        }
      });
    });

    // Registrar todas las rutas de la API bajo el prefijo /api
    app.use('/api', routes);

    // Endpoint de Health Check global
    app.get('/health', (req, res) => {
      res.status(200).json({ 
        status: 'UP',
        service: 'AutoSlot Backend API',
        timestamp: new Date().toISOString()
      });
    });

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚗 AutoSlot API v1.2.0 listening on port ${PORT}`);
      console.log(`🔗 Local endpoint: http://localhost:${PORT}`);
      console.log(`🔐 Auth endpoints: http://localhost:${PORT}/api/auth`);
      console.log(`🌐 Network accessible at: http://0.0.0.0:${PORT}`);
      console.log(`📱 Mobile app should use: http://10.0.2.2:${PORT} (Android emulator)`);
      console.log(`🏥 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer(); 