# Documentación Integral — Logic Control (Consola Multi-Empresa de Inventarios)

> **Última actualización:** 12 de Noviembre de 2026  
> **Stack:** HTML5 Semántico + CSS3 Modular + Vanilla JavaScript (ES Modules nativos, Zero-Dependency)  
> **Puntos de entrada:** `index.html` (App Operativa de Inventarios) y `admin.html` (Consola Multi-Empresa)

---

## 1. Visión General y Ejecución

**Logic Control** es una plataforma web modular diseñada para el control operativo de inventarios multi-sucursal y la administración corporativa multi-empresa (*Tenants*). Funciona directamente sobre el navegador utilizando módulos ES nativos sin requerir Node.js, npm ni procesos de empaquetado (Webpack/Vite) para ejecutarse.

### Ejecución Local
Al utilizar ES Modules nativos, debe servirse mediante cualquier servidor HTTP estático desde la raíz del proyecto:

```bash
python3 -m http.server 8000
```

* **Aplicación Principal (Operativa):** `http://localhost:8000/index.html`
* **Consola de Administración Multi-Empresa:** `http://localhost:8000/admin.html`

### Validación de Código (Sintaxis JS)
```bash
node --check src/core/config.js src/core/store.js src/services/apiClient.js src/services/supabaseClient.js src/services/apiRepository.js src/services/inventoryService.js src/services/authService.js src/components/Header.js src/components/Sidebar.js src/views/DashboardView.js src/views/SettingsView.js src/main.js src/admin/admin.js
```

---

## 2. Estructura Completa del Proyecto

```text
App_-Web_Inventarios/
├── .env                                 # Variables de entorno públicas (API local y Supabase)
├── .env.example                         # Plantilla de ejemplo para variables de entorno
├── index.html                           # Punto de entrada de la App de Inventarios
├── admin.html                           # Punto de entrada de la Consola Multi-Empresa
├── README.md                            # Guía rápida de inicio y referencia
├── docs/
│   ├── DOCUMENTACION_LOGIC_CONTROL.md   # Documentación maestra única del proyecto
│   └── screenshots/                     # Capturas comparativas de referencia UI
└── src/
    ├── main.js                          # Orquestador principal, renderizado reactivo y Event Delegation
    ├── core/                            # Capa 1: Infraestructura transversal
    │   ├── config.js                    # Lectura centralizada de .env y cabeceras application/json
    │   ├── store.js                     # Store reactivo (Observable/Pub-Sub) + persistencia local
    │   ├── router.js                    # Enrutador SPA client-side (?screen=...)
    │   ├── formatters.js                # Formateo numérico/ARS, estados de stock, sanitización XSS y parser CSV/XLSX
    │   └── icons.js                     # Catálogo centralizado de íconos SVG inline
    ├── data/                            # Capa 2: Datos iniciales de demostración
    │   └── mockData.js                  # Productos, sedes, movimientos, categorías y recetas de kits
    ├── services/                        # Capa 3: Capa de red, API y lógica de negocio
    │   ├── apiClient.js                 # Cliente HTTP centralizado (http://localhost:4000)
    │   ├── supabaseClient.js            # Cliente REST/Auth nativo para Supabase
    │   ├── apiRepository.js             # Repositorio híbrido resiliente y ConnectionManager
    │   ├── inventoryService.js          # Reglas de inventario, movimientos, carga masiva y kits
    │   └── authService.js               # Autenticación, sesiones, roles y control de acceso
    ├── components/                      # Capa 4: Componentes UI reutilizables y Drawers
    │   ├── Header.js                    # Barra superior (breadcrumbs alineados, sedes, estado API y acciones)
    │   ├── Sidebar.js                   # Menú lateral colapsable (72px rail / 260px hover)
    │   ├── KpiCard.js                   # Tarjetas de indicadores clave
    │   ├── StatusBadge.js               # Etiquetas visuales de estado de stock
    │   ├── DataTable.js                 # Tablas reutilizables con paginación y acciones
    │   ├── BulkImportDrawer.js          # Drawer de carga masiva CSV/Excel con previsualización
    │   └── DrawerManager.js             # Gestor unificado de drawers laterales
    ├── views/                           # Capa 5: Vistas de pantalla
    │   ├── LoginView.js                 # Acceso corporativo y selector Google Workspace SSO
    │   ├── DashboardView.js             # Resumen General, KPIs, comparativa por sedes y flujo
    │   ├── ProductsView.js              # Catálogo, filtros, ordenamiento y CRUD de productos
    │   ├── ConversionView.js            # Desarme y conversión de cajas/kits a unidades
    │   ├── MovementsView.js             # Historial de ingresos, egresos, ajustes y transferencias
    │   ├── DirectoriesView.js           # Nomenclador de categorías y sectores de depósito
    │   ├── ReportsView.js               # Analítica operativa, valorización y exportación
    │   └── SettingsView.js              # Parámetros de empresa, reglas automáticas y nómina de usuarios
    ├── styles/                          # Capa 6: Sistema de diseño CSS3 modular
    │   ├── main.css                     # Entry point de hojas de estilo
    │   ├── variables.css                # Tokens semánticos (colores, fuentes, radios, sombras, temas)
    │   ├── base.css                     # Reset y tipografía base
    │   ├── layout.css                   # Shell, sidebar rail, topbar y grillas principales
    │   ├── components.css               # Botones, badges, tablas, drawers, breadcrumbs y status pill
    │   ├── views.css                    # Estilos específicos de vistas y modo oscuro
    │   └── polish.css                   # Capa de unificación visual y responsividad
    └── admin/                           # Consola Corporativa Multi-Empresa (admin.html)
        ├── admin.js                     # Lógica completa del panel multi-empresa, RBAC y auditoría
        ├── adminData.js                 # Datos iniciales de organizaciones, planes y logs
        └── admin.css                    # Sistema visual de la consola de administración
```

---

## 3. Cambios de la Última Actualización (Noviembre 2026)

### 3.1. Elementos Eliminados
1. **Bloque “Apariencia visual” (Claro / Oscuro) en menú lateral:**
   * Se removió por completo el selector `.sidebar-theme-box` del menú lateral en [`src/components/Sidebar.js`](../src/components/Sidebar.js) y en [`src/admin/admin.js`](../src/admin/admin.js).
   * El cambio entre modo claro y oscuro permanece accesible desde el botón de tema en la barra superior (`Header`).
2. **Botón “Carga masiva” en fila de acciones del Resumen General:**
   * Se eliminó el botón `"Carga masiva"` de `.page-actions` en [`src/views/DashboardView.js`](../src/views/DashboardView.js), quedando únicamente `"Convertir kits / cajas"` y `"Registrar movimiento"`.
   * El botón `"Carga masiva"` de la barra superior en [`src/components/Header.js`](../src/components/Header.js) se mantiene activo.
3. **Sección “Cambiar Contraseña y Seguridad de Cuenta”:**
   * Se eliminó por completo de [`src/views/SettingsView.js`](../src/views/SettingsView.js) junto con su importación y renderizado (`renderAccountSecurityPanel`), incluyendo todos sus campos y botones.

### 3.2. Alineación del Encabezado en Barra Superior y Títulos
* En [`src/components/Header.js`](../src/components/Header.js) y [`src/styles/components.css`](../src/styles/components.css), la sección `.breadcrumbs` se organizó en disposición vertical (`flex-direction: column; align-items: flex-start`):
  * Fila superior (`.breadcrumbs-meta`): `Sedes / Sucursales` `/` `Todas las sedes Consolidado`.
  * Fila inferior (`.breadcrumbs-screen-title`): `Resumen general` (o el nombre de la vista activa).
* Con esta estructura, el texto **"Resumen general"** queda alineado exactamente con el **mismo borde izquierdo** que `"Sedes / Sucursales"` y `"Todas las sedes Consolidado"`.
* Todas las vistas (Dashboard, Productos, Conversión, Movimientos, Categorías, Reportes, Configuración) conservan la misma estructura `.page > .page-header > .page-title`, asegurando que el título grande **"Resumen General — Todas las Sedes"** no se desplace ni salte al navegar.

### 3.3. Elemento Pendiente (Sin Tocar)
* **Depósito Sur:** En [`src/data/mockData.js`](../src/data/mockData.js#L50) se mantiene con `status: 'En inventario'` (en lugar de `"Operativa"`) hasta confirmación explícita del usuario.

---

## 4. Arquitectura de Conexión a Endpoints y Supabase

### 4.1. Variables de Entorno Públicas (`.env`)
El proyecto lee su configuración desde [`src/core/config.js`](../src/core/config.js) priorizando overrides en tiempo de ejecución, variables de entorno y valores definidos en `.env` / `.env.example`.

```env
VITE_API_BASE_URL=http://localhost:4000
VITE_SUPABASE_URL=https://pzkeymtcplpvwjzysziz.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable__iiLgQ9edVveaxZqJ33Ltg_jEzF8xQ0
```

> **Seguridad:** No existe ninguna clave `service_role`, secreto privado ni credencial administrativa embebida en el código del frontend.

### 4.2. Cliente HTTP Centralizado y Estrategia Resiliente
* **[`src/services/apiClient.js`](../src/services/apiClient.js):**
  * Usa `config.API_BASE_URL` (`http://localhost:4000`).
  * Aplica cabeceras estrictas `Content-Type: application/json` y `Accept: application/json`.
  * Maneja timeouts mediante `AbortController` (10 segundos).
  * Inyecta automáticamente el token `Bearer` si existe una sesión activa.
  * Normaliza errores HTTP y de red mediante la clase `ApiError(message, status, data)`.
* **[`src/services/supabaseClient.js`](../src/services/supabaseClient.js):**
  * Cliente REST/Auth ultraligero sin dependencias npm externas sobre `/rest/v1/` y `/auth/v1/`.
* **[`src/services/apiRepository.js`](../src/services/apiRepository.js):**
  * Implementa `connectionManager` y repositorios unificados con estrategia híbrida:
    1. **Backend REST Local (`http://localhost:4000`)** si está en línea.
    2. **Supabase Cloud** como respaldo automático en la nube.
    3. **Modo Local Resiliente** (`store.js` + `localStorage`) si no hay conectividad externa, evitando bloqueos de pantalla.
  * El estado de conexión se visualiza en tiempo real en la barra superior mediante `.api-status-pill` (clic para reintentar comprobación).

### 4.3. Rutas Pendientes de Confirmación
Ninguna ruta se da por definitiva hasta ser confirmada por el usuario. Mientras tanto, las pantallas operan con estados de carga, manejo de error y fallback local:

| Módulo | Método | Ruta Propuesta | Propósito | Estado Actual |
| :--- | :--- | :--- | :--- | :--- |
| **Productos** | `GET` | `/api/products` | Listado de inventario | Carga inicial con fallback local |
| **Productos** | `POST` | `/api/products` | Alta de producto | Guardado optimista + sync asíncrona |
| **Productos** | `PUT` | `/api/products/:id` | Edición y ajuste de stock | Guardado optimista + sync asíncrona |
| **Productos** | `DELETE` | `/api/products/:id` | Eliminación de producto | Guardado optimista + sync asíncrona |
| **Movimientos** | `GET` | `/api/movements` | Historial de movimientos | Carga inicial con fallback local |
| **Movimientos** | `POST` | `/api/movements` | Registro de ingreso/egreso/ajuste | Guardado optimista + sync asíncrona |
| **Categorías** | `GET` | `/api/categories` | Nomenclador de rubros | Carga inicial con fallback local |
| **Categorías** | `POST` | `/api/categories` | Alta de categoría | Guardado optimista + sync asíncrona |
| **Sedes** | `GET` / `POST` | `/api/branches` | Gestión de sucursales | Pendiente de confirmación |
| **Empresas (Admin)** | `GET` / `POST` / `PUT` | `/api/companies` | Gestión multi-empresa en `admin.html` | Sincronización local + pendiente confirmación |
| **Auth** | `POST` | `/api/auth/login`, `/api/auth/logout` | Autenticación corporativa | Soporte con fallback local / Supabase |

---

## 5. Checklist de Verificación

1. **Menú Lateral (App Principal y Admin):**
   * Abrir `index.html` y `admin.html`. Confirmar que no existe el bloque de botones Claro / Oscuro en el sidebar; el botón en el topbar sigue cambiando el tema correctamente.
2. **Resumen General:**
   * En la cabecera derecha del contenido (`.page-actions`), confirmar que solo están los botones **"Convertir kits / cajas"** y **"Registrar movimiento"**.
   * Confirmar que **"Carga masiva"** sigue visible y funcional en la barra superior.
3. **Configuración del Sistema:**
   * Entrar a **Configuración** y verificar que no aparece la sección **"Cambiar Contraseña y Seguridad de Cuenta"**.
4. **Alineación del Encabezado:**
   * En la barra superior izquierda, comprobar que **"Resumen general"** inicia exactamente en el mismo eje vertical izquierdo que **"Sedes / Sucursales"** y **"Todas las sedes Consolidado"**.
   * Navegar entre vistas y verificar que el título grande **"Resumen General — Todas las Sedes"** mantiene su posición estable.
5. **Depósito Sur (Pendiente):**
   * Verificar que **Depósito Sur** conserva la etiqueta `"En inventario"`.
6. **Endpoints:**
   * Hacer clic en el indicador `.api-status-pill` del topbar para verificar la comprobación de salud hacia `http://localhost:4000` y Supabase sin errores de consola.
