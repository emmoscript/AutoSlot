import express from 'express';
import authRoutes from './authRoutes';
import parkingLotRoutes from './parkingLotRoutes';
import parkingSpaceRoutes from './parkingSpaceRoutes';
import reservationRoutes from './reservationRoutes';
import sensorRoutes from './sensorRoutes';
import quickReserveRoutes from './quickReserveRoutes';

const router = express.Router();

// Health check endpoint for Render
router.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'AutoSlot Backend API is running',
    timestamp: new Date().toISOString()
  });
});

// API routes
router.use('/auth', authRoutes);
router.use('/parking-lots', parkingLotRoutes);
router.use('/parking-spaces', parkingSpaceRoutes);
router.use('/reservations', reservationRoutes);
router.use('/sensors', sensorRoutes);
router.use('/lots', quickReserveRoutes);

export default router; 