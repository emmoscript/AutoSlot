import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.resolve(__dirname, '../../autoslot.db');
const INIT_SQL_PATH = path.resolve(__dirname, './init.sql');

export async function getDb(): Promise<Database> {
  const db = await open({
    filename: DB_PATH,
    driver: sqlite3.Database,
  });

  // Si la base de datos está vacía, ejecutar el script de inicialización
  const tables = await db.all(`SELECT name FROM sqlite_master WHERE type='table'`);
  if (tables.length === 0) {
    const initSql = fs.readFileSync(INIT_SQL_PATH, 'utf-8');
    await db.exec(initSql);
  }

  return db;
} 