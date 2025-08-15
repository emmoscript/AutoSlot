const express = require('express');
const path = require('path');

console.log('🚀 Testing server startup...');

try {
  console.log('📦 Testing Express import...');
  const app = express();
  console.log('✅ Express import successful');
  
  console.log('📦 Testing database initialization...');
  const { getDb } = require('./dist/database');
  console.log('✅ Database import successful');
  
  console.log('📦 Testing routes import...');
  const routes = require('./dist/routes');
  console.log('✅ Routes import successful');
  
  console.log('📦 Testing seedData import...');
  const { seedDatabaseWithDb } = require('./dist/seedData');
  console.log('✅ SeedData import successful');
  
  console.log('🎉 All imports successful! Server should start fine.');
  process.exit(0);
} catch (error) {
  console.error('❌ Startup error:', error.message);
  console.error('❌ Stack trace:', error.stack);
  process.exit(1);
}
