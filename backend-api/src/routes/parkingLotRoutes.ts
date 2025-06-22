import { Router } from 'express';
import { parkingLotController } from '../controllers/parkingLotController';

const router = Router();

// Ruta para obtener todos los lotes de estacionamiento
router.get('/', parkingLotController.getAllLots);

// Ruta para crear un nuevo lote de estacionamiento
router.post('/', parkingLotController.createLot);

// Ruta para obtener los detalles de un lote específico, incluyendo sus espacios
router.get('/:id', parkingLotController.getLotDetails);

export default router; 