import { Router } from 'express';
import { login, loginWithGoogle } from '../controllers/authController.js';

const router = Router();

// Definición de endpoints
router.post('/login', login);
router.get('/google', loginWithGoogle);

export default router;