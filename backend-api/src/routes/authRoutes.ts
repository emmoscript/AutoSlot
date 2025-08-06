import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { Database } from 'sqlite3';

export default function createAuthRoutes(db: Database): Router {
  const router = Router();
  const authController = new AuthController(db);

  // Public routes
  router.post('/register', (req, res) => {
    authController.register(req, res);
  });
  
  router.post('/login', (req, res) => {
    authController.login(req, res);
  });
  
  router.post('/logout', (req, res) => {
    authController.logout(req, res);
  });

  // Protected routes - simplified without middleware for now
  router.get('/me', (req, res) => {
    authController.getCurrentUser(req, res);
  });
  
  router.put('/profile', (req, res) => {
    authController.updateProfile(req, res);
  });
  
  // Admin routes
  router.get('/users', (req, res) => {
    authController.getAllUsers(req, res);
  });

  return router;
} 