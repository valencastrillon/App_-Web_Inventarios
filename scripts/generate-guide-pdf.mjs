import { copyFileSync, createWriteStream, existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import PDFDocument from 'pdfkit';

const outputPath = resolve('docs/guia-stockia.pdf');
const secondaryOutputPath = resolve('docs/documentacion-cambios-frontend.pdf');
mkdirSync(dirname(outputPath), { recursive: true });

const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 44, right: 44, bottom: 46, left: 44 },
  bufferPages: true,
  info: {
    Title: 'Stockia v2.0 · Arquitectura Profesional HTML5 + CSS3 + Vanilla JS y Documentación Técnica',
    Author: 'Stockia Frontend Engineering',
    Subject: 'Arquitectura limpia por capas en HTML5, CSS3 y JavaScript puro, guía de módulos/funciones y evidencia visual',
  },
});

const stream = createWriteStream(outputPath);
doc.pipe(stream);

const ink = '#0F172A';
const slate = '#334155';
const muted = '#64748B';
const blue = '#2563EB';
const blueSoft = '#EFF6FF';
const green = '#059669';
const greenSoft = '#ECFDF5';
const amber = '#D97706';
const line = '#E2E8F0';
const contentWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;

function ensureRoom(height = 60) {
  if (doc.y + height > doc.page.height - doc.page.margins.bottom) {
    doc.addPage();
  }
}

function sectionHeader(badge, title, subtitle) {
  ensureRoom(68);
  doc.moveDown(0.4);
  doc
    .font('Helvetica-Bold')
    .fontSize(8.5)
    .fillColor(blue)
    .text(badge.toUpperCase(), doc.page.margins.left, doc.y, {
      characterSpacing: 0.8,
    });
  doc.moveDown(0.15);
  doc.font('Helvetica-Bold').fontSize(15).fillColor(ink).text(title, doc.page.margins.left, doc.y);
  doc.moveDown(0.15);
  doc.font('Helvetica').fontSize(9).fillColor(muted).text(subtitle, doc.page.margins.left, doc.y, {
    width: contentWidth,
  });
  doc.moveDown(0.35);
  doc
    .moveTo(doc.page.margins.left, doc.y)
    .lineTo(doc.page.width - doc.page.margins.right, doc.y)
    .lineWidth(0.8)
    .strokeColor(line)
    .stroke();
  doc.moveDown(0.5);
}

// ============================================================================
// PÁGINA 1: PORTADA EJECUTIVA, ESTADÍSTICAS Y TABLA "QUÉ SE HIZO Y DÓNDE"
// ============================================================================
doc.rect(0, 0, doc.page.width, 168).fill('#0F172A');
doc.rect(0, 164, doc.page.width, 4).fill(blue);

doc.roundedRect(44, 30, 255, 18, 9).fill('#1E3A8A');
doc
  .font('Helvetica-Bold')
  .fontSize(7.5)
  .fillColor('#93C5FD')
  .text('ARQUITECTURA PROFESIONAL · HTML5 + CSS3 + VANILLA JS', 54, 35.5, { characterSpacing: 0.5 });

doc
  .font('Helvetica-Bold')
  .fontSize(22)
  .fillColor('#FFFFFF')
  .text('Stockia v2.0 · Arquitectura y Documentación', 44, 58);

doc
  .font('Helvetica')
  .fontSize(10)
  .fillColor('#CBD5E1')
  .text(
    'Sistema integral de gestión de inventarios migrado a HTML5 semántico, CSS3 modular (7 hojas) y JavaScript puro (ES Modules) bajo una Arquitectura Limpia por Capas (Clean Layered Architecture), cero frameworks.',
    44,
    88,
    { width: contentWidth }
  );

doc
  .font('Helvetica')
  .fontSize(8.5)
  .fillColor('#94A3B8')
  .text(
    'Stack: HTML5 + CSS3 Modular + Vanilla JS (ES2023)   |   Dependencias Runtime: 0   |   Bundle Gzip: 37.6 kB JS / 15.0 kB CSS',
    44,
    134
  );

doc.y = 184;

const kpiCards = [
  { label: 'ARQUITECTURA', value: '6 Capas', detail: 'core, data, services, views, ui, css', bg: blueSoft, color: blue },
  { label: 'RUNTIME DEPS', value: '0 Libs', detail: '100% HTML5 + CSS3 + JS Puro', bg: greenSoft, color: green },
  { label: 'REQUERIMIENTOS', value: '9 / 9', detail: 'Multi-sede, Kits, CSV, Dark Mode', bg: '#FFFBEB', color: amber },
  { label: 'PESO BUNDLE JS', value: '-68%', detail: 'De 398 kB a 161 kB (37 kB gzip)', bg: '#F3E8FF', color: '#7C3AED' },
];

const cardW = (contentWidth - 30) / 4;
const startY = doc.y;
kpiCards.forEach((card, i) => {
  const x = 44 + i * (cardW + 10);
  doc.roundedRect(x, startY, cardW, 58, 6).fillAndStroke(card.bg, line);
  doc.font('Helvetica-Bold').fontSize(7).fillColor(muted).text(card.label, x + 10, startY + 9);
  doc.font('Helvetica-Bold').fontSize(16).fillColor(card.color).text(card.value, x + 10, startY + 21);
  doc.font('Helvetica').fontSize(7.5).fillColor(slate).text(card.detail, x + 10, startY + 42, { width: cardW - 16 });
});
doc.y = startY + 70;

sectionHeader(
  '1. Matriz de Trazabilidad Funcional',
  '¿Qué se hizo, dónde está cada módulo y para qué sirve?',
  'Detalle de cada funcionalidad implementada sobre la nueva arquitectura en JavaScript, HTML5 y CSS3.'
);

const changesTable = [
  [
    '1. Modo oscuro y claro abajo de Configuración',
    'src/components/Sidebar.js\nsrc/styles/variables.css',
    'Control segmentado Claro/Oscuro ubicado debajo de Configuración en el menú lateral. Persiste en localStorage y aplica tokens CSS [data-theme="dark"] en toda la interfaz.',
  ],
  [
    '2. Convertir kits o cajas (Proveedores)',
    'src/views/ConversionView.js\nsrc/services/inventoryService.js',
    'Sección en el menú lateral con insignia "Proveedores". Permite desglosar cajas mayoristas en unidades individuales (executeKitConversion), actualizando stock y creando 2 asientos.',
  ],
  [
    '3. Tablas y campos para subir masivamente',
    'src/components/BulkImportDrawer.js\nsrc/core/formatters.js',
    'Planilla interactiva editable en pantalla (Nombre, SKU, Categoría, Sede, Stock, Mínimo, Costo, Precio y Ubicación) + importador CSV nativo (parseCsvProducts) con plantilla descargable.',
  ],
  [
    '4. Opción para ver Sedes / Sucursales',
    'src/components/Header.js\nsrc/components/DrawerManager.js',
    'Selector desplegable en la barra superior con ocupación de depósito por sede y Drawer dedicado para inspeccionar todas las sucursales de Comercial Norte SRL o dar de alta nuevas.',
  ],
  [
    '5. Revisión de márgenes y arquitectura CSS3',
    'src/styles/polish.css\nsrc/styles/variables.css',
    'Se corrigió la desincronización entre clases HTML y selectores CSS heredados. Se normalizaron tokens, márgenes, botones, paneles, grillas responsive y contraste claro/oscuro.',
  ],
  [
    '6. Ocultar menú al ingresar a una sección',
    'src/core/router.js\n(navigateFromMenu)',
    'Al hacer clic en cualquier ítem del menú lateral, navigateFromMenu() actualiza la vista y pone sidebarVisible: false automáticamente para ceder el 100% del ancho útil.',
  ],
  [
    '7. Habilitar/inhabilitar usuarios y contraseña',
    'src/components/AccountSecurityPanel.js\nsrc/services/authService.js',
    'Panel de control de usuarios con botón Habilitar/Inhabilitar en tiempo real (toggleUserEnabled), alta de operadores y cambio de contraseña con medidor de fortaleza de 4 barras.',
  ],
  [
    '8. Dashboard consolidado y filtro por sede',
    'src/views/DashboardView.js\nsrc/data/mockData.js',
    'Muestra por defecto el Resumen General de todas las sedes con tarjetas comparativas y píldoras de filtro para visualizar cada sucursal de forma individual.',
  ],
  [
    '9. Interfaz de Login con Google Workspace',
    'src/views/LoginView.js\nsrc/core/icons.js',
    'Botón oficial de Google Workspace SSO con logo vectorial multicolor y selector interactivo de cuentas corporativas verificadas + login tradicional.',
  ],
];

changesTable.forEach(([reqTitle, files, desc], index) => {
  ensureRoom(42);
  const rowY = doc.y;
  const bg = index % 2 === 0 ? '#F8FAFC' : '#FFFFFF';
  doc.roundedRect(44, rowY, contentWidth, 38, 4).fillAndStroke(bg, line);
  doc.font('Helvetica-Bold').fontSize(8).fillColor(ink).text(reqTitle, 50, rowY + 6, { width: 135 });
  doc.font('Courier-Bold').fontSize(6.8).fillColor(blue).text(files, 190, rowY + 6, { width: 122 });
  doc.font('Helvetica').fontSize(7.4).fillColor(slate).text(desc, 316, rowY + 6, { width: 220, lineGap: 1.1 });
  doc.y = rowY + 41;
});

// ============================================================================
// FUNCIÓN PARA RENDERIZAR CAPTURAS DE PANTALLA CON EXPLICACIÓN TÉCNICA
// ============================================================================
function renderScreenshotBlock({ badge, title, file, summary, bullets, imageName }) {
  ensureRoom(330);
  const blockY = doc.y;
  doc.font('Helvetica-Bold').fontSize(8).fillColor(blue).text(badge.toUpperCase(), 44, blockY);
  doc.font('Helvetica-Bold').fontSize(12.5).fillColor(ink).text(title, 44, blockY + 11);
  doc.font('Courier-Bold').fontSize(8).fillColor(green).text(`Módulos JS/CSS: ${file}`, 44, blockY + 26);
  doc.font('Helvetica').fontSize(8.5).fillColor(slate).text(summary, 44, blockY + 39, { width: contentWidth });

  let bulletY = doc.y + 4;
  bullets.forEach((b) => {
    doc.circle(50, bulletY + 4, 2).fill(blue);
    doc.font('Helvetica').fontSize(8).fillColor(ink).text(b, 58, bulletY, { width: contentWidth - 18 });
    bulletY = doc.y + 2;
  });

  const imgPath = resolve('docs/screenshots', imageName);
  if (existsSync(imgPath)) {
    const imgY = bulletY + 6;
    const imgH = 216;
    const imgW = Math.round(imgH * (1440 / 920));
    const frameW = imgW + 8;
    const frameX = 44 + Math.round((contentWidth - frameW) / 2);
    doc.roundedRect(frameX, imgY, frameW, imgH + 8, 6).fillAndStroke('#0F172A', line);
    doc.image(imgPath, frameX + 4, imgY + 4, { width: imgW, height: imgH });
    doc.y = imgY + imgH + 18;
  } else {
    doc.y = bulletY + 10;
  }
}

// ============================================================================
// PÁGINA 2: LOGIN CON GOOGLE Y DASHBOARD GENERAL + MULTI-SEDE
// ============================================================================
doc.addPage();
sectionHeader(
  '2. Evidencia Visual de la Interfaz (Parte 1)',
  'Acceso con Google Workspace y Dashboard Consolidado',
  'Capturas reales en alta resolución de los módulos renderizados con HTML5, CSS3 y Vanilla JS.'
);

renderScreenshotBlock({
  badge: 'Módulo de Autenticación · LoginView.js',
  title: 'Interfaz de Login con Google Workspace y Selector de Cuentas',
  file: 'src/views/LoginView.js + src/services/authService.js + src/styles/views.css',
  summary:
    'Renderiza la pantalla de acceso con el logotipo vectorial multicolor de Google, selector interactivo de cuentas corporativas de Comercial Norte SRL y validación instantánea mediante loginSession().',
  bullets: [
    'Selector interactivo OAuth simulado con 3 perfiles corporativos (Jefe de Depósito, Encargada de Sucursal y Dirección Operativa).',
    'Delegación de eventos para alternar el selector (data-action="toggle-google-picker") e iniciar sesión en un clic.',
  ],
  imageName: '01-login-google.png',
});

renderScreenshotBlock({
  badge: 'Resumen General y Navegación · DashboardView.js + Sidebar.js',
  title: 'Dashboard Consolidado (Todas las Sedes) y Selector de Tema bajo Configuración',
  file: 'src/views/DashboardView.js + src/components/Sidebar.js + src/styles/layout.css',
  summary:
    'El Dashboard consolida automáticamente todas las sedes de la empresa y muestra las tarjetas comparativas por planta. En la barra lateral se ubica el selector Modo Claro / Modo Oscuro justo debajo de Configuración.',
  bullets: [
    'Tarjetas comparativas por sucursal con SKUs, unidades, valorización a costo, alertas críticas y dirección física.',
    'Menú lateral con acceso directo a "Convertir kits / cajas (Proveedores)" y cierre automático al ingresar a una sección.',
  ],
  imageName: '02-dashboard-consolidado.png',
});

// ============================================================================
// PÁGINA 3: FILTRO INDIVIDUAL DE SUCURSAL Y CONVERSIÓN DE KITS/CAJAS
// ============================================================================
doc.addPage();
sectionHeader(
  '3. Evidencia Visual de la Interfaz (Parte 2)',
  'Filtro Individual por Sucursal y Conversión de Kits / Cajas',
  'Inspección individual de sucursales con auto-ocultamiento de menú y fraccionamiento mayorista de proveedores.'
);

renderScreenshotBlock({
  badge: 'Filtro por Sucursal + Menú Auto-oculto · router.js + Header.js',
  title: 'Dashboard Filtrado por Sucursal Individual',
  file: 'src/views/DashboardView.js + src/core/router.js + src/components/Header.js',
  summary:
    'Al elegir una sede desde las píldoras de filtro o el selector superior, el menú permanece oculto cediendo todo el ancho de trabajo y el dashboard recalcula KPIs, flujo de inventario y alertas únicamente para esa planta.',
  bullets: [
    'Banner informativo de sede individual con responsable, teléfono, porcentaje de ocupación y botón para volver al consolidado.',
    'Botón "Menú" en la esquina superior izquierda para desplegar la navegación lateral cuando el operador lo requiera.',
  ],
  imageName: '03-dashboard-filtro-sede.png',
});

renderScreenshotBlock({
  badge: 'Transformación de Stock · ConversionView.js + inventoryService.js',
  title: 'Módulo de Convertir Kits y Cajas (Proveedores)',
  file: 'src/views/ConversionView.js + src/services/inventoryService.js',
  summary:
    'Permite seleccionar plantillas homologadas por proveedor o modo libre para abrir cajas cerradas e ingresar unidades individuales al stock de venta mediante executeKitConversion().',
  bullets: [
    'Simulador en vivo que muestra la baja del bulto mayorista (-N cajas) y el alta de unidades individuales (+M unidades).',
    'Genera automáticamente dos movimientos de auditoría en el historial (Egreso de caja + Ingreso de unidades fraccionadas).',
  ],
  imageName: '04-convertir-kits-cajas.png',
});

// ============================================================================
// PÁGINA 4: CARGA MASIVA TABULAR/CSV Y CONFIGURACIÓN EN MODO OSCURO
// ============================================================================
doc.addPage();
sectionHeader(
  '4. Evidencia Visual de la Interfaz (Parte 3)',
  'Carga Masiva Tabular/CSV, Usuarios, Contraseña y Modo Oscuro',
  'Planilla editable multi-fila en el navegador y panel de seguridad de cuentas en tema oscuro.'
);

renderScreenshotBlock({
  badge: 'Alta Masiva de Catálogo · BulkImportDrawer.js',
  title: 'Tablas y Campos de Formulario para Subir Masivamente (Grilla + CSV)',
  file: 'src/components/BulkImportDrawer.js + src/core/formatters.js',
  summary:
    'Ofrece una tabla/formulario interactivo multi-fila editable en vivo y un importador de archivos CSV con previsualización instantánea y descarga de plantilla oficial.',
  bullets: [
    'Edición en tiempo real por celda (data-bulk-row y data-bulk-field) con preservación automática de foco y cursor.',
    'Totales dinámicos de filas válidas, unidades por ingresar y valorización total de costo antes de confirmar la importación.',
  ],
  imageName: '05-carga-masiva-tabla.png',
});

renderScreenshotBlock({
  badge: 'Seguridad, Usuarios y Tema Oscuro · AccountSecurityPanel.js',
  title: 'Configuración en Modo Oscuro: Habilitar/Inhabilitar Usuarios y Contraseña',
  file: 'src/components/AccountSecurityPanel.js + src/services/authService.js',
  summary:
    'Vista de Configuración en Modo Oscuro. Permite habilitar o inhabilitar operadores con un clic, cambiar roles por sucursal, dar de alta nuevos usuarios y actualizar la contraseña con medidor de seguridad.',
  bullets: [
    'Función toggleUserEnabled(userId) que alterna inmediatamente el permiso de acceso y lo persiste en localStorage.',
    'Evaluador evaluatePasswordStrength(pwd) de 4 niveles (longitud, mayúsculas, números y caracteres especiales).',
  ],
  imageName: '06-configuracion-dark-mode.png',
});

// ============================================================================
// PÁGINA 5: DOCUMENTACIÓN PROFUNDA DE LA ARQUITECTURA POR CAPAS (HTML/CSS/JS)
// ============================================================================
doc.addPage();
sectionHeader(
  '5. Arquitectura Profesional en HTML5, CSS3 y Vanilla JS',
  'Explicación Detallada de Capas, Módulos y Funciones',
  'Descripción exhaustiva de qué hace cada capa y cada archivo implementado en el proyecto.'
);

const layersDoc = [
  {
    layer: 'CAPA 1 · NÚCLEO TÉCNICO (src/core/)',
    items: [
      ['src/core/store.js', 'Implementa un Store Reactivo Centralizado (Patrón Observable / Pub-Sub). Centraliza todo el estado en memoria, sincroniza theme y users con localStorage y notifica a renderApp() ante cada cambio mediante store.setState() y store.subscribe().'],
      ['src/core/router.js', 'Enrutador SPA basado en History API. Exporta navigate(screen) para navegación interna y navigateFromMenu(screen) que cambia de sección y oculta automáticamente el menú lateral (sidebarVisible: false).'],
      ['src/core/formatters.js', 'Utilidades puras: formatNumber() y formatCurrency() (formato es-AR), stockStatus() (calcula En stock / Stock bajo / Sin stock), escapeHtml() (prevención XSS) y parseCsvProducts() (lector CSV nativo).'],
      ['src/core/icons.js', 'Motor de íconos SVG vectoriales nativos sin dependencias externas. Exporta icon(name, size) incluyendo los 48 íconos operativos de la interfaz y el logo oficial multicolor de Google.'],
    ],
  },
  {
    layer: 'CAPA 2 · DATOS MAESTROS DE DOMINIO (src/data/)',
    items: [
      ['src/data/mockData.js', 'Catálogo inicial de Comercial Norte SRL: initialBranches (Todas las sedes, CD Norte, Sucursal Centro, Depósito Sur), initialProducts (15 SKUs), initialKitRecipes (plantillas de conversión), initialCategories, initialSuppliers, initialMovements, initialUsers y series analíticas.'],
    ],
  },
  {
    layer: 'CAPA 3 · SERVICIOS DE NEGOCIO (src/services/)',
    items: [
      ['src/services/inventoryService.js', 'Lógica de negocio de inventario: saveProductDraft(), removeProductById(), saveMovementDraft(), importProductsBatch(), executeKitConversion() (descuenta cajas mayoristas, suma unidades individuales y registra doble movimiento) y saveBranchDraft().'],
      ['src/services/authService.js', 'Seguridad y accesos: loginSession(), logoutSession(), toggleUserEnabled() (habilita o inhabilita usuarios en vivo), updateUserRole(), createNewUser(), evaluatePasswordStrength() y submitPasswordChange().'],
    ],
  },
  {
    layer: 'CAPA 4 · COMPONENTES UI REUTILIZABLES (src/components/)',
    items: [
      ['src/components/Sidebar.js', 'Menú lateral colapsable con contadores en vivo, acceso a "Convertir kits / cajas (Proveedores)" y selector de Modo Claro / Modo Oscuro ubicado justo debajo de Configuración.'],
      ['src/components/Header.js', 'Topbar con botón Menú, selector enriquecido de Sedes/Sucursales con porcentaje de ocupación, buscador global ⌘K y accesos a Carga Masiva y Nuevo Producto.'],
      ['src/components/BulkImportDrawer.js', 'Drawer ancho con dos pestañas: Grilla/Formulario interactivo multi-fila editable en pantalla e importador de archivos CSV con descarga de plantilla modelo.'],
      ['src/components/AccountSecurityPanel.js', 'Panel de administración de usuarios (Habilitar/Inhabilitar, alta rápida y rol por sede) y formulario de cambio de contraseña con medidor visual de 4 barras.'],
      ['src/components/DrawerManager.js', 'Orquestador de modales laterales para creación/edición de Productos, Movimientos, Categorías, Proveedores y Sedes/Sucursales.'],
      ['KpiCard.js / DataTable.js / StatusBadge.js', 'Componentes atómicos reutilizables para tarjetas de métricas ejecutivas, tablas de datos con estado vacío y etiquetas semánticas de estado.'],
    ],
  },
  {
    layer: 'CAPA 5 · VISTAS DE PANTALLA (src/views/) Y ORQUESTADOR (src/main.js)',
    items: [
      ['src/views/* (8 vistas)', 'LoginView.js, DashboardView.js (resumen general + filtro individual de sucursales), ProductsView.js, ConversionView.js, MovementsView.js, DirectoriesView.js, ReportsView.js y SettingsView.js.'],
      ['src/main.js', 'Punto de entrada principal. Ejecuta el ciclo de renderizado declarativo con preservación inteligente de foco (restoreFocus) y gestiona todos los eventos mediante Event Delegation centralizada (click, input, change, submit, keydown).'],
    ],
  },
  {
    layer: 'CAPA 6 · ARQUITECTURA CSS3 MODULAR (src/styles/)',
    items: [
      ['src/styles/* (7 hojas CSS)', 'variables.css (Design Tokens Light/Dark), base.css (reset y números tabulares), layout.css (App Shell, Sidebar auto-ocultable, Topbar), components.css (botones, tablas, drawers, badges), views.css (estilos específicos), polish.css (integración visual) y main.css.'],
    ],
  },
];

layersDoc.forEach((group) => {
  ensureRoom(48);
  doc
    .roundedRect(44, doc.y, contentWidth, 18, 4)
    .fill('#EFF6FF');
  doc
    .font('Helvetica-Bold')
    .fontSize(8.2)
    .fillColor(blue)
    .text(group.layer, 52, doc.y + 5);
  doc.y += 23;

  group.items.forEach(([file, desc]) => {
    ensureRoom(28);
    doc.font('Courier-Bold').fontSize(8).fillColor(ink).text(file, 48, doc.y, { continued: true });
    doc.font('Helvetica').fontSize(8).fillColor(slate).text(` — ${desc}`, { lineGap: 1.2 });
    doc.moveDown(0.3);
  });
  doc.moveDown(0.2);
});

ensureRoom(75);
const buildStatsY = doc.y + 4;
doc.roundedRect(44, buildStatsY, contentWidth, 62, 6).fillAndStroke(greenSoft, '#A7F3D0');
doc
  .font('Helvetica-Bold')
  .fontSize(8.8)
  .fillColor(green)
  .text('AUDITORÍA DE CALIDAD Y RENDIMIENTO (HTML5 + CSS3 + VANILLA JS)', 56, buildStatsY + 9);
doc
  .font('Helvetica')
  .fontSize(8.2)
  .fillColor(ink)
  .text(
    '• Cero dependencias de runtime en package.json ("dependencies": {}) — 100% estándares web nativos.\n• Linter estático (oxlint src scripts): 0 errores y 0 advertencias en 25 archivos evaluados.\n• Bundle de Producción (Vite): index.html 0.71 kB | CSS 82.1 kB (15.0 kB gzip) | JS 161.6 kB (37.6 kB gzip).',
    56,
    buildStatsY + 23,
    { lineGap: 1.8 }
  );

// Numeración de páginas y pie de página
const pages = doc.bufferedPageRange();
for (let index = pages.start; index < pages.start + pages.count; index += 1) {
  doc.switchToPage(index);
  const oldBottom = doc.page.margins.bottom;
  doc.page.margins.bottom = 0;
  doc
    .moveTo(44, doc.page.height - 34)
    .lineTo(doc.page.width - 44, doc.page.height - 34)
    .lineWidth(0.6)
    .strokeColor(line)
    .stroke();
  doc
    .font('Helvetica')
    .fontSize(8)
    .fillColor(muted)
    .text(
      'Stockia v2.0 · Arquitectura Profesional HTML5 + CSS3 + Vanilla JS (Documentación Técnica y Visual)',
      44,
      doc.page.height - 24,
      { lineBreak: false }
    );
  doc.text(`Página ${index + 1} de ${pages.count}`, doc.page.width - 114, doc.page.height - 24, {
    width: 70,
    align: 'right',
    lineBreak: false,
  });
  doc.page.margins.bottom = oldBottom;
}

doc.end();
stream.on('finish', () => {
  copyFileSync(outputPath, secondaryOutputPath);
  console.log(`PDF principal generado: ${outputPath}`);
  console.log(`Copia ejecutiva generada: ${secondaryOutputPath}`);
});
