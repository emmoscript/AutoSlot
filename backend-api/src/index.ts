import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import createRoutes from './routes'; // Importamos el enrutador principal
import { Database } from 'sqlite3';
import { getDb } from './database';

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares de seguridad y configuración
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(rateLimit({ windowMs: 60 * 1000, max: 100, message: "Too many requests, please try again later."}));

// Initialize database and create routes
let db: Database;

async function startServer() {
  try {
    // Initialize database
    db = await getDb();
    console.log('✅ Database initialized successfully');

    // Create routes with database instance
    const apiRoutes = createRoutes(db);

    // Ruta de bienvenida a la API
    app.get('/', (req, res) => {
      res.json({
        message: '🚗 AutoSlot API - Now with Authentication!',
        version: '1.2.0',
        api_docs: '/api' 
      });
    });

    // Registrar todas las rutas de la API bajo el prefijo /api
    app.use('/api', apiRoutes);

    // Endpoint de Health Check
    app.get('/health', (req, res) => {
      res.status(200).json({ status: 'UP' });
    });

    app.listen(PORT, () => {
      console.log(`🚗 AutoSlot API v1.2.0 listening on port ${PORT}`);
      console.log(`🔗 Local endpoint: http://localhost:${PORT}`);
      console.log(`🔐 Auth endpoints: http://localhost:${PORT}/api/auth`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer(); 