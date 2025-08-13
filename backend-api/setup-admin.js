const bcrypt = require('bcryptjs');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

async function setupAdmin() {
  const dbPath = path.join(__dirname, 'autoslot.db');
  const db = new sqlite3.Database(dbPath);

  try {
    console.log('🔧 Setting up admin user...');
    
    // Generate password hash for 'admin123'
    const password = 'admin123';
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    console.log('🔐 Generated password hash for admin123');
    
    // Check if admin user exists
    db.get("SELECT id FROM users WHERE email = 'admin@autoslot.com'", (err, row) => {
      if (err) {
        console.error('❌ Error checking admin user:', err);
        return;
      }
      
      if (row) {
        // Update existing admin user
        db.run(
          "UPDATE users SET password_hash = ?, role = 'admin', is_active = 1 WHERE email = 'admin@autoslot.com'",
          [passwordHash],
          function(err) {
            if (err) {
              console.error('❌ Error updating admin user:', err);
            } else {
              console.log('✅ Admin user updated successfully!');
              console.log('📧 Email: admin@autoslot.com');
              console.log('🔑 Password: admin123');
            }
            db.close();
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
            } else {
              console.log('✅ Admin user created successfully!');
              console.log('📧 Email: admin@autoslot.com');
              console.log('🔑 Password: admin123');
            }
            db.close();
          }
        );
      }
    });
    
  } catch (error) {
    console.error('❌ Error in setup:', error);
    db.close();
  }
}

setupAdmin();
