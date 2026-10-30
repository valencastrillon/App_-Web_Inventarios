/**
 * @fileoverview Catálogo de datos simulados (Mock Data) para Comercial Norte SRL.
 * Incluye sucursales, productos iniciales, recetas de conversión de kits/cajas,
 * categorías, movimientos históricos, usuarios y series analíticas.
 */

export const initialBranches = [
  {
    id: 'all',
    name: 'Todas las sedes',
    city: 'Consolidado',
    address: 'Visión global de Comercial Norte SRL',
    manager: 'Dirección Operativa',
    phone: '+54 11 5263-9000',
    warehouses: 4,
    occupancy: 74,
    status: 'Operativa',
  },
  {
    id: 'cd-norte',
    name: 'CD Norte',
    city: 'Tigre, GBA Norte',
    address: 'Av. Constituyentes 4820, Parque Industrial Tigre',
    manager: 'Martín Pereyra',
    phone: '+54 11 4736-1102',
    warehouses: 2,
    occupancy: 82,
    status: 'Operativa',
  },
  {
    id: 'sucursal-centro',
    name: 'Sucursal Centro',
    city: 'CABA, Microcentro',
    address: 'Av. Belgrano 1245, CABA',
    manager: 'Carolina Méndez',
    phone: '+54 11 4381-8890',
    warehouses: 1,
    occupancy: 68,
    status: 'Operativa',
  },
  {
    id: 'deposito-sur',
    name: 'Depósito Sur',
    city: 'Avellaneda, GBA Sur',
    address: 'Camino Gral. Belgrano 2910, Avellaneda',
    manager: 'Diego Santillán',
    phone: '+54 11 4204-5531',
    warehouses: 1,
    occupancy: 61,
    status: 'En inventario',
  },
];

export const initialProducts = [
  { id: '1', name: 'Taladro Percutor 750W', subtitle: 'Maletín + 5 mechas', sku: 'FER-0428', category: 'Ferretería', stock: 84, minStock: 20, unit: 'unid.', cost: 48500, price: 69900, location: 'Depósito Central · Pasillo A-2', branch: 'CD Norte', updatedAt: 'hace 2 h' },
  { id: '2', name: 'Cable Unipolar 2.5mm (Rollo 100m)', subtitle: 'Normalizado IRAM', sku: 'ELE-1092', category: 'Electricidad', stock: 12, minStock: 25, unit: 'rollos', cost: 31200, price: 44500, location: 'Depósito Central · Pasillo B-1', branch: 'CD Norte', updatedAt: 'hace 35 min' },
  { id: '3', name: 'Pintura Látex Interior 20L', subtitle: 'Blanco mate lavable', sku: 'PIN-0215', category: 'Pinturería', stock: 38, minStock: 15, unit: 'baldes', cost: 52000, price: 78900, location: 'Depósito Sur · Sector C', branch: 'Depósito Sur', updatedAt: 'ayer' },
  { id: '4', name: 'Casco de Seguridad Dielectrico', subtitle: 'Arnes a cremallera · Amarillo', sku: 'SEG-0084', category: 'Seguridad Ind.', stock: 0, minStock: 30, unit: 'unid.', cost: 8900, price: 14200, location: 'Depósito Central · Pasillo D-4', branch: 'Sucursal Centro', updatedAt: 'hace 3 días' },
  { id: '5', name: 'Guantes de Nitrilo Pesado (Par)', subtitle: 'Talle L · Antideslizante', sku: 'SEG-0119', category: 'Seguridad Ind.', stock: 6, minStock: 40, unit: 'pares', cost: 2400, price: 4100, location: 'Depósito Central · Pasillo D-1', branch: 'Sucursal Centro', updatedAt: 'hace 5 h' },
  { id: '6', name: 'Llave Térmica Bipolar 2x25A', subtitle: 'Curva C · Riel DIN', sku: 'ELE-0334', category: 'Electricidad', stock: 142, minStock: 50, unit: 'unid.', cost: 6800, price: 10900, location: 'Depósito Central · Pasillo B-3', branch: 'CD Norte', updatedAt: 'hace 1 día' },
  { id: '7', name: 'Sellador Poliuretánico 300ml', subtitle: 'Gris · Alta elasticidad', sku: 'CON-0512', category: 'Construcción', stock: 9, minStock: 20, unit: 'cart.', cost: 7500, price: 11800, location: 'Depósito Norte · Estante 3', branch: 'CD Norte', updatedAt: 'hace 4 h' },
  { id: '8', name: 'Amoladora Angular 4½" 850W', subtitle: '11.000 RPM · Uso profesional', sku: 'FER-0811', category: 'Ferretería', stock: 29, minStock: 10, unit: 'unid.', cost: 42000, price: 62500, location: 'Depósito Central · Pasillo A-1', branch: 'Sucursal Centro', updatedAt: 'hace 2 días' },
  { id: '9', name: 'Cinta Métrica Profesional 8m', subtitle: 'Freno automático · Engomada', sku: 'FER-0190', category: 'Ferretería', stock: 64, minStock: 25, unit: 'unid.', cost: 5900, price: 9400, location: 'Depósito Central · Pasillo A-4', branch: 'Depósito Sur', updatedAt: 'hace 6 h' },
  { id: '10', name: 'Reflector LED Exterior 100W', subtitle: 'IP66 · Luz fría 6500K', sku: 'ELE-0771', category: 'Electricidad', stock: 4, minStock: 18, unit: 'unid.', cost: 14300, price: 22900, location: 'Depósito Sur · Sector A', branch: 'Depósito Sur', updatedAt: 'hoy, 09:15' },
  { id: '11', name: 'Disco de Corte Metal 115mm (Pack x10)', subtitle: 'Espesor 1.0mm · Acero inox', sku: 'FER-0552', category: 'Ferretería', stock: 115, minStock: 30, unit: 'packs', cost: 8200, price: 13500, location: 'Depósito Central · Pasillo A-3', branch: 'CD Norte', updatedAt: 'hace 3 días' },
  { id: '12', name: 'Rodillo Antigota Lana Natural 22cm', subtitle: 'Pelo corto · Epoxi y sintéticos', sku: 'PIN-0098', category: 'Pinturería', stock: 51, minStock: 20, unit: 'unid.', cost: 4100, price: 6900, location: 'Depósito Sur · Sector C', branch: 'Depósito Sur', updatedAt: 'ayer' },
  { id: '13', name: 'Caja Mayorista Guantes Nitrilo (x24 Pares)', subtitle: 'Bulto cerrado · Talle L', sku: 'KIT-0119', category: 'Seguridad Ind.', stock: 8, minStock: 3, unit: 'cajas', cost: 52000, price: 89000, location: 'Depósito Central · Pasillo D-0', branch: 'CD Norte', updatedAt: 'hace 1 h' },
  { id: '14', name: 'Caja Master Llaves Térmicas 2x25A (x12 Unid.)', subtitle: 'Pack cerrado ElectroSur · Curva C', sku: 'KIT-0334', category: 'Electricidad', stock: 10, minStock: 4, unit: 'cajas', cost: 76000, price: 118000, location: 'Depósito Central · Pasillo B-0', branch: 'CD Norte', updatedAt: 'hace 3 h' },
  { id: '15', name: 'Kit Obra Soldadura + Discos Inox (Combo)', subtitle: 'Pack promocional ferretería', sku: 'KIT-0552', category: 'Ferretería', stock: 14, minStock: 5, unit: 'kits', cost: 38000, price: 59000, location: 'Depósito Central · Pasillo A-0', branch: 'Sucursal Centro', updatedAt: 'ayer' },
];

export const initialKitRecipes = [
  {
    id: 'KIT-R1',
    name: 'Desarme Caja Mayorista Guantes Nitrilo',
    supplier: 'SegurMax Industrial',
    sourceProductId: '13',
    sourceUnitLabel: 'Caja cerrada (24 pares)',
    targetProductId: '5',
    conversionFactor: 24,
    notes: 'Abre bulto mayorista e ingresa 24 pares individuales al stock de venta.',
  },
  {
    id: 'KIT-R2',
    name: 'Apertura Caja Master Llaves Térmicas 2x25A',
    supplier: 'ElectroSur Mayorista',
    sourceProductId: '14',
    sourceUnitLabel: 'Caja Master (12 unidades)',
    targetProductId: '6',
    conversionFactor: 12,
    notes: 'Fracciona caja master en unidades individuales para mostrador.',
  },
  {
    id: 'KIT-R3',
    name: 'Desglose Kit Obra en Packs de Discos 115mm',
    supplier: 'Distribuidora Andina S.A.',
    sourceProductId: '15',
    sourceUnitLabel: 'Kit cerrado (5 packs x10)',
    targetProductId: '11',
    conversionFactor: 5,
    notes: 'Separa los packs de discos incluidos en el kit promocional.',
  },
];

export const initialCategories = [
  { id: 'CAT-01', name: 'Ferretería', code: 'FER', description: 'Herramientas eléctricas, manuales e insumos de corte', targetMargin: 42, location: 'Depósito Central · Pasillo A' },
  { id: 'CAT-02', name: 'Electricidad', code: 'ELE', description: 'Cables normalizados, protecciones DIN e iluminación LED', targetMargin: 38, location: 'Depósito Central · Pasillo B' },
  { id: 'CAT-03', name: 'Pinturería', code: 'PIN', description: 'Látex interior/exterior, impermeabilizantes y accesorios', targetMargin: 45, location: 'Depósito Sur · Sector C' },
  { id: 'CAT-04', name: 'Seguridad Ind.', code: 'SEG', description: 'EPP certificado: cascos, guantes, protección visual y auditiva', targetMargin: 48, location: 'Depósito Central · Pasillo D' },
  { id: 'CAT-05', name: 'Construcción', code: 'CON', description: 'Selladores, adhesivos técnicos y fijaciones químicas', targetMargin: 36, location: 'Depósito Norte · Estante 3' },
];

export const initialMovements = [
  { id: 'MOV-9042', date: '18 Abr 2025 · 11:40', type: 'Ingreso', productId: '1', productName: 'Taladro Percutor 750W', sku: 'FER-0428', quantity: 24, responsible: 'M. Pereyra', reference: 'OC #4412 · Distribuidora Andina', branch: 'CD Norte' },
  { id: 'MOV-9041', date: '18 Abr 2025 · 10:15', type: 'Egreso', productId: '2', productName: 'Cable Unipolar 2.5mm (Rollo 100m)', sku: 'ELE-1092', quantity: 8, responsible: 'L. Gómez', reference: 'Remito #10884 · Obra San Isidro', branch: 'CD Norte' },
  { id: 'MOV-9040', date: '17 Abr 2025 · 17:30', type: 'Egreso', productId: '5', productName: 'Guantes de Nitrilo Pesado (Par)', sku: 'SEG-0119', quantity: 18, responsible: 'C. Ruiz', reference: 'Pedido Interno · Cuadrilla Mantenimiento', branch: 'Sucursal Centro' },
  { id: 'MOV-9039', date: '17 Abr 2025 · 15:05', type: 'Ajuste', productId: '4', productName: 'Casco de Seguridad Dielectrico', sku: 'SEG-0084', quantity: -2, responsible: 'M. Pereyra', reference: 'Baja por rotura en recepción', branch: 'Sucursal Centro' },
  { id: 'MOV-9038', date: '17 Abr 2025 · 09:20', type: 'Ingreso', productId: '6', productName: 'Llave Térmica Bipolar 2x25A', sku: 'ELE-0334', quantity: 60, responsible: 'A. Silva', reference: 'OC #4409 · ElectroSur Mayorista', branch: 'CD Norte' },
  { id: 'MOV-9037', date: '16 Abr 2025 · 16:50', type: 'Egreso', productId: '10', productName: 'Reflector LED Exterior 100W', sku: 'ELE-0771', quantity: 10, responsible: 'L. Gómez', reference: 'Remito #10879 · Consorcio Libertador', branch: 'Depósito Sur' },
  { id: 'MOV-9036', date: '16 Abr 2025 · 14:10', type: 'Transferencia', productId: '3', productName: 'Pintura Látex Interior 20L', sku: 'PIN-0215', quantity: 12, responsible: 'C. Ruiz', reference: 'Traslado Depósito Central → Depósito Sur', branch: 'Depósito Sur' },
];

export const initialUsers = [
  { id: 'USR-01', name: 'Lucas Gómez', email: 'lgomez@comercialnorte.com.ar', role: 'Jefe de Depósito', branch: 'CD Norte', lastAccess: 'En línea ahora', enabled: true },
  { id: 'USR-02', name: 'Martín Pereyra', email: 'mpereyra@comercialnorte.com.ar', role: 'Supervisor Logístico', branch: 'CD Norte', lastAccess: 'hace 25 min', enabled: true },
  { id: 'USR-03', name: 'Carolina Méndez', email: 'cmendez@comercialnorte.com.ar', role: 'Encargada de Sucursal', branch: 'Sucursal Centro', lastAccess: 'hace 2 h', enabled: true },
  { id: 'USR-04', name: 'Diego Santillán', email: 'dsantillan@comercialnorte.com.ar', role: 'Auditor de Inventario', branch: 'Depósito Sur', lastAccess: 'ayer, 18:40', enabled: true },
  { id: 'USR-05', name: 'Valentina Silva', email: 'vsilva@comercialnorte.com.ar', role: 'Operadora de Recepción', branch: 'CD Norte', lastAccess: 'hace 5 días', enabled: false },
];

export const googleAccounts = [
  {
    name: 'Lucas Gómez',
    email: 'lgomez@comercialnorte.com.ar',
    role: 'Jefe de Depósito · CD Norte',
    initials: 'LG',
  },
  {
    name: 'Carolina Méndez',
    email: 'cmendez@comercialnorte.com.ar',
    role: 'Encargada · Sucursal Centro',
    initials: 'CM',
  },
  {
    name: 'Dirección Operativa',
    email: 'operaciones@comercialnorte.com.ar',
    role: 'Administrador General · Todas las sedes',
    initials: 'DO',
  },
];

export const chartSeriesByBranch = {
  'Todas las sedes': {
    '30d': [
      { label: 'Sem 1', ingresos: 72, egresos: 54 },
      { label: 'Sem 2', ingresos: 58, egresos: 82 },
      { label: 'Sem 3', ingresos: 94, egresos: 65 },
      { label: 'Sem 4', ingresos: 81, egresos: 49 },
      { label: 'Sem 5', ingresos: 66, egresos: 77 },
      { label: 'Actual', ingresos: 88, egresos: 61 },
    ],
    '90d': [
      { label: 'Feb Q1', ingresos: 85, egresos: 62 },
      { label: 'Feb Q2', ingresos: 74, egresos: 79 },
      { label: 'Mar Q1', ingresos: 91, egresos: 71 },
      { label: 'Mar Q2', ingresos: 63, egresos: 58 },
      { label: 'Abr Q1', ingresos: 96, egresos: 69 },
      { label: 'Abr Q2', ingresos: 88, egresos: 61 },
    ],
    '12m': [
      { label: 'Nov', ingresos: 70, egresos: 60 },
      { label: 'Dic', ingresos: 98, egresos: 92 },
      { label: 'Ene', ingresos: 55, egresos: 48 },
      { label: 'Feb', ingresos: 79, egresos: 67 },
      { label: 'Mar', ingresos: 86, egresos: 74 },
      { label: 'Abr', ingresos: 88, egresos: 61 },
    ],
  },
  'CD Norte': {
    '30d': [
      { label: 'Sem 1', ingresos: 84, egresos: 52 },
      { label: 'Sem 2', ingresos: 65, egresos: 74 },
      { label: 'Sem 3', ingresos: 96, egresos: 61 },
      { label: 'Sem 4', ingresos: 79, egresos: 45 },
      { label: 'Sem 5', ingresos: 71, egresos: 68 },
      { label: 'Actual', ingresos: 92, egresos: 57 },
    ],
    '90d': [
      { label: 'Feb Q1', ingresos: 88, egresos: 59 },
      { label: 'Feb Q2', ingresos: 76, egresos: 72 },
      { label: 'Mar Q1', ingresos: 93, egresos: 66 },
      { label: 'Mar Q2', ingresos: 69, egresos: 55 },
      { label: 'Abr Q1', ingresos: 95, egresos: 63 },
      { label: 'Abr Q2', ingresos: 92, egresos: 57 },
    ],
    '12m': [
      { label: 'Nov', ingresos: 76, egresos: 58 },
      { label: 'Dic', ingresos: 99, egresos: 88 },
      { label: 'Ene', ingresos: 62, egresos: 49 },
      { label: 'Feb', ingresos: 83, egresos: 64 },
      { label: 'Mar', ingresos: 89, egresos: 70 },
      { label: 'Abr', ingresos: 92, egresos: 57 },
    ],
  },
  'Sucursal Centro': {
    '30d': [
      { label: 'Sem 1', ingresos: 48, egresos: 62 },
      { label: 'Sem 2', ingresos: 52, egresos: 79 },
      { label: 'Sem 3', ingresos: 64, egresos: 71 },
      { label: 'Sem 4', ingresos: 58, egresos: 55 },
      { label: 'Sem 5', ingresos: 49, egresos: 73 },
      { label: 'Actual', ingresos: 63, egresos: 68 },
    ],
    '90d': [
      { label: 'Feb Q1', ingresos: 55, egresos: 64 },
      { label: 'Feb Q2', ingresos: 49, egresos: 71 },
      { label: 'Mar Q1', ingresos: 61, egresos: 69 },
      { label: 'Mar Q2', ingresos: 52, egresos: 60 },
      { label: 'Abr Q1', ingresos: 66, egresos: 72 },
      { label: 'Abr Q2', ingresos: 63, egresos: 68 },
    ],
    '12m': [
      { label: 'Nov', ingresos: 58, egresos: 62 },
      { label: 'Dic', ingresos: 82, egresos: 90 },
      { label: 'Ene', ingresos: 44, egresos: 46 },
      { label: 'Feb', ingresos: 56, egresos: 65 },
      { label: 'Mar', ingresos: 61, egresos: 70 },
      { label: 'Abr', ingresos: 63, egresos: 68 },
    ],
  },
  'Depósito Sur': {
    '30d': [
      { label: 'Sem 1', ingresos: 61, egresos: 44 },
      { label: 'Sem 2', ingresos: 47, egresos: 58 },
      { label: 'Sem 3', ingresos: 73, egresos: 49 },
      { label: 'Sem 4', ingresos: 69, egresos: 41 },
      { label: 'Sem 5', ingresos: 54, egresos: 63 },
      { label: 'Actual', ingresos: 75, egresos: 52 },
    ],
    '90d': [
      { label: 'Feb Q1', ingresos: 68, egresos: 50 },
      { label: 'Feb Q2', ingresos: 61, egresos: 64 },
      { label: 'Mar Q1', ingresos: 74, egresos: 55 },
      { label: 'Mar Q2', ingresos: 57, egresos: 48 },
      { label: 'Abr Q1', ingresos: 78, egresos: 58 },
      { label: 'Abr Q2', ingresos: 75, egresos: 52 },
    ],
    '12m': [
      { label: 'Nov', ingresos: 60, egresos: 52 },
      { label: 'Dic', ingresos: 85, egresos: 79 },
      { label: 'Ene', ingresos: 48, egresos: 42 },
      { label: 'Feb', ingresos: 67, egresos: 58 },
      { label: 'Mar', ingresos: 72, egresos: 61 },
      { label: 'Abr', ingresos: 75, egresos: 52 },
    ],
  },
};
