# Stockia — Sistema de Gestión de Inventarios (HTML5 + CSS3 + Vanilla JS)

Aplicación web frontend profesional para la gestión integral de inventarios, depósitos multi-sede, fraccionamiento de kits/cajas de proveedores y control de usuarios de **Comercial Norte SRL**.

Construida **100% con tecnologías web estándar nativas (HTML5 semántico, CSS3 modular y Vanilla JavaScript ES Modules)** bajo una **Arquitectura Limpia por Capas (Clean Layered Architecture)**, sin dependencias de frameworks ni backend.

---

## Arquitectura del Proyecto

```
src/
├── main.js                         # Punto de entrada, ciclo de render y Event Delegation
├── core/                           # Núcleo: Store reactivo, Router SPA, Íconos SVG y Formatters
│   ├── store.js                    # Estado centralizado (Patrón Observable / Pub-Sub)
│   ├── router.js                   # Navegación SPA y auto-ocultamiento del menú lateral
│   ├── formatters.js               # Formato ARS, sanitización XSS y parser CSV
│   └── icons.js                    # Motor de íconos vectoriales SVG sin librerías externas
├── data/                           # Datos maestros simulados (3 sedes, 15 SKUs, recetas, usuarios)
│   └── mockData.js
├── services/                       # Capa de Servicios y Lógica de Negocio
│   ├── inventoryService.js         # CRUD de stock, conversión de kits/cajas, carga masiva y sedes
│   └── authService.js              # Login Google SSO, habilitar/inhabilitar usuarios y contraseñas
├── components/                     # Componentes UI modulares y Drawers
│   ├── Sidebar.js                  # Menú auto-ocultable + Selector Modo Claro/Oscuro
│   ├── Header.js                   # Topbar con selector de Sedes/Sucursales y buscador ⌘K
│   ├── BulkImportDrawer.js         # Tabla/Formulario interactivo multi-fila + Importador CSV
│   ├── AccountSecurityPanel.js     # Habilitar/Inhabilitar usuarios + Cambio de contraseña
│   ├── DrawerManager.js            # Gestor de drawers (Producto, Movimiento, Categoría, Sede)
│   ├── DataTable.js                # Tabla reutilizable con estado vacío
│   ├── KpiCard.js                  # Tarjetas ejecutivas de indicadores
│   └── StatusBadge.js              # Etiquetas semánticas de estado
├── views/                          # Vistas de las 8 secciones de la plataforma
│   ├── LoginView.js                # Login con Google Workspace Account Picker
│   ├── DashboardView.js            # Resumen general de todas las sedes + filtro por sucursal
│   ├── ProductsView.js             # Catálogo filtrable, ordenable y paginado
│   ├── ConversionView.js           # Conversión de kits o cajas de proveedores a unidades
│   ├── MovementsView.js            # Bitácora de ingresos, egresos, ajustes y transferencias
│   ├── DirectoriesView.js          # Categorías y directorio de proveedores homologados
│   ├── ReportsView.js              # Analítica financiera y prioridad de compra
│   └── SettingsView.js             # Configuración general, usuarios y seguridad
└── styles/                         # Arquitectura CSS3 Modular (6 hojas de estilo)
    ├── main.css
    ├── variables.css               # Design Tokens Light & Dark Mode
    ├── base.css                    # Reset y tipografía tabular
    ├── layout.css                  # App Shell, Sidebar colapsable y Topbar
    ├── components.css              # Botones, tablas, formularios, badges y drawers
    └── views.css                   # Estilos de Login, Dashboard multi-sede, Conversión y Seguridad
```

Para consultar el detalle completo de cada archivo y cada función implementada, revisá:
- **[Documentación Técnica de Arquitectura y Funciones (`docs/ARQUITECTURA_Y_DOCUMENTACION.md`)](docs/ARQUITECTURA_Y_DOCUMENTACION.md)**
- **[Informe Ejecutivo Ilustrado en PDF (`docs/guia-stockia.pdf`)](docs/guia-stockia.pdf)**

---

## Comandos Disponibles

```bash
# Iniciar servidor de desarrollo (http://localhost:5173)
npm run dev

# Compilar bundle estático de producción en dist/
npm run build

# Ejecutar linter estático (0 errores, 0 advertencias)
npm run lint

# Regenerar la documentación PDF ilustrada
npm run docs:pdf
```
