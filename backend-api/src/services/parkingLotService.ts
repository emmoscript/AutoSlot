import { Database, RunResult } from 'sqlite3';
import { ParkingLot, ParkingSpace, ParkingLotWithSpaces } from '../types';

export class ParkingLotService {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  async getAllLots(): Promise<ParkingLotWithSpaces[]> {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM parking_lots', (err, lots) => {
        if (err) {
          reject(err);
          return;
        }

        Promise.all(
          lots.map(async (lot: any) => {
            return new Promise<ParkingLotWithSpaces>((resolveSpaces, rejectSpaces) => {
              this.db.all('SELECT * FROM parking_spaces WHERE lot_id = ?', [lot.id], (err, spaces) => {
                if (err) {
                  rejectSpaces(err);
                  return;
                }
                resolveSpaces({ ...lot, spaces: spaces as ParkingSpace[] });
              });
            });
          })
        ).then(resolve).catch(reject);
      });
    });
  }

  async getLotById(id: number): Promise<ParkingLotWithSpaces | undefined> {
    return new Promise((resolve, reject) => {
      this.db.get('SELECT * FROM parking_lots WHERE id = ?', [id], (err, lot) => {
        if (err) {
          reject(err);
          return;
        }

        if (!lot) {
          resolve(undefined);
          return;
        }

        this.db.all('SELECT * FROM parking_spaces WHERE lot_id = ?', [id], (err, spaces) => {
          if (err) {
            reject(err);
            return;
          }
          resolve({ ...lot, spaces: spaces as ParkingSpace[] } as ParkingLotWithSpaces);
        });
      });
    });
  }

  async createLot(lotData: Omit<ParkingLot, 'id' | 'created_at' | 'updated_at'>): Promise<ParkingLotWithSpaces> {
    return new Promise((resolve, reject) => {
      const now = new Date().toISOString();
      const db = this.db; // Capture the database instance
      
      this.db.run(
        'INSERT INTO parking_lots (name, address, latitude, longitude, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
        [lotData.name, lotData.address, lotData.latitude, lotData.longitude, now, now],
        function(err: any) {
          if (err) {
            reject(err);
            return;
          }

          // Use the captured database instance
          db.get('SELECT * FROM parking_lots WHERE id = ?', [this.lastID], (err: any, newLot: any) => {
            if (err) {
              reject(err);
              return;
            }
            resolve({ ...newLot, spaces: [] } as ParkingLotWithSpaces);
          });
        }
      );
    });
  }

  async getSpacesByLotId(lotId: number): Promise<ParkingSpace[]> {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM parking_spaces WHERE lot_id = ?', [lotId], (err, spaces) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(spaces as ParkingSpace[]);
      });
    });
  }
} 