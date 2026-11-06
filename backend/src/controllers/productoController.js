import { supabase } from '../supabaseClient.js';

// Obtener todos los productos vinculados con su categoría
export const getProductos = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('productos')
            .select(`
        *,
        categorias ( id, nombre )
      `);
        if (error) return res.status(400).json({ error: error.message });

        // Agregamos un indicador dinámico si está bajo de stock
        const productosConAlerta = data.map(prod => ({
            ...prod,
            alertaStockBajo: prod.stock <= prod.minStock
        }));

        res.status(200).json(productosConAlerta);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener productos', details: err.message });
    }
};

// Crear producto
export const createProducto = async (req, res) => {
    const { nombre, sku, categoria_id, stock, minStock, precio, costo } = req.body;
    try {
        const { data, error } = await supabase
            .from('productos')
            .insert([{ nombre, sku, categoria_id, stock, minStock, precio, costo }])
            .select();
        if (error) return res.status(400).json({ error: error.message });
        res.status(201).json({ mensaje: 'Producto creado', producto: data[0] });
    } catch (err) {
        res.status(500).json({ error: 'Error al crear producto', details: err.message });
    }
};

// Actualizar producto
export const updateProducto = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    try {
        const { data, error } = await supabase
            .from('productos')
            .update(updates)
            .eq('id', id)
            .select();
        if (error) return res.status(400).json({ error: error.message });
        res.status(200).json({ mensaje: 'Producto actualizado', producto: data[0] });
    } catch (err) {
        res.status(500).json({ error: 'Error al actualizar producto', details: err.message });
    }
};

// Eliminar producto
export const deleteProducto = async (req, res) => {
    const { id } = req.params;
    try {
        const { error } = await supabase.from('productos').delete().eq('id', id);
        if (error) return res.status(400).json({ error: error.message });
        res.status(200).json({ mensaje: 'Producto eliminado' });
    } catch (err) {
        res.status(500).json({ error: 'Error al eliminar producto', details: err.message });
    }
};