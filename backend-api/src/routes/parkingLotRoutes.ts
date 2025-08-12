import { Router } from 'express';
import { ParkingLotController } from '../controllers/parkingLotController';
import { getDb } from '../database';

const router = Router();

// Ruta para obtener todos los lotes de estacionamiento
router.get('/', async (req, res) => {
  const db = await getDb();
  const parkingLotController = new ParkingLotController(db);
  parkingLotController.getAllLots(req, res);
});

// Ruta para crear un nuevo lote de estacionamiento
router.post('/', async (req, res) => {
  const db = await getDb();
  const parkingLotController = new ParkingLotController(db);
  parkingLotController.createLot(req, res);
});

// Ruta para obtener los detalles de un lote específico, incluyendo sus espacios
router.get('/:id', async (req, res) => {
  const db = await getDb();
  const parkingLotController = new ParkingLotController(db);
  parkingLotController.getLotDetails(req, res);
});

export default router; 