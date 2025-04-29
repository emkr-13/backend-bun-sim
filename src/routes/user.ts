import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware';
import { editUser, getProfile } from '../controllers/userController';

const router = Router();

// Rute untuk mendapatkan profil user
router.get('/detail', authenticate, getProfile);

// Rute untuk mengedit user
router.post('/edit', authenticate, editUser);

export default router;