import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import apiRoutes from './routes'; // Importamos el enrutador principal

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares de seguridad y configuración
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(rateLimit({ windowMs: 60 * 1000, max: 100, message: "Too many requests, please try again later."}));

// Ruta de bienvenida a la API
app.get('/', (req, res) => {
  res.json({
    message: '🚗 AutoSlot API - Now with Parking Lots!',
    version: '1.1.0',
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
  console.log(`🚗 AutoSlot API v1.1.0 listening on port ${PORT}`);
  console.log(`🔗 Local endpoint: http://localhost:${PORT}`);
}); 