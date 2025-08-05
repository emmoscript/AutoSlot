import { Router } from 'express';
import { ParkingLotController } from '../controllers/parkingLotController';
import { Database } from 'sqlite3';

export default function createParkingLotRoutes(db: Database): Router {
  const router = Router();
  const parkingLotController = new ParkingLotController(db);

  // Ruta para obtener todos los lotes de estacionamiento
  router.get('/', (req, res) => parkingLotController.getAllLots(req, res));

  // Ruta para crear un nuevo lote de estacionamiento
  router.post('/', (req, res) => parkingLotController.createLot(req, res));

  // Ruta para obtener los detalles de un lote específico, incluyendo sus espacios
  router.get('/:id', (req, res) => parkingLotController.getLotDetails(req, res));

  return router;
} 