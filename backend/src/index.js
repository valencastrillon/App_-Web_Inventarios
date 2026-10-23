import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { supabase } from './supabaseClient.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares esenciales
app.use(cors());
app.use(express.json());

// Ruta de prueba (Healthcheck) y verificación de Supabase
app.get('/api/healthcheck', async (req, res) => {
  try {
    // Intentamos consultar la tabla 'roles' para comprobar la conexión a la BD
    const { data, error } = await supabase.from('roles').select('*');
    
    if (error) throw error;

    res.json({ 
      status: 'OK', 
      message: 'El backend y la conexión con Supabase funcionan',
      rolesEnBaseDeDatos: data 
    });
  } catch (error) {
    res.status(500).json({ status: 'ERROR', message: error.message });
  }
});

// Levantar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});