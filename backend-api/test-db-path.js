const path = require('path');
const fs = require('fs');

console.log('🗄️ Testing database path...');

// Test the database path that would be used in production
const DB_PATH = path.resolve(__dirname, 'autoslot.db');
const INIT_SQL_PATH = path.resolve(__dirname, 'dist/database/init.sql');

console.log('📁 Current directory:', __dirname);
console.log('📁 DB_PATH:', DB_PATH);
console.log('📁 INIT_SQL_PATH:', INIT_SQL_PATH);

// Check if init.sql exists in dist
if (fs.existsSync(INIT_SQL_PATH)) {
  console.log('✅ init.sql found in dist folder');
} else {
  console.log('❌ init.sql not found in dist folder');
}

// Check if database file exists
if (fs.existsSync(DB_PATH)) {
  console.log('✅ Database file exists');
} else {
  console.log('ℹ️ Database file does not exist (will be created)');
}

// Test database initialization
const sqlite3 = require('sqlite3');

console.log('🗄️ Testing database initialization...');

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('❌ Database connection error:', err);
    process.exit(1);
  }
  
  console.log('✅ Database connection successful');
  
  // Check if database is empty
  db.all(`SELECT name FROM sqlite_master WHERE type='table'`, (err, tables) => {
    if (err) {
      console.error('❌ Error checking tables:', err);
      process.exit(1);
    }
    
    console.log('📊 Tables found:', tables.length);
    if (tables.length > 0) {
      console.log('📋 Table names:', tables.map(t => t.name));
    }
    
    if (tables.length === 0) {
      console.log('🗄️ Database is empty, testing initialization...');
      const initSql = fs.readFileSync(INIT_SQL_PATH, 'utf-8');
      db.exec(initSql, (err) => {
        if (err) {
          console.error('❌ Error initializing database:', err);
          process.exit(1);
        }
        console.log('✅ Database schema initialized successfully');
        process.exit(0);
      });
    } else {
      console.log('✅ Database already initialized');
      process.exit(0);
    }
  });
});
