import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';

const router = Router();

// Ejemplo de ruta protegida para obtener usuarios
router.get('/', authMiddleware, (req, res) => {
    res.json({ mensaje: 'Lista de usuarios (Ruta protegida)' });
});

export default router;