import { Router } from 'express';
import { reservationController } from '../controllers/reservationController';

const router = Router();

// POST /api/reservations - Crear nueva reserva
router.post('/', reservationController.createReservation as any);

// GET /api/reservations/:id - Obtener detalles de reserva específica
router.get('/:id', reservationController.getReservationById as any);

// GET /api/reservations/user/:phone - Obtener reservas activas de un usuario
router.get('/user/:phone', reservationController.getUserReservations as any);

// PATCH /api/reservations/:id/complete - Marcar reserva como completada
router.patch('/:id/complete', reservationController.completeReservation as any);

// DELETE /api/reservations/:id - Cancelar reserva activa
router.delete('/:id', reservationController.cancelReservation as any);

export default router; 