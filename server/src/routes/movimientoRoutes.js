import { Router } from 'express';
import { crearMovimiento, getMovimientos } from '../controllers/movimientoController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/', authMiddleware, getMovimientos);
router.post('/', authMiddleware, crearMovimiento);

export default router;