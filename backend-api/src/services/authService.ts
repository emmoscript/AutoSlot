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
            this.db.run(
              `INSERT INTO users (name, email, password_hash, vehicle_plate, phone, role) 
               VALUES (?, ?, ?, ?, ?, 'user')`,
              [userData.name, userData.email, passwordHash, userData.vehicle_plate, userData.phone],
              function(err) {
                if (err) {
                  reject(err);
                  return;
                }

                // Get the created user using the class db instance
                this.db.get(
                  'SELECT * FROM users WHERE id = ?',
                  [this.lastID],
                  (err, user) => {
                    if (err) {
                      reject(err);
                      return;
                    }

                    // Generate JWT token
                    const token = jwt.sign(
                      { userId: user.id, email: user.email, role: user.role },
                      JWT_SECRET,
                      { expiresIn: JWT_EXPIRES_IN }
                    );

                    resolve({
                      success: true,
                      user: user as User,
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
      this.db.get(
        'SELECT * FROM users WHERE email = ? AND is_active = 1',
        [credentials.email],
        async (err, user: any) => {
          if (err) {
            reject(err);
            return;
          }

          if (!user) {
            reject(new Error('Invalid credentials'));
            return;
          }

          try {
            // Verify password
            const isValidPassword = await bcrypt.compare(credentials.password, user.password_hash);
            
            if (!isValidPassword) {
              reject(new Error('Invalid credentials'));
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
        'SELECT id, name, email, vehicle_plate, phone, role, is_active, created_at, updated_at FROM users WHERE id = ? AND is_active = 1',
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
        'SELECT id, name, email, vehicle_plate, phone, role, is_active, created_at, updated_at FROM users WHERE email = ? AND is_active = 1',
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
        'SELECT id, name, email, vehicle_plate, phone, role, is_active, created_at, updated_at FROM users WHERE is_active = 1 ORDER BY created_at DESC',
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
        function(err) {
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
            'SELECT id, name, email, vehicle_plate, phone, role, is_active, created_at, updated_at FROM users WHERE id = ?',
            [userId],
            (err, user) => {
              if (err) {
                reject(err);
                return;
              }
              resolve(user as User);
            }
          );
        }
      );
    });
  }
} 