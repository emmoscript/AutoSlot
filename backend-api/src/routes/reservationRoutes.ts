import { Router } from 'express';
import { ReservationController } from '../controllers/reservationController';
import { Database } from 'sqlite3';

export default function createReservationRoutes(db: Database): Router {
  const router = Router();
  const reservationController = new ReservationController(db);

  // POST /api/reservations - Crear nueva reserva
  router.post('/', (req, res) => reservationController.createReservation(req, res));

  // GET /api/reservations/:id - Obtener detalles de reserva específica
  router.get('/:id', (req, res) => reservationController.getReservationById(req, res));

  // GET /api/reservations/user/:phone - Obtener reservas activas de un usuario
  router.get('/user/:phone', (req, res) => reservationController.getUserReservations(req, res));

  // PATCH /api/reservations/:id/complete - Marcar reserva como completada
  router.patch('/:id/complete', (req, res) => reservationController.completeReservation(req, res));

  // DELETE /api/reservations/:id - Cancelar reserva activa
  router.delete('/:id', (req, res) => reservationController.cancelReservation(req, res));

  return router;
} 