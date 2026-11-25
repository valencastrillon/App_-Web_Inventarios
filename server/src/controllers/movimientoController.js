import { supabase } from '../supabaseClient.js';

// Registrar un movimiento de inventario (Entrada o Salida)
export const crearMovimiento = async (req, res) => {
    const { producto_id, tipo, cantidad, motivo } = req.body;

    // Si estás usando middleware de autenticación, el ID del usuario viene de req.user.id
    // Si no, puedes enviarlo temporalmente en el body mientras se conecta el front.
    const usuario_id = req.user?.id || req.body.usuario_id;

    if (!producto_id || !tipo || !cantidad || !usuario_id) {
        return res.status(400).json({ error: 'Faltan datos obligatorios (producto_id, tipo, cantidad, usuario_id)' });
    }

    if (tipo !== 'entrada' && tipo !== 'salida') {
        return res.status(400).json({ error: 'El tipo de movimiento debe ser "entrada" o "salida"' });
    }

    try {
        // 1. Obtener el producto actual para verificar su stock
        const { data: producto, error: errorProducto } = await supabase
            .from('productos')
            .select('stock')
            .eq('id', producto_id)
            .single();

        if (errorProducto || !producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        let nuevoStock;
        if (tipo === 'entrada') {
            nuevoStock = producto.stock + Number(cantidad);
        } else {
            // Validar que no quede stock negativo en salidas
            if (producto.stock < cantidad) {
                return res.status(400).json({
                    error: 'Stock insuficiente para realizar la salida',
                    stockActual: producto.stock
                });
            }
            nuevoStock = producto.stock - Number(cantidad);
        }

        // 2. Registrar el movimiento en la tabla movimientos_inventario
        const { data: movimiento, error: errorMovimiento } = await supabase
            .from('movimientos_inventario')
            .insert([{
                producto_id,
                tipo,
                cantidad: Number(cantidad),
                usuario_id,
                motivo
            }])
            .select();

        if (errorMovimiento) {
            return res.status(400).json({ error: errorMovimiento.message });
        }

        // 3. Actualizar el stock del producto de forma automática
        const { error: errorUpdate } = await supabase
            .from('productos')
            .update({ stock: nuevoStock })
            .eq('id', producto_id);

        if (errorUpdate) {
            return res.status(400).json({ error: 'Error al actualizar el stock del producto: ' + errorUpdate.message });
        }

        res.status(201).json({
            mensaje: `Movimiento de ${tipo} registrado con éxito`,
            movimiento: movimiento[0],
            stockActualizado: nuevoStock
        });

    } catch (err) {
        res.status(500).json({ error: 'Error en el servidor al procesar el movimiento', details: err.message });
    }
};

// Obtener el historial de movimientos
export const getMovimientos = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('movimientos_inventario')
            .select(`
        *,
        productos ( id, nombre, sku ),
        usuarios ( id, email )
      `)
            .order('created_at', { ascending: false });

        if (error) return res.status(400).json({ error: error.message });
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener los movimientos', details: err.message });
    }
};
