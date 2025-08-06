import { Database, RunResult } from 'sqlite3';
import { Reservation, CreateReservationRequest } from '../types';
import { ParkingSpaceService } from './parkingSpaceService';

// Helper function to map a database row to a Reservation object
const rowToReservation = (row: any): Reservation => {
  if (!row) return row;
  return {
    id: row.id,
    parking_space_id: row.parking_space_id,
    user_phone: row.user_phone,
    start_time: row.start_time,
    end_time: row.end_time,
    estimated_duration: row.estimated_duration,
    actual_duration: row.actual_duration,
    total_cost: row.total_cost,
    status: row.status,
    license_plate: row.license_plate,
    created_at: row.created_at,
    parking_space: {
      id: row.parking_space_id,
      lot_id: row.lot_id,
      name: row.space_name,
      level: row.space_level,
      is_available: row.is_available,
      base_price: row.base_price,
      zone_type: row.space_zone_type,
      created_at: row.space_created_at,
      updated_at: row.space_updated_at,
    },
    parking_lot: {
      id: row.lot_id,
      name: row.lot_name,
      address: row.lot_address,
      latitude: row.lot_latitude,
      longitude: row.lot_longitude,
      created_at: row.lot_created_at,
      updated_at: row.lot_updated_at,
    }
  };
};

const BASE_RESERVATION_QUERY = `
  SELECT 
    r.*,
    s.name as space_name, s.level as space_level, s.is_available, s.base_price, s.zone_type as space_zone_type, s.created_at as space_created_at, s.updated_at as space_updated_at,
    l.id as lot_id, l.name as lot_name, l.address as lot_address, l.latitude as lot_latitude, l.longitude as lot_longitude, l.created_at as lot_created_at, l.updated_at as lot_updated_at
  FROM reservations r
  JOIN parking_spaces s ON r.parking_space_id = s.id
  JOIN parking_lots l ON s.lot_id = l.id
`;

export class ReservationService {
  private db: Database;
  private parkingSpaceService: ParkingSpaceService;

  constructor(db: Database) {
    this.db = db;
    this.parkingSpaceService = new ParkingSpaceService(db);
  }

  async createReservation(data: CreateReservationRequest): Promise<Reservation> {
    const space = await this.parkingSpaceService.getSpaceById(data.parking_space_id);
    if (!space) throw new Error('Parking space not found');
    if (!space.is_available) throw new Error('Parking space is not available');

    return new Promise((resolve, reject) => {
      // Validar que no hay reservas solapadas
      this.db.all(`
        SELECT * FROM reservations 
        WHERE parking_space_id = ? AND status = 'active'
        AND (
          (start_time <= datetime('now') AND (end_time IS NULL OR end_time > datetime('now'))) OR
          (start_time <= datetime('now', '+' || ? || ' minutes') AND start_time > datetime('now'))
        )
      `, [data.parking_space_id, data.estimated_duration], async (err, overlappingReservations) => {
        if (err) {
          reject(err);
          return;
        }

        if (overlappingReservations && overlappingReservations.length > 0) {
          reject(new Error('Space is already reserved for this time period'));
          return;
        }

        // Validar que el usuario no tiene más de 2 reservas activas
        this.db.all(`
          SELECT COUNT(*) as count FROM reservations 
          WHERE user_phone = ? AND status = 'active'
        `, [data.user_phone], async (err, userActiveReservations) => {
          if (err) {
            reject(err);
            return;
          }

          if (userActiveReservations && userActiveReservations[0] && (userActiveReservations[0] as any).count >= 2) {
            reject(new Error('User cannot have more than 2 active reservations'));
            return;
          }

          // Calcular precio total
          const currentPrice = await this.parkingSpaceService.calculateCurrentPrice(data.parking_space_id);
          const totalCost = (currentPrice * data.estimated_duration) / 60;

          // Crear la reserva
          this.db.run(`
            INSERT INTO reservations (
              parking_space_id, user_phone, start_time, estimated_duration, 
              total_cost, license_plate, status
            ) VALUES (?, ?, datetime('now'), ?, ?, ?, 'active')
          `, [
            data.parking_space_id,
            data.user_phone,
            data.estimated_duration,
            totalCost,
            data.license_plate || null
          ], async function(this: any, err: any) {
            if (err) {
              reject(err);
              return;
            }

            // Actualizar disponibilidad del espacio
            await this.parkingSpaceService.updateAvailability(data.parking_space_id, false);

            // Obtener la reserva creada
            const newReservation = await this.getReservationById(this.lastID);
            resolve(newReservation!);
          }.bind({ 
            parkingSpaceService: this.parkingSpaceService, 
            getReservationById: this.getReservationById.bind(this) 
          }));
        });
      });
    });
  }

  async getReservationById(id: number): Promise<Reservation | undefined> {
    return new Promise((resolve, reject) => {
      this.db.get(`${BASE_RESERVATION_QUERY} WHERE r.id = ?`, [id], (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(row ? rowToReservation(row) : undefined);
      });
    });
  }

  async getUserReservations(phone: string): Promise<Reservation[]> {
    return new Promise((resolve, reject) => {
      this.db.all(`${BASE_RESERVATION_QUERY} WHERE r.user_phone = ? ORDER BY r.start_time DESC`, [phone], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(rows ? rows.map(rowToReservation) : []);
      });
    });
  }

  async completeReservation(id: number): Promise<Reservation> {
    const reservation = await this.getReservationById(id);
    if (!reservation) throw new Error('Reservation not found');
    if (reservation.status !== 'active') throw new Error('Reservation is not active');
    
    return new Promise((resolve, reject) => {
      const now = new Date();
      const startTime = new Date(reservation.start_time);
      const actualDuration = Math.round((now.getTime() - startTime.getTime()) / (1000 * 60)); // duration in minutes

      this.parkingSpaceService.calculateCurrentPrice(reservation.parking_space_id).then(currentPrice => {
        const finalCost = (currentPrice * actualDuration) / 60;

        this.db.run(
          `UPDATE reservations SET end_time = ?, actual_duration = ?, total_cost = ?, status = 'completed' WHERE id = ?`,
          [now.toISOString(), actualDuration, finalCost, id],
          async function(this: any, err: any) {
            if (err) {
              reject(err);
              return;
            }

            await this.parkingSpaceService.updateAvailability(reservation.parking_space_id, true);
            const updatedReservation = await this.getReservationById(id);
            resolve(updatedReservation!);
          }.bind({ 
            parkingSpaceService: this.parkingSpaceService,
            getReservationById: this.getReservationById.bind(this)
          })
        );
      }).catch(reject);
    });
  }

  async cancelReservation(id: number): Promise<boolean> {
    const reservation = await this.getReservationById(id);
    if (!reservation) throw new Error('Reservation not found');
    if (reservation.status !== 'active') throw new Error('Reservation is not active');

    return new Promise((resolve, reject) => {
      this.db.run(
        `UPDATE reservations SET status = 'cancelled', end_time = datetime('now') WHERE id = ?`,
        [id],
        async function(this: any, err: any) {
          if (err) {
            reject(err);
            return;
          }

          await this.parkingSpaceService.updateAvailability(reservation.parking_space_id, true);
          resolve(this.changes > 0);
        }.bind({ parkingSpaceService: this.parkingSpaceService })
      );
    });
  }
} 