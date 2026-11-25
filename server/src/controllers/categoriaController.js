import { supabase } from '../supabaseClient.js';

// Obtener todas las categorías
export const getCategorias = async (req, res) => {
    try {
        const { data, error } = await supabase.from('categorias').select('*');
        if (error) return res.status(400).json({ error: error.message });
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener categorías', details: err.message });
    }
};

// Crear categoría
export const createCategoria = async (req, res) => {
    const { nombre, descripcion } = req.body;
    try {
        const { data, error } = await supabase
            .from('categorias')
            .insert([{ nombre, descripcion }])
            .select();
        if (error) return res.status(400).json({ error: error.message });
        res.status(201).json({ mensaje: 'Categoría creada con éxito', categoria: data[0] });
    } catch (err) {
        res.status(500).json({ error: 'Error al crear categoría', details: err.message });
    }
};

// Actualizar categoría
export const updateCategoria = async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;
    try {
        const { data, error } = await supabase
            .from('categorias')
            .update({ nombre, descripcion })
            .eq('id', id)
            .select();
        if (error) return res.status(400).json({ error: error.message });
        res.status(200).json({ mensaje: 'Categoría actualizada', categoria: data[0] });
    } catch (err) {
        res.status(500).json({ error: 'Error al actualizar categoría', details: err.message });
    }
};

// Eliminar categoría
export const deleteCategoria = async (req, res) => {
    const { id } = req.params;
    try {
        const { error } = await supabase.from('categorias').delete().eq('id', id);
        if (error) return res.status(400).json({ error: error.message });
        res.status(200).json({ mensaje: 'Categoría eliminada con éxito' });
    } catch (err) {
        res.status(500).json({ error: 'Error al eliminar categoría', details: err.message });
    }
};