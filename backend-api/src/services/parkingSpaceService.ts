import { Database } from 'sqlite3';
import { ParkingSpace } from '../types';

export class ParkingSpaceService {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  async getSpaceById(id: number): Promise<ParkingSpace | undefined> {
    return new Promise((resolve, reject) => {
      this.db.get('SELECT * FROM parking_spaces WHERE id = ?', [id], (err, space) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(space as ParkingSpace || undefined);
      });
    });
  }

  async updateAvailability(id: number, isAvailable: boolean): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.db.run(
        'UPDATE parking_spaces SET is_available = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [isAvailable ? 1 : 0, id],
        function(err) {
          if (err) {
            reject(err);
            return;
          }
          resolve(this.changes > 0);
        }
      );
    });
  }

  async calculateCurrentPrice(spaceId: number): Promise<number> {
    const space = await this.getSpaceById(spaceId);
    if (!space) throw new Error('Space not found');

    return new Promise((resolve, reject) => {
      const now = new Date();
      const hour = now.getHours();
      const dayOfWeek = now.getDay();

      this.db.all(`
        SELECT * FROM pricing_rules 
        WHERE zone_type = ? AND is_active = 1
        AND ((day_of_week IS NULL) OR (day_of_week = ?))
        AND (
          (hour_start <= hour_end AND ? >= hour_start AND ? < hour_end) OR
          (hour_start > hour_end AND (? >= hour_start OR ? < hour_end))
        )
      `, [space.zone_type, dayOfWeek, hour, hour, hour, hour], (err, rules) => {
        if (err) {
          reject(err);
          return;
        }

        let multiplier = 1.0;
        if (rules && rules.length > 0) {
          multiplier = (rules[0] as any).multiplier;
        }
        
        resolve(Math.round(space.base_price * multiplier * 100) / 100);
      });
    });
  }

  async resetAllSpaces(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run('UPDATE parking_spaces SET is_available = true, updated_at = ?', [new Date().toISOString()], (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  }
} 