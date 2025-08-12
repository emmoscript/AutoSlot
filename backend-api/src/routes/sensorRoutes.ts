import { Router } from 'express';
import { sensorController } from '../controllers/sensorController';
import { getDb } from '../database';

const router = Router();

// Simular evento de sensor (vehículo entra/sale)
router.post('/trigger', async (req, res) => {
  const db = await getDb();
  sensorController.initialize(db);
  sensorController.simulateSensorEvent(req, res);
});

// Obtener estado actual de todos los sensores
router.get('/status', async (req, res) => {
  const db = await getDb();
  sensorController.initialize(db);
  sensorController.getSensorStatus(req, res);
});

// Simular múltiples eventos aleatorios
router.post('/simulate-random', async (req, res) => {
  const db = await getDb();
  sensorController.initialize(db);
  sensorController.simulateRandomEvents(req, res);
});

export default router; 