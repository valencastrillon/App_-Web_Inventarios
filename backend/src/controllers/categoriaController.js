import { supabase } from '../supabaseClient.js';

// 1. Obtener todas las categorías
export const obtenerCategorias = async (req, res) => {
    try {
        const { data, error } = await supabase.from('categorias').select('*');

        if (error) throw error;
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// 2. Crear una nueva categoría
export const crearCategoria = async (req, res) => {
    try {
        const { nombre, descripcion } = req.body;

        const { data, error } = await supabase
            .from('categorias')
            .insert([{ nombre, descripcion }])
            .select();

        if (error) throw error;
        return res.status(201).json({ mensaje: 'Categoría creada con éxito', categoria: data[0] });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// 3. Actualizar una categoría
export const actualizarCategoria = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion } = req.body;

        const { data, error } = await supabase
            .from('categorias')
            .update({ nombre, descripcion })
            .eq('id', id)
            .select();

        if (error) throw error;
        return res.status(200).json({ mensaje: 'Categoría actualizada', categoria: data[0] });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// 4. Eliminar una categoría
export const eliminarCategoria = async (req, res) => {
    try {
        const { id } = req.params;

        const { error } = await supabase
            .from('categorias')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return res.status(200).json({ mensaje: 'Categoría eliminada correctamente' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};