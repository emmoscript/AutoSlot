import { Router } from 'express';
import { sensorController } from '../controllers/sensorController';

const router = Router();

// Simular evento de sensor (vehículo entra/sale)
router.post('/trigger', sensorController.simulateSensorEvent);

// Obtener estado actual de todos los sensores
router.get('/status', sensorController.getSensorStatus);

// Simular múltiples eventos aleatorios
router.post('/simulate-random', sensorController.simulateRandomEvents);

export default router; 