import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Database, RunResult } from 'sqlite3';
import { User, LoginRequest, RegisterRequest, AuthResponse, JwtPayload } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'autoslot-secret-key-2024';
const JWT_EXPIRES_IN = '7d';

export class AuthService {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    return new Promise((resolve, reject) => {
      // Check if user already exists
      this.db.get(
        'SELECT id FROM users WHERE email = ?',
        [userData.email],
        async (err, existingUser) => {
          if (err) {
            reject(err);
            return;
          }

          if (existingUser) {
            reject(new Error('User already exists with this email'));
            return;
          }

          try {
            // Hash password
            const saltRounds = 10;
            const passwordHash = await bcrypt.hash(userData.password, saltRounds);

            // Insert new user
            const db = this.db; // Store reference outside callback
            db.run(
              `INSERT INTO users (name, email, password_hash, vehicle_plate, vehicle_brand, vehicle_model, vehicle_color, phone, role) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'user')`,
              [userData.name, userData.email, passwordHash, userData.vehicle_plate, userData.vehicle_brand, userData.vehicle_model, userData.vehicle_color, userData.phone],
              function(err: any) {
                if (err) {
                  reject(err);
                  return;
                }

                const lastID = this.lastID; // Now this refers to the db run result
                
                // Get the created user
                db.get(
                  'SELECT * FROM users WHERE id = ?',
                  [lastID],
                  (err: any, user: any) => {
                    if (err) {
                      reject(err);
                      return;
                    }

                    if (!user) {
                      reject(new Error('Failed to retrieve created user'));
                      return;
                    }

                    // Generate JWT token
                    const token = jwt.sign(
                      { userId: user.id, email: user.email, role: user.role },
                      JWT_SECRET,
                      { expiresIn: JWT_EXPIRES_IN }
                    );

                    // Remove password_hash from response
                    const { password_hash, ...userWithoutPassword } = user;

                    resolve({
                      success: true,
                      user: userWithoutPassword as User,
                      token
                    });
                  }
                );
              }
            );
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    return new Promise((resolve, reject) => {
      console.log(`🔍 Login attempt for: ${credentials.email}`);
      this.db.get(
        'SELECT * FROM users WHERE email = ? AND is_active = 1',
        [credentials.email],
        async (err, user: any) => {
          if (err) {
            console.log(`❌ Database error: ${err}`);
            reject(err);
            return;
          }

          if (!user) {
            console.log(`❌ User not found: ${credentials.email}`);
            reject(new Error('Invalid credentials'));
            return;
          }

          console.log(`✅ User found: ${user.email}, checking password...`);

          try {
            // Verify password
            console.log(`🔐 Comparing password for ${user.email}`);
            const isValidPassword = await bcrypt.compare(credentials.password, user.password_hash);
            console.log(`🔐 Password comparison result: ${isValidPassword}`);
            
            if (!isValidPassword) {
              console.log(`❌ Invalid password for: ${credentials.email}`);
              reject(new Error('Invalid credentials'));
              return;
            }

            console.log(`✅ Login successful for: ${credentials.email}`);

            // Generate JWT token
            const token = jwt.sign(
              { userId: user.id, email: user.email, role: user.role },
              JWT_SECRET,
              { expiresIn: JWT_EXPIRES_IN }
            );

            // Remove password_hash from response
            const { password_hash, ...userWithoutPassword } = user;

            resolve({
              success: true,
              user: userWithoutPassword as User,
              token
            });
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  }

  async getUserById(userId: number): Promise<User | null> {
    return new Promise((resolve, reject) => {
      this.db.get(
        'SELECT id, name, email, vehicle_plate, vehicle_brand, vehicle_model, vehicle_color, phone, role, is_active, created_at, updated_at FROM users WHERE id = ? AND is_active = 1',
        [userId],
        (err, user) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(user as User || null);
        }
      );
    });
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return new Promise((resolve, reject) => {
      this.db.get(
        'SELECT id, name, email, vehicle_plate, vehicle_brand, vehicle_model, vehicle_color, phone, role, is_active, created_at, updated_at FROM users WHERE email = ? AND is_active = 1',
        [email],
        (err, user) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(user as User || null);
        }
      );
    });
  }

  verifyToken(token: string): JwtPayload | null {
    try {
      return jwt.verify(token, JWT_SECRET) as JwtPayload;
    } catch (error) {
      return null;
    }
  }

  async getAllUsers(): Promise<User[]> {
    return new Promise((resolve, reject) => {
      this.db.all(
        'SELECT id, name, email, vehicle_plate, vehicle_brand, vehicle_model, vehicle_color, phone, role, is_active, created_at, updated_at FROM users WHERE is_active = 1 ORDER BY created_at DESC',
        (err, users) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(users as User[]);
        }
      );
    });
  }

  async updateUser(userId: number, updates: Partial<User>): Promise<User | null> {
    return new Promise((resolve, reject) => {
      const updateFields = [];
      const values = [];

      if (updates.name) {
        updateFields.push('name = ?');
        values.push(updates.name);
      }
      if (updates.vehicle_plate !== undefined) {
        updateFields.push('vehicle_plate = ?');
        values.push(updates.vehicle_plate);
      }
      if (updates.vehicle_brand !== undefined) {
        updateFields.push('vehicle_brand = ?');
        values.push(updates.vehicle_brand);
      }
      if (updates.vehicle_model !== undefined) {
        updateFields.push('vehicle_model = ?');
        values.push(updates.vehicle_model);
      }
      if (updates.vehicle_color !== undefined) {
        updateFields.push('vehicle_color = ?');
        values.push(updates.vehicle_color);
      }
      if (updates.phone !== undefined) {
        updateFields.push('phone = ?');
        values.push(updates.phone);
      }

      if (updateFields.length === 0) {
        resolve(null);
        return;
      }

      values.push(userId);

      this.db.run(
        `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
        values,
        function(this: any, err: any) {
          if (err) {
            reject(err);
            return;
          }

          if (this.changes === 0) {
            resolve(null);
            return;
          }

          // Get updated user using the class db instance
          this.db.get(
            'SELECT id, name, email, vehicle_plate, vehicle_brand, vehicle_model, vehicle_color, phone, role, is_active, created_at, updated_at FROM users WHERE id = ?',
            [userId],
            (err: any, user: any) => {
              if (err) {
                reject(err);
                return;
              }
              resolve(user as User);
            }
          );
        }.bind({ db: this.db })
      );
    });
  }
} 