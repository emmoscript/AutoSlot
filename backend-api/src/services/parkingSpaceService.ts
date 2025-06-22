import { getDb } from '../database';
import { ParkingSpace } from '../types';

export const parkingSpaceService = {
  async getSpaceById(id: number): Promise<ParkingSpace | undefined> {
    const db = await getDb();
    return db.get('SELECT * FROM parking_spaces WHERE id = ?', id);
  },

  async updateAvailability(id: number, isAvailable: boolean): Promise<boolean> {
    const db = await getDb();
    const result = await db.run(
      'UPDATE parking_spaces SET is_available = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [isAvailable ? 1 : 0, id]
    );
    return (result.changes || 0) > 0;
  },

  async calculateCurrentPrice(spaceId: number): Promise<number> {
    const space = await this.getSpaceById(spaceId);
    if (!space) throw new Error('Space not found');

    const db = await getDb();
    const now = new Date();
    const hour = now.getHours();
    const dayOfWeek = now.getDay();

    const rules = await db.all(`
      SELECT * FROM pricing_rules 
      WHERE zone_type = ? AND is_active = 1
      AND ((day_of_week IS NULL) OR (day_of_week = ?))
      AND (
        (hour_start <= hour_end AND ? >= hour_start AND ? < hour_end) OR
        (hour_start > hour_end AND (? >= hour_start OR ? < hour_end))
      )
    `, [space.zone_type, dayOfWeek, hour, hour, hour, hour]);

    let multiplier = 1.0;
    if (rules.length > 0) {
      multiplier = rules[0].multiplier;
    }
    
    return Math.round(space.base_price * multiplier * 100) / 100;
  },

  async resetAllSpaces(): Promise<void> {
    const db = await getDb();
    await db.run('UPDATE parking_spaces SET is_available = true, updated_at = ?', [new Date().toISOString()]);
  }
}; 