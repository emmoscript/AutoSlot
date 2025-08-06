import { Router } from 'express';
import { sensorController } from '../controllers/sensorController';
import { Database } from 'sqlite3';

export default function createSensorRoutes(db: Database): Router {
  const router = Router();

  // Initialize the controller with database
  sensorController.initialize(db);

  // Simular evento de sensor (vehículo entra/sale)
  router.post('/trigger', sensorController.simulateSensorEvent);

  // Obtener estado actual de todos los sensores
  router.get('/status', sensorController.getSensorStatus);

  // Simular múltiples eventos aleatorios
  router.post('/simulate-random', sensorController.simulateRandomEvents);

  return router;
} 