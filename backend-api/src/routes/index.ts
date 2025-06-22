import { Router } from 'express';
import parkingLotRoutes from './parkingLotRoutes';
import parkingSpaceRoutes from './parkingSpaceRoutes';
import reservationRoutes from './reservationRoutes';
import sensorRoutes from './sensorRoutes';

const router = Router();

router.use('/lots', parkingLotRoutes);
router.use('/spaces', parkingSpaceRoutes);
router.use('/reservations', reservationRoutes);
router.use('/sensors', sensorRoutes);

export default router; 