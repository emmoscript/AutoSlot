import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { getDb } from '../database';

const router = Router();

// Public routes
router.post('/register', async (req, res) => {
  const db = await getDb();
  const authController = new AuthController(db);
  authController.register(req, res);
});

router.post('/login', async (req, res) => {
  const db = await getDb();
  const authController = new AuthController(db);
  authController.login(req, res);
});

router.post('/logout', async (req, res) => {
  const db = await getDb();
  const authController = new AuthController(db);
  authController.logout(req, res);
});

// Protected routes - simplified without middleware for now
router.get('/me', async (req, res) => {
  const db = await getDb();
  const authController = new AuthController(db);
  authController.getCurrentUser(req, res);
});

router.put('/profile', async (req, res) => {
  const db = await getDb();
  const authController = new AuthController(db);
  authController.updateProfile(req, res);
});

// Admin routes
router.get('/users', async (req, res) => {
  const db = await getDb();
  const authController = new AuthController(db);
  authController.getAllUsers(req, res);
});

export default router; 