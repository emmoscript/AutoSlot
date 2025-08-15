console.log('🧪 Testing server imports...');

try {
  console.log('📦 Testing database import...');
  const { getDb } = require('./dist/database');
  console.log('✅ Database import successful');
  
  console.log('📦 Testing routes import...');
  const routes = require('./dist/routes');
  console.log('✅ Routes import successful');
  
  console.log('📦 Testing seedData import...');
  const { seedDatabaseWithDb } = require('./dist/seedData');
  console.log('✅ SeedData import successful');
  
  console.log('🎉 All imports successful!');
  process.exit(0);
} catch (error) {
  console.error('❌ Import error:', error.message);
  console.error('❌ Stack trace:', error.stack);
  process.exit(1);
}
