import { Router } from 'express';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { checkRole } from '../middlewares/roleMiddleware.js';

const router = Router();

// Ruta accesible por cualquier usuario autenticado (Admin u Operario)
router.get('/profile', verifyToken, (req, res) => {
  res.json({
    message: 'Perfil de usuario obtenido con éxito.',
    user: req.user
  });
});

// Ruta EXCLUSIVA para Administradores (rol_id: 1)
router.get('/admin-dashboard', verifyToken, checkRole([1]), (req, res) => {
  res.json({
    message: 'Bienvenido al panel de administración general de inventarios.'
  });
});

export default router;