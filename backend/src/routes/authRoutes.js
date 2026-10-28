import { Router } from 'express';

const router = Router();

// Ruta de ejemplo para login
router.post('/login', (req, res) => {
    res.json({ mensaje: 'Endpoint de inicio de sesión' });
});

// Ruta de ejemplo para registro
router.post('/register', (req, res) => {
    res.json({ mensaje: 'Endpoint de registro de usuario' });
});

export default router;