import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { supabase } from './supabaseClient.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware para procesar JSON en las peticiones
app.use(express.json());

// Endpoint de prueba / Healthcheck (con verificación de conexión a Supabase)
app.get('/health', async (req, res) => {
  try {
    const { data, error } = await supabase.from('roles').select('*');
    
    if (error) {
      return res.status(500).json({ 
        status: 'Error', 
        message: 'Error al conectar con Supabase', 
        details: error.message 
      });
    }

    res.json({ 
      status: 'OK', 
      message: 'Servidor y Supabase conectados correctamente', 
      roles: data 
    });
  } catch (err) {
    res.status(500).json({ status: 'Error', message: 'Error en el servidor', details: err.message });
  }
});

// Registrar las rutas del Módulo 2 (Autenticación y Usuarios)
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});