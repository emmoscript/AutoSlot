const { seedDatabase } = require('./dist/seedData');

console.log('🚀 Starting AutoSlot Database Seeding...');

seedDatabase()
  .then(() => {
    console.log('✅ Seeding completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }); 