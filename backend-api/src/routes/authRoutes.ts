import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { Database } from 'sqlite3';
import { createAuthMiddleware } from '../middleware/auth';

export default function createAuthRoutes(db: Database): Router {
  const router = Router();
  const authController = new AuthController(db);
  const authenticateToken = createAuthMiddleware(db);

  // Public routes
  router.post('/register', (req, res) => authController.register(req, res));
  router.post('/login', (req, res) => authController.login(req, res));
  router.post('/logout', (req, res) => authController.logout(req, res));

  // Protected routes
  router.get('/me', authenticateToken, (req, res) => authController.getCurrentUser(req, res));
  router.put('/profile', authenticateToken, (req, res) => authController.updateProfile(req, res));
  
  // Admin routes
  router.get('/users', authenticateToken, (req, res) => authController.getAllUsers(req, res));

  return router;
} 