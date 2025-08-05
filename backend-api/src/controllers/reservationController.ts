import { Request, Response } from 'express';
import { ReservationService } from '../services/reservationService';
import { Database } from 'sqlite3';

export class ReservationController {
  private reservationService: ReservationService;

  constructor(db: Database) {
    this.reservationService = new ReservationService(db);
  }

  async createReservation(req: Request, res: Response): Promise<void> {
    try {
      const { parking_space_id, user_phone, estimated_duration, license_plate } = req.body;
      if (!parking_space_id || !user_phone || !estimated_duration) {
        res.status(400).json({ error: 'parking_space_id, user_phone, and estimated_duration are required' });
        return;
      }
      const reservation = await this.reservationService.createReservation({
        parking_space_id: parseInt(parking_space_id),
        user_phone,
        estimated_duration: parseInt(estimated_duration),
        license_plate
      });
      res.status(201).json(reservation);
    } catch (error) {
      console.error('Error creating reservation:', error);
      res.status(500).json({ error: (error as Error).message || 'Internal server error' });
    }
  }

  async getReservationById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const reservation = await this.reservationService.getReservationById(id);
      if (!reservation) {
        res.status(404).json({ error: 'Reservation not found' });
        return;
      }
      res.json(reservation);
    } catch (error) {
      console.error('Error getting reservation:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getUserReservations(req: Request, res: Response): Promise<void> {
    try {
      const { phone } = req.params;
      const reservations = await this.reservationService.getUserReservations(phone);
      res.json(reservations);
    } catch (error) {
      console.error('Error getting user reservations:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async completeReservation(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const reservation = await this.reservationService.completeReservation(id);
      res.json(reservation);
    } catch (error) {
      console.error('Error completing reservation:', error);
      res.status(500).json({ error: (error as Error).message || 'Internal server error' });
    }
  }

  async cancelReservation(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      await this.reservationService.cancelReservation(id);
      res.json({ message: 'Reservation cancelled successfully' });
    } catch (error) {
      console.error('Error cancelling reservation:', error);
      res.status(500).json({ error: (error as Error).message || 'Internal server error' });
    }
  }
} 