import express from 'express';
import authRoutes from './authRoutes';
import parkingLotRoutes from './parkingLotRoutes';
import parkingSpaceRoutes from './parkingSpaceRoutes';
import reservationRoutes from './reservationRoutes';
import sensorRoutes from './sensorRoutes';
import quickReserveRoutes from './quickReserveRoutes';
import bcrypt from 'bcryptjs';
import { getDb } from '../database';
import { seedDatabaseWithDb } from '../seedData';

const router = express.Router();

// Health check endpoint for Render
router.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'AutoSlot Backend API is running',
    timestamp: new Date().toISOString()
  });
});

// Temporary setup endpoint to configure admin user
router.post('/setup-admin', async (req, res) => {
  try {
    const db = await getDb();
    
    console.log('🔧 Setting up admin user...');
    
    // Generate password hash for 'admin123'
    const password = 'admin123';
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    console.log('🔐 Generated password hash for admin123');
    
    // Check if admin user exists
    db.get("SELECT id FROM users WHERE email = 'admin@autoslot.com'", async (err, row) => {
      if (err) {
        console.error('❌ Error checking admin user:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (row) {
        // Update existing admin user
        db.run(
          "UPDATE users SET password_hash = ?, role = 'admin', is_active = 1 WHERE email = 'admin@autoslot.com'",
          [passwordHash],
          function(err) {
            if (err) {
              console.error('❌ Error updating admin user:', err);
              return res.status(500).json({ error: 'Failed to update admin user' });
            } else {
              console.log('✅ Admin user updated successfully!');
              res.json({ 
                success: true, 
                message: 'Admin user updated successfully!',
                credentials: {
                  email: 'admin@autoslot.com',
                  password: 'admin123'
                }
              });
            }
          }
        );
      } else {
        // Create new admin user
        db.run(
          "INSERT INTO users (name, email, password_hash, role, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
          [
            'Admin User',
            'admin@autoslot.com',
            passwordHash,
            'admin',
            1,
            new Date().toISOString(),
            new Date().toISOString()
          ],
          function(err) {
            if (err) {
              console.error('❌ Error creating admin user:', err);
              return res.status(500).json({ error: 'Failed to create admin user' });
            } else {
              console.log('✅ Admin user created successfully!');
              res.json({ 
                success: true, 
                message: 'Admin user created successfully!',
                credentials: {
                  email: 'admin@autoslot.com',
                  password: 'admin123'
                }
              });
            }
          }
        );
      }
    });
    
  } catch (error) {
    console.error('❌ Error in setup:', error);
    res.status(500).json({ error: 'Setup failed' });
  }
});

// Temporary seeding endpoint to populate database
router.post('/seed-database', async (req, res) => {
  try {
    console.log('🌱 Starting database seeding...');
    const db = await getDb();
    await seedDatabaseWithDb(db);
    console.log('✅ Database seeding completed!');
    res.json({ 
      success: true, 
      message: 'Database seeded successfully with parking lots and spaces!'
    });
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    res.status(500).json({ error: 'Database seeding failed' });
  }
});

// Database status check endpoint
router.get('/db-status', async (req, res) => {
  try {
    const db = await getDb();
    
    // Check admin user
    const adminUser = await new Promise<any>((resolve, reject) => {
      db.get("SELECT id, email, role, is_active FROM users WHERE email = 'admin@autoslot.com'", (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
    
    // Check parking lots count
    const lotsCount = await new Promise<number>((resolve, reject) => {
      db.get("SELECT COUNT(*) as count FROM parking_lots", (err, row: any) => {
        if (err) reject(err);
        else resolve(row?.count || 0);
      });
    });
    
    // Check parking spaces count
    const spacesCount = await new Promise<number>((resolve, reject) => {
      db.get("SELECT COUNT(*) as count FROM parking_spaces", (err, row: any) => {
        if (err) reject(err);
        else resolve(row?.count || 0);
      });
    });
    
    res.json({
      success: true,
      database_status: {
        admin_user: adminUser ? {
          exists: true,
          role: adminUser.role,
          is_active: adminUser.is_active === 1
        } : { exists: false },
        parking_lots: lotsCount,
        parking_spaces: spacesCount,
        seeded: lotsCount > 0 && spacesCount > 0
      },
      admin_credentials: {
        email: 'admin@autoslot.com',
        password: 'admin123'
      }
    });
  } catch (error) {
    console.error('❌ Error checking database status:', error);
    res.status(500).json({ error: 'Failed to check database status' });
  }
});

// API routes
router.use('/auth', authRoutes);
router.use('/parking-lots', parkingLotRoutes);
router.use('/parking-spaces', parkingSpaceRoutes);
router.use('/reservations', reservationRoutes);
router.use('/sensors', sensorRoutes);
router.use('/lots', quickReserveRoutes);

export default router; 