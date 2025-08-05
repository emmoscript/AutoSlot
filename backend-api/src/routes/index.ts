import { Router } from 'express';
import createParkingLotRoutes from './parkingLotRoutes';
import createParkingSpaceRoutes from './parkingSpaceRoutes';
import createReservationRoutes from './reservationRoutes';
import sensorRoutes from './sensorRoutes';
import createAuthRoutes from './authRoutes';
import { Database } from 'sqlite3';

export default function createRoutes(db: Database): Router {
  const router = Router();

  router.use('/lots', createParkingLotRoutes(db));
  router.use('/spaces', createParkingSpaceRoutes(db));
  router.use('/reservations', createReservationRoutes(db));
  router.use('/sensors', sensorRoutes);
  router.use('/auth', createAuthRoutes(db));

  return router;
} 