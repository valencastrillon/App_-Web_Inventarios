import { supabase } from '../supabaseClient.js';

// Lógica para iniciar sesión con correo y contraseña
export const login = async (req, res) => {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({
        mensaje: "Inicio de sesión exitoso",
        token: data.session.access_token,
        user: data.user
    });
};

// Lógica para iniciar sesión con Google
export const loginWithGoogle = async (req, res) => {
    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: 'http://localhost:8000/'
            }
        });

        if (error) return res.status(400).json({ error: error.message });
        res.status(200).json({ url: data.url });
    } catch (err) {
        res.status(500).json({ error: 'Error en autenticación con Google', details: err.message });
    }
};