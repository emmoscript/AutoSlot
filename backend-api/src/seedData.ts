import { getDb } from './database';

interface SeedLot {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  levels: {
    level: number;
    spaces: {
      name: string;
      zone_type: 'premium' | 'standard' | 'economy';
      base_price: number;
      is_available: boolean;
    }[];
  }[];
}

const seedData: SeedLot[] = [
  {
    name: "Acrópolis Center",
    address: "Av. Winston Churchill, Santo Domingo",
    latitude: 18.4861,
    longitude: -69.9312,
    levels: [
      {
        level: 1,
        spaces: [
          { name: "A1", zone_type: "premium", base_price: 150, is_available: true },
          { name: "A2", zone_type: "premium", base_price: 150, is_available: false },
          { name: "A3", zone_type: "premium", base_price: 150, is_available: true },
          { name: "A4", zone_type: "premium", base_price: 150, is_available: true },
          { name: "A5", zone_type: "premium", base_price: 150, is_available: false },
          { name: "B1", zone_type: "standard", base_price: 100, is_available: true },
          { name: "B2", zone_type: "standard", base_price: 100, is_available: true },
          { name: "B3", zone_type: "standard", base_price: 100, is_available: false },
          { name: "B4", zone_type: "standard", base_price: 100, is_available: true },
          { name: "B5", zone_type: "standard", base_price: 100, is_available: true },
          { name: "C1", zone_type: "economy", base_price: 75, is_available: true },
          { name: "C2", zone_type: "economy", base_price: 75, is_available: true },
          { name: "C3", zone_type: "economy", base_price: 75, is_available: false },
          { name: "C4", zone_type: "economy", base_price: 75, is_available: true },
          { name: "C5", zone_type: "economy", base_price: 75, is_available: true },
        ]
      },
      {
        level: 2,
        spaces: [
          { name: "A1", zone_type: "premium", base_price: 140, is_available: true },
          { name: "A2", zone_type: "premium", base_price: 140, is_available: true },
          { name: "A3", zone_type: "premium", base_price: 140, is_available: false },
          { name: "A4", zone_type: "premium", base_price: 140, is_available: true },
          { name: "A5", zone_type: "premium", base_price: 140, is_available: true },
          { name: "B1", zone_type: "standard", base_price: 95, is_available: true },
          { name: "B2", zone_type: "standard", base_price: 95, is_available: false },
          { name: "B3", zone_type: "standard", base_price: 95, is_available: true },
          { name: "B4", zone_type: "standard", base_price: 95, is_available: true },
          { name: "B5", zone_type: "standard", base_price: 95, is_available: false },
          { name: "C1", zone_type: "economy", base_price: 70, is_available: true },
          { name: "C2", zone_type: "economy", base_price: 70, is_available: true },
          { name: "C3", zone_type: "economy", base_price: 70, is_available: true },
          { name: "C4", zone_type: "economy", base_price: 70, is_available: false },
          { name: "C5", zone_type: "economy", base_price: 70, is_available: true },
        ]
      }
    ]
  },
  {
    name: "Blue Mall",
    address: "Av. Sarasota, Santo Domingo",
    latitude: 18.4567,
    longitude: -69.9289,
    levels: [
      {
        level: 1,
        spaces: [
          { name: "P1", zone_type: "premium", base_price: 160, is_available: true },
          { name: "P2", zone_type: "premium", base_price: 160, is_available: false },
          { name: "P3", zone_type: "premium", base_price: 160, is_available: true },
          { name: "P4", zone_type: "premium", base_price: 160, is_available: true },
          { name: "P5", zone_type: "premium", base_price: 160, is_available: false },
          { name: "P6", zone_type: "premium", base_price: 160, is_available: true },
          { name: "S1", zone_type: "standard", base_price: 110, is_available: true },
          { name: "S2", zone_type: "standard", base_price: 110, is_available: true },
          { name: "S3", zone_type: "standard", base_price: 110, is_available: false },
          { name: "S4", zone_type: "standard", base_price: 110, is_available: true },
          { name: "S5", zone_type: "standard", base_price: 110, is_available: true },
          { name: "S6", zone_type: "standard", base_price: 110, is_available: false },
          { name: "E1", zone_type: "economy", base_price: 80, is_available: true },
          { name: "E2", zone_type: "economy", base_price: 80, is_available: true },
          { name: "E3", zone_type: "economy", base_price: 80, is_available: true },
          { name: "E4", zone_type: "economy", base_price: 80, is_available: false },
          { name: "E5", zone_type: "economy", base_price: 80, is_available: true },
          { name: "E6", zone_type: "economy", base_price: 80, is_available: true },
        ]
      },
      {
        level: 2,
        spaces: [
          { name: "P1", zone_type: "premium", base_price: 150, is_available: true },
          { name: "P2", zone_type: "premium", base_price: 150, is_available: true },
          { name: "P3", zone_type: "premium", base_price: 150, is_available: false },
          { name: "P4", zone_type: "premium", base_price: 150, is_available: true },
          { name: "P5", zone_type: "premium", base_price: 150, is_available: true },
          { name: "P6", zone_type: "premium", base_price: 150, is_available: false },
          { name: "S1", zone_type: "standard", base_price: 105, is_available: true },
          { name: "S2", zone_type: "standard", base_price: 105, is_available: false },
          { name: "S3", zone_type: "standard", base_price: 105, is_available: true },
          { name: "S4", zone_type: "standard", base_price: 105, is_available: true },
          { name: "S5", zone_type: "standard", base_price: 105, is_available: false },
          { name: "S6", zone_type: "standard", base_price: 105, is_available: true },
          { name: "E1", zone_type: "economy", base_price: 75, is_available: true },
          { name: "E2", zone_type: "economy", base_price: 75, is_available: true },
          { name: "E3", zone_type: "economy", base_price: 75, is_available: false },
          { name: "E4", zone_type: "economy", base_price: 75, is_available: true },
          { name: "E5", zone_type: "economy", base_price: 75, is_available: true },
          { name: "E6", zone_type: "economy", base_price: 75, is_available: false },
        ]
      },
      {
        level: 3,
        spaces: [
          { name: "P1", zone_type: "premium", base_price: 140, is_available: true },
          { name: "P2", zone_type: "premium", base_price: 140, is_available: true },
          { name: "P3", zone_type: "premium", base_price: 140, is_available: true },
          { name: "P4", zone_type: "premium", base_price: 140, is_available: false },
          { name: "P5", zone_type: "premium", base_price: 140, is_available: true },
          { name: "P6", zone_type: "premium", base_price: 140, is_available: true },
          { name: "S1", zone_type: "standard", base_price: 100, is_available: true },
          { name: "S2", zone_type: "standard", base_price: 100, is_available: true },
          { name: "S3", zone_type: "standard", base_price: 100, is_available: false },
          { name: "S4", zone_type: "standard", base_price: 100, is_available: true },
          { name: "S5", zone_type: "standard", base_price: 100, is_available: true },
          { name: "S6", zone_type: "standard", base_price: 100, is_available: false },
          { name: "E1", zone_type: "economy", base_price: 70, is_available: true },
          { name: "E2", zone_type: "economy", base_price: 70, is_available: false },
          { name: "E3", zone_type: "economy", base_price: 70, is_available: true },
          { name: "E4", zone_type: "economy", base_price: 70, is_available: true },
          { name: "E5", zone_type: "economy", base_price: 70, is_available: false },
          { name: "E6", zone_type: "economy", base_price: 70, is_available: true },
        ]
      }
    ]
  },
  {
    name: "Galería 360",
    address: "Av. John F. Kennedy, Santo Domingo",
    latitude: 18.4678,
    longitude: -69.9315,
    levels: [
      {
        level: 1,
        spaces: [
          { name: "A1", zone_type: "premium", base_price: 145, is_available: true },
          { name: "A2", zone_type: "premium", base_price: 145, is_available: false },
          { name: "A3", zone_type: "premium", base_price: 145, is_available: true },
          { name: "A4", zone_type: "premium", base_price: 145, is_available: true },
          { name: "A5", zone_type: "premium", base_price: 145, is_available: false },
          { name: "A6", zone_type: "premium", base_price: 145, is_available: true },
          { name: "A7", zone_type: "premium", base_price: 145, is_available: true },
          { name: "A8", zone_type: "premium", base_price: 145, is_available: false },
          { name: "B1", zone_type: "standard", base_price: 98, is_available: true },
          { name: "B2", zone_type: "standard", base_price: 98, is_available: true },
          { name: "B3", zone_type: "standard", base_price: 98, is_available: false },
          { name: "B4", zone_type: "standard", base_price: 98, is_available: true },
          { name: "B5", zone_type: "standard", base_price: 98, is_available: true },
          { name: "B6", zone_type: "standard", base_price: 98, is_available: false },
          { name: "B7", zone_type: "standard", base_price: 98, is_available: true },
          { name: "B8", zone_type: "standard", base_price: 98, is_available: true },
          { name: "C1", zone_type: "economy", base_price: 72, is_available: true },
          { name: "C2", zone_type: "economy", base_price: 72, is_available: true },
          { name: "C3", zone_type: "economy", base_price: 72, is_available: false },
          { name: "C4", zone_type: "economy", base_price: 72, is_available: true },
          { name: "C5", zone_type: "economy", base_price: 72, is_available: true },
          { name: "C6", zone_type: "economy", base_price: 72, is_available: false },
          { name: "C7", zone_type: "economy", base_price: 72, is_available: true },
          { name: "C8", zone_type: "economy", base_price: 72, is_available: true },
        ]
      },
      {
        level: 2,
        spaces: [
          { name: "A1", zone_type: "premium", base_price: 135, is_available: true },
          { name: "A2", zone_type: "premium", base_price: 135, is_available: true },
          { name: "A3", zone_type: "premium", base_price: 135, is_available: false },
          { name: "A4", zone_type: "premium", base_price: 135, is_available: true },
          { name: "A5", zone_type: "premium", base_price: 135, is_available: true },
          { name: "A6", zone_type: "premium", base_price: 135, is_available: false },
          { name: "A7", zone_type: "premium", base_price: 135, is_available: true },
          { name: "A8", zone_type: "premium", base_price: 135, is_available: true },
          { name: "B1", zone_type: "standard", base_price: 92, is_available: true },
          { name: "B2", zone_type: "standard", base_price: 92, is_available: false },
          { name: "B3", zone_type: "standard", base_price: 92, is_available: true },
          { name: "B4", zone_type: "standard", base_price: 92, is_available: true },
          { name: "B5", zone_type: "standard", base_price: 92, is_available: false },
          { name: "B6", zone_type: "standard", base_price: 92, is_available: true },
          { name: "B7", zone_type: "standard", base_price: 92, is_available: true },
          { name: "B8", zone_type: "standard", base_price: 92, is_available: false },
          { name: "C1", zone_type: "economy", base_price: 68, is_available: true },
          { name: "C2", zone_type: "economy", base_price: 68, is_available: true },
          { name: "C3", zone_type: "economy", base_price: 68, is_available: false },
          { name: "C4", zone_type: "economy", base_price: 68, is_available: true },
          { name: "C5", zone_type: "economy", base_price: 68, is_available: true },
          { name: "C6", zone_type: "economy", base_price: 68, is_available: false },
          { name: "C7", zone_type: "economy", base_price: 68, is_available: true },
          { name: "C8", zone_type: "economy", base_price: 68, is_available: true },
        ]
      }
    ]
  },
  {
    name: "Sambil Santo Domingo",
    address: "Av. John F. Kennedy, Santo Domingo",
    latitude: 18.4723,
    longitude: -69.9345,
    levels: [
      {
        level: 1,
        spaces: [
          { name: "P1", zone_type: "premium", base_price: 155, is_available: true },
          { name: "P2", zone_type: "premium", base_price: 155, is_available: false },
          { name: "P3", zone_type: "premium", base_price: 155, is_available: true },
          { name: "P4", zone_type: "premium", base_price: 155, is_available: true },
          { name: "P5", zone_type: "premium", base_price: 155, is_available: false },
          { name: "P6", zone_type: "premium", base_price: 155, is_available: true },
          { name: "P7", zone_type: "premium", base_price: 155, is_available: true },
          { name: "P8", zone_type: "premium", base_price: 155, is_available: false },
          { name: "P9", zone_type: "premium", base_price: 155, is_available: true },
          { name: "P10", zone_type: "premium", base_price: 155, is_available: true },
          { name: "S1", zone_type: "standard", base_price: 105, is_available: true },
          { name: "S2", zone_type: "standard", base_price: 105, is_available: true },
          { name: "S3", zone_type: "standard", base_price: 105, is_available: false },
          { name: "S4", zone_type: "standard", base_price: 105, is_available: true },
          { name: "S5", zone_type: "standard", base_price: 105, is_available: true },
          { name: "S6", zone_type: "standard", base_price: 105, is_available: false },
          { name: "S7", zone_type: "standard", base_price: 105, is_available: true },
          { name: "S8", zone_type: "standard", base_price: 105, is_available: true },
          { name: "S9", zone_type: "standard", base_price: 105, is_available: false },
          { name: "S10", zone_type: "standard", base_price: 105, is_available: true },
          { name: "E1", zone_type: "economy", base_price: 78, is_available: true },
          { name: "E2", zone_type: "economy", base_price: 78, is_available: true },
          { name: "E3", zone_type: "economy", base_price: 78, is_available: false },
          { name: "E4", zone_type: "economy", base_price: 78, is_available: true },
          { name: "E5", zone_type: "economy", base_price: 78, is_available: true },
          { name: "E6", zone_type: "economy", base_price: 78, is_available: false },
          { name: "E7", zone_type: "economy", base_price: 78, is_available: true },
          { name: "E8", zone_type: "economy", base_price: 78, is_available: true },
          { name: "E9", zone_type: "economy", base_price: 78, is_available: false },
          { name: "E10", zone_type: "economy", base_price: 78, is_available: true },
        ]
      },
      {
        level: 2,
        spaces: [
          { name: "P1", zone_type: "premium", base_price: 145, is_available: true },
          { name: "P2", zone_type: "premium", base_price: 145, is_available: true },
          { name: "P3", zone_type: "premium", base_price: 145, is_available: false },
          { name: "P4", zone_type: "premium", base_price: 145, is_available: true },
          { name: "P5", zone_type: "premium", base_price: 145, is_available: true },
          { name: "P6", zone_type: "premium", base_price: 145, is_available: false },
          { name: "P7", zone_type: "premium", base_price: 145, is_available: true },
          { name: "P8", zone_type: "premium", base_price: 145, is_available: true },
          { name: "P9", zone_type: "premium", base_price: 145, is_available: false },
          { name: "P10", zone_type: "premium", base_price: 145, is_available: true },
          { name: "S1", zone_type: "standard", base_price: 100, is_available: true },
          { name: "S2", zone_type: "standard", base_price: 100, is_available: false },
          { name: "S3", zone_type: "standard", base_price: 100, is_available: true },
          { name: "S4", zone_type: "standard", base_price: 100, is_available: true },
          { name: "S5", zone_type: "standard", base_price: 100, is_available: false },
          { name: "S6", zone_type: "standard", base_price: 100, is_available: true },
          { name: "S7", zone_type: "standard", base_price: 100, is_available: true },
          { name: "S8", zone_type: "standard", base_price: 100, is_available: false },
          { name: "S9", zone_type: "standard", base_price: 100, is_available: true },
          { name: "S10", zone_type: "standard", base_price: 100, is_available: true },
          { name: "E1", zone_type: "economy", base_price: 73, is_available: true },
          { name: "E2", zone_type: "economy", base_price: 73, is_available: false },
          { name: "E3", zone_type: "economy", base_price: 73, is_available: true },
          { name: "E4", zone_type: "economy", base_price: 73, is_available: true },
          { name: "E5", zone_type: "economy", base_price: 73, is_available: false },
          { name: "E6", zone_type: "economy", base_price: 73, is_available: true },
          { name: "E7", zone_type: "economy", base_price: 73, is_available: true },
          { name: "E8", zone_type: "economy", base_price: 73, is_available: false },
          { name: "E9", zone_type: "economy", base_price: 73, is_available: true },
          { name: "E10", zone_type: "economy", base_price: 73, is_available: true },
        ]
      }
    ]
  }
];

export async function seedDatabase() {
  const db = await getDb();
  
  console.log('🌱 Starting database seeding...');
  
  try {
    // Clear existing data
    await db.run('DELETE FROM parking_spaces');
    await db.run('DELETE FROM parking_lots');
    
    console.log('🗑️  Cleared existing data');
    
    for (const lotData of seedData) {
      // Insert lot
      const lotResult = await db.run(
        'INSERT INTO parking_lots (name, address, latitude, longitude, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
        [lotData.name, lotData.address, lotData.latitude, lotData.longitude, new Date().toISOString(), new Date().toISOString()]
      );
      
      const lotId = lotResult.lastID;
      console.log(`✅ Created lot: ${lotData.name} (ID: ${lotId})`);
      
      // Insert spaces for each level
      for (const levelData of lotData.levels) {
        for (const spaceData of levelData.spaces) {
          await db.run(
            'INSERT INTO parking_spaces (lot_id, name, level, is_available, base_price, zone_type, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [
              lotId,
              spaceData.name,
              levelData.level,
              spaceData.is_available ? 1 : 0,
              spaceData.base_price,
              spaceData.zone_type,
              new Date().toISOString(),
              new Date().toISOString()
            ]
          );
        }
        console.log(`  📍 Added ${levelData.spaces.length} spaces for Level ${levelData.level}`);
      }
    }
    
    console.log('🎉 Database seeding completed successfully!');
    console.log(`📊 Created ${seedData.length} lots with multiple levels and spaces`);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('✅ Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
} 