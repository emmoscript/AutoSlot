import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';

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
      db.all(`SELECT name FROM sqlite_master WHERE type='table'`, (err, tables) => {
        if (err) {
          reject(err);
          return;
        }

        if (tables.length === 0) {
          const initSql = fs.readFileSync(INIT_SQL_PATH, 'utf-8');
          db.exec(initSql, (err) => {
            if (err) {
              reject(err);
              return;
            }
            resolve(db);
          });
        } else {
          resolve(db);
        }
      });
    });
  });
} 