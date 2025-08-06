import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { Database } from 'sqlite3';
import { LoginRequest, RegisterRequest } from '../types';

export class AuthController {
  private authService: AuthService;

  constructor(db: Database) {
    this.authService = new AuthService(db);
  }

  // POST /auth/register
  async register(req: Request, res: Response): Promise<void> {
    try {
      const userData: RegisterRequest = req.body;

      // Validate required fields
      if (!userData.name || !userData.email || !userData.password) {
        res.status(400).json({
          success: false,
          message: 'Name, email and password are required'
        });
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.email)) {
        res.status(400).json({
          success: false,
          message: 'Invalid email format'
        });
        return;
      }

      // Validate password length
      if (userData.password.length < 6) {
        res.status(400).json({
          success: false,
          message: 'Password must be at least 6 characters long'
        });
        return;
      }

      const result = await this.authService.register(userData);
      res.status(201).json(result);
    } catch (error) {
      console.error('Registration error:', error);
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Registration failed'
      });
    }
  }

  // POST /auth/login
  async login(req: Request, res: Response): Promise<void> {
    try {
      const credentials: LoginRequest = req.body;

      // Validate required fields
      if (!credentials.email || !credentials.password) {
        res.status(400).json({
          success: false,
          message: 'Email and password are required'
        });
        return;
      }

      const result = await this.authService.login(credentials);
      res.json(result);
    } catch (error) {
      console.error('Login error:', error);
      res.status(401).json({
        success: false,
        message: error instanceof Error ? error.message : 'Invalid credentials'
      });
    }
  }

  // GET /auth/me
  async getCurrentUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.userId;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      const user = await this.authService.getUserById(userId);
      
      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      res.json({
        success: true,
        user
      });
    } catch (error) {
      console.error('Get current user error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get user information'
      });
    }
  }

  // GET /auth/users (admin only)
  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const userRole = (req as any).user?.role;
      
      if (userRole !== 'admin') {
        res.status(403).json({
          success: false,
          message: 'Admin access required'
        });
        return;
      }

      const users = await this.authService.getAllUsers();
      res.json({
        success: true,
        users
      });
    } catch (error) {
      console.error('Get all users error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get users'
      });
    }
  }

  // PUT /auth/profile
  async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.userId;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      const updates = req.body;
      const allowedFields = ['name', 'vehicle_plate', 'phone'];
      const filteredUpdates: any = {};

      // Only allow specific fields to be updated
      for (const field of allowedFields) {
        if (updates[field] !== undefined) {
          filteredUpdates[field] = updates[field];
        }
      }

      const updatedUser = await this.authService.updateUser(userId, filteredUpdates);
      
      if (!updatedUser) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      res.json({
        success: true,
        user: updatedUser
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update profile'
      });
    }
  }

  // POST /auth/logout
  async logout(req: Request, res: Response): Promise<void> {
    // Since we're using JWT, logout is handled client-side by removing the token
    // This endpoint is for consistency and future server-side token blacklisting
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  }
} 