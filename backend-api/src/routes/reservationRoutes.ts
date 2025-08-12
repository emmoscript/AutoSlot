import { Router } from 'express';
import { ReservationController } from '../controllers/reservationController';
import { getDb } from '../database';

const router = Router();

// POST /api/reservations - Crear nueva reserva
router.post('/', async (req, res) => {
  const db = await getDb();
  const reservationController = new ReservationController(db);
  reservationController.createReservation(req, res);
});

// GET /api/reservations/:id - Obtener detalles de reserva específica
router.get('/:id', async (req, res) => {
  const db = await getDb();
  const reservationController = new ReservationController(db);
  reservationController.getReservationById(req, res);
});

// GET /api/reservations/user/:phone - Obtener reservas activas de un usuario
router.get('/user/:phone', async (req, res) => {
  const db = await getDb();
  const reservationController = new ReservationController(db);
  reservationController.getUserReservations(req, res);
});

// PATCH /api/reservations/:id/complete - Marcar reserva como completada
router.patch('/:id/complete', async (req, res) => {
  const db = await getDb();
  const reservationController = new ReservationController(db);
  reservationController.completeReservation(req, res);
});

// DELETE /api/reservations/:id - Cancelar reserva activa
router.delete('/:id', async (req, res) => {
  const db = await getDb();
  const reservationController = new ReservationController(db);
  reservationController.cancelReservation(req, res);
});

export default router; 