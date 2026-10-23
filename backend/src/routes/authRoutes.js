import { Router } from 'express';
import { supabase } from '../supabaseClient.js';

const router = Router();

// Registro de usuario
router.post('/register', async (req, res) => {
  const { email, password, nombre, rol_id } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son requeridos.' });
  }

  // 1. Crear el usuario en Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    return res.status(400).json({ error: authError.message });
  }

  // 2. Guardar datos complementarios o asignación de rol en la tabla de usuarios
  if (authData.user) {
    const { error: dbError } = await supabase
      .from('usuarios')
      .insert([
        {
          id: authData.user.id,
          nombre: nombre || 'Usuario',
          email,
          rol_id: rol_id || 2, // 2 = Operario por defecto
        },
      ]);

    if (dbError) {
      return res.status(500).json({ error: 'Usuario creado en Auth, pero falló el registro en la base de datos.' });
    }
  }

  return res.status(201).json({
    message: 'Usuario registrado exitosamente.',
    user: authData.user,
  });
});

// Inicio de sesión
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son requeridos.' });
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return res.status(401).json({ error: 'Credenciales inválidas.' });
  }

  return res.status(200).json({
    message: 'Inicio de sesión exitoso.',
    session: data.session, // Contiene el access_token (JWT)
    user: data.user,
  });
});

export default router;