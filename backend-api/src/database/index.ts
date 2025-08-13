import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';
import { seedDatabase } from '../seedData';

const DB_PATH = path.resolve(__dirname, '../../autoslot.db');
const INIT_SQL_PATH = path.resolve(__dirname, './init.sql');

export async function getDb(): Promise<sqlite3.Database> {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        reject(err);
        return;
      }

      // Check if database is empty and initialize if needed
      db.all(`SELECT name FROM sqlite_master WHERE type='table'`, async (err, tables) => {
        if (err) {
          reject(err);
          return;
        }

        if (tables.length === 0) {
          console.log('🗄️ Database is empty, initializing...');
          const initSql = fs.readFileSync(INIT_SQL_PATH, 'utf-8');
          db.exec(initSql, async (err) => {
            if (err) {
              reject(err);
              return;
            }
            console.log('✅ Database schema initialized');
            
            // Check if parking lots exist, if not, run seeding
            db.get('SELECT COUNT(*) as count FROM parking_lots', async (err, row) => {
              if (err) {
                console.error('❌ Error checking parking lots:', err);
                resolve(db);
                return;
              }
              
              if (row.count === 0) {
                console.log('🌱 No parking lots found, running seeding...');
                try {
                  await seedDatabase();
                  console.log('✅ Database seeded successfully!');
                } catch (error) {
                  console.error('❌ Error seeding database:', error);
                }
              }
              resolve(db);
            });
          });
        } else {
          // Check if parking lots exist, if not, run seeding
          db.get('SELECT COUNT(*) as count FROM parking_lots', async (err, row) => {
            if (err) {
              console.error('❌ Error checking parking lots:', err);
              resolve(db);
              return;
            }
            
            if (row.count === 0) {
              console.log('🌱 No parking lots found, running seeding...');
              try {
                await seedDatabase();
                console.log('✅ Database seeded successfully!');
              } catch (error) {
                console.error('❌ Error seeding database:', error);
              }
            }
            resolve(db);
          });
        }
      });
    });
  });
} 