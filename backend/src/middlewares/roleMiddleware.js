export const checkRole = (rolesPermitidos) => {
    return (req, res, next) => {
        // 1. Verificamos que la información del usuario exista en la petición
        if (!req.user || !req.user.rol_id) {
            return res.status(401).json({
                error: "Acceso no autorizado. Información de usuario no encontrada."
            });
        }

        // 2. Comprobamos si el rol del usuario está dentro de los roles permitidos para esta ruta
        const tienePermiso = rolesPermitidos.includes(req.user.rol_id);

        if (!tienePermiso) {
            return res.status(403).json({
                error: "Acceso denegado. No tienes permisos para realizar esta acción."
            });
        }

        // 3. Si tiene permiso, continuamos a la siguiente función o controlador
        next();
    };
};