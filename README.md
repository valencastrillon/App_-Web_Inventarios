# Logix Control - Documentación del Backend

## Descripción General
Logix Control es la API RESTful para un sistema SaaS de gestión e inventarios B2B. El sistema gestiona autenticación de usuarios mediante Supabase Auth (correo/contraseña y Google OAuth), control de acceso basado en roles (RBAC), catálogo de categorías y productos con alerta de stock mínimo, y trazabilidad completa de movimientos de inventario con actualización transaccional de stock.

---

## Arquitectura y Tecnologías
- **Entorno de ejecución:** Node.js
- **Framework Web:** Express.js
- **Base de Datos & Auth:** Supabase (PostgreSQL y Supabase Auth)
- **Gestión de variables de entorno:** Dotenv
- **Seguridad HTTP:** CORS
- **Estructura de arquitectura:** Modelo-Controlador-Ruta (MCR) modularizado

---

## Estructura del Proyecto

```text
backend/
├── src/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── categoriaController.js
│   │   ├── movimientoController.js
│   │   ├── productoController.js
│   │   └── userController.js
│   ├── middlewares/
│   │   ├── authMiddleware.js
│   │   └── roleMiddleware.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── categoriaRoutes.js
│   │   ├── movimientoRoutes.js
│   │   ├── productoRoutes.js
│   │   └── userRoutes.js
│   ├── supabaseClient.js
│   └── index.js
├── .env
├── .gitignore
├── package.json
└── README.md
```

---

## Variables de Entorno (.env)

El archivo `.env` debe ubicarse en la raíz de la carpeta `backend` y no debe ser subido al repositorio.

```env
PORT=4000
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=tu-anon-key
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
```

### Configuración del `.gitignore`
Asegura que el archivo `.gitignore` incluya las siguientes entradas para no exponer secretos ni archivos pesados:

```text
node_modules/
.env
.DS_Store
Thumbs.db
```

---

## Instalación y Ejecución Local

1. Instalar dependencias:
   ```bash
   pnpm install
   # o
   npm install
   ```

2. Iniciar el servidor en modo desarrollo:
   ```bash
   pnpm run dev
   # o
   npm run dev
   ```

El servidor estará escuchando por defecto en `http://localhost:4000`.

---

## Esquema de Base de Datos (PostgreSQL en Supabase)

- **roles:** `id`, `nombre` ('Administrador', 'Operario')
- **usuarios:** `id` (FK auth.users), `email`, `rol_id` (FK roles.id)
- **categorias:** `id`, `nombre`, `descripcion`, `created_at`
- **productos:** `id`, `nombre`, `sku`, `descripcion`, `precio`, `stock`, `stock_minimo`, `categoria_id` (FK categorias.id), `created_at`
- **movimientos_inventario:** `id`, `producto_id` (FK productos.id), `tipo` ('entrada' | 'salida'), `cantidad`, `motivo`, `usuario_id` (FK usuarios.id), `created_at`

---

## Middlewares de Seguridad

1. **`authMiddleware.js`**
   - Extrae el token JWT del encabezado `Authorization: Bearer <token>`.
   - Valida la autenticidad con `supabase.auth.getUser()`.
   - Inyecta la información del usuario autenticado en `req.user`.

2. **`roleMiddleware.js`**
   - Implementa Role-Based Access Control (RBAC).
   - Verifica que el usuario posea los permisos adecuados antes de ejecutar la acción del controlador.
   - Restringe operaciones críticas (ej. peticiones `DELETE`) a roles con permisos administrativos.

---

## Referencia de Endpoints API

### Healthcheck
- **GET** `/health`
  - Comprueba el estado del servidor Express y la conexión activa con la base de datos de Supabase.

### Autenticación (`/api/auth`)
- **POST** `/api/auth/register`
  - Registro de usuario con email y contraseña.
- **POST** `/api/auth/login`
  - Autenticación mediante credenciales. Retorna `access_token` e información del usuario.
- **GET** `/api/auth/google`
  - Genera la URL de autenticación para Google OAuth.

### Categorías (`/api/categorias`) - *Requiere Auth*
- **GET** `/api/categorias` - Obtener todas las categorías.
- **POST** `/api/categorias` - Crear una categoría.
- **PUT** `/api/categorias/:id` - Actualizar una categoría existente.
- **DELETE** `/api/categorias/:id` - Eliminar una categoría (Restringido por RBAC).

### Productos (`/api/productos`) - *Requiere Auth*
- **GET** `/api/productos` - Obtener lista de productos vinculados con su categoría y cálculo dinámico de alerta de stock mínimo.
- **POST** `/api/productos` - Registrar nuevo producto.
- **PUT** `/api/productos/:id` - Actualizar información del producto.
- **DELETE** `/api/productos/:id` - Eliminar un producto (Restringido por RBAC).

### Movimientos e Inventario (`/api/movimientos`) - *Requiere Auth*
- **GET** `/api/movimientos`
  - Obtener el historial completo de entradas y salidas de almacén con detalle del producto y usuario responsable.
- **POST** `/api/movimientos`
  - Registrar entrada o salida.
  - Valida que en salidas existan existencias suficientes (`stock >= cantidad`).
  - Actualiza automáticamente el stock en la tabla `productos`.
  - Registra el `usuario_id` para trazabilidad y auditoría.
