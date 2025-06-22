import { getDb } from '../database';
import { ParkingLot, ParkingSpace, ParkingLotWithSpaces } from '../types';

export const parkingLotService = {
  async getAllLots(): Promise<ParkingLotWithSpaces[]> {
    const db = await getDb();
    const lots: ParkingLot[] = await db.all('SELECT * FROM parking_lots');
    
    const lotsWithSpaces: ParkingLotWithSpaces[] = await Promise.all(
      lots.map(async (lot) => {
        const spaces = await db.all('SELECT * FROM parking_spaces WHERE lot_id = ?', lot.id);
        return { ...lot, spaces };
      })
    );

    return lotsWithSpaces;
  },

  async getLotById(id: number): Promise<ParkingLotWithSpaces | undefined> {
    const db = await getDb();
    const lot = await db.get('SELECT * FROM parking_lots WHERE id = ?', id);
    if (lot) {
      const spaces = await db.all('SELECT * FROM parking_spaces WHERE lot_id = ?', id);
      return { ...lot, spaces };
    }
    return undefined;
  },

  async createLot(lotData: Omit<ParkingLot, 'id' | 'created_at' | 'updated_at'>): Promise<ParkingLotWithSpaces> {
    const db = await getDb();
    const now = new Date().toISOString();
    
    const result = await db.run(
      'INSERT INTO parking_lots (name, address, latitude, longitude, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
      [lotData.name, lotData.address, lotData.latitude, lotData.longitude, now, now]
    );
    
    const newLot = await db.get('SELECT * FROM parking_lots WHERE id = ?', result.lastID);
    return { ...newLot, spaces: [] };
  },

  async getSpacesByLotId(lotId: number): Promise<ParkingSpace[]> {
    const db = await getDb();
    return db.all('SELECT * FROM parking_spaces WHERE lot_id = ?', lotId);
  }
}; 