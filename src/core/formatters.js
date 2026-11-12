/**
 * @fileoverview Utilidades de formateo numérico, monetario, sanitización HTML,
 * cálculo de estado de stock y parseador CSV para importación masiva.
 */

const numberFormatter = new Intl.NumberFormat('es-AR');

const currencyFormatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
});

/**
 * Formatea un número con separador de miles en formato es-AR.
 * @param {number} n
 * @returns {string}
 */
export function formatNumber(n) {
  return numberFormatter.format(Number(n) || 0);
}

/**
 * Formatea un monto en Pesos Argentinos ($ ARS) sin decimales.
 * @param {number} n
 * @returns {string}
 */
export function formatCurrency(n) {
  return currencyFormatter.format(Number(n) || 0);
}

/**
 * Determina el estado operativo de stock de un producto en relación con su mínimo.
 * @param {{ stock: number, minStock: number }} product
 * @returns {'En stock' | 'Stock bajo' | 'Sin stock'}
 */
export function stockStatus(product) {
  if (product.stock <= 0) return 'Sin stock';
  if (product.stock <= product.minStock) return 'Stock bajo';
  return 'En stock';
}

/**
 * Sanitiza texto dinámico para prevenir inyección HTML (XSS) en templates.
 * @param {unknown} value
 * @returns {string}
 */
export function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Lee un parámetro inicial de la URL actual (`?screen=...`, `?theme=...`, etc.).
 * @param {string} key
 * @returns {string | null}
 */
export function getInitialParam(key) {
  if (typeof window === 'undefined') return null;
  return new URLSearchParams(window.location.search).get(key);
}

/**
 * Parsea un contenido CSV o separado por punto y coma y devuelve productos listos para importar.
 * @param {string} text Contenido plano del archivo CSV.
 * @param {string} defaultBranch Sucursal por defecto cuando no viene especificada.
 * @returns {Array<object>}
 */
const REQUIRED_BULK_COLUMNS = ['nombre', 'sku', 'stock', 'costo', 'sede'];
const COLUMN_ALIASES = { producto: 'nombre', 'nombre del producto': 'nombre', name: 'nombre', descripcion: 'subtitulo', categoría: 'categoria', category: 'categoria', 'stock mínimo': 'stock_minimo', minimo: 'stock_minimo', minstock: 'stock_minimo', cost: 'costo', price: 'precio', location: 'ubicacion', branch: 'sede' };

function normalizeColumn(value) {
  const key = String(value || '').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return COLUMN_ALIASES[key] || key.replace(/\s+/g, '_');
}

function splitCsvLine(line, delimiter) {
  const result = []; let current = ''; let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"' && line[i + 1] === '"') { current += '"'; i += 1; }
    else if (char === '"') quoted = !quoted;
    else if (char === delimiter && !quoted) { result.push(current.trim()); current = ''; }
    else current += char;
  }
  result.push(current.trim());
  return result;
}

function parseRows(rows, branches = [], defaultBranch = 'CD Norte') {
  const headers = rows[0].map(normalizeColumn);
  const missing = REQUIRED_BULK_COLUMNS.filter((column) => !headers.includes(column));
  if (missing.length) return { products: [], errors: [], columnsError: `Faltan: ${missing.join(', ')}.`, stats: { totalRows: 0, validRows: 0, invalidRows: 0, totalUnits: 0, totalValuation: 0 } };
  const branchNames = branches.filter((branch) => branch.id !== 'all').map((branch) => branch.name);
  const products = []; const errors = [];
  rows.slice(1).forEach((values, index) => {
    if (values.every((value) => !String(value).trim())) return;
    const row = Object.fromEntries(headers.map((header, col) => [header, String(values[col] ?? '').trim()]));
    const messages = []; const stock = Number(row.stock); const cost = Number(row.costo); const minStock = row.stock_minimo === '' ? 0 : Number(row.stock_minimo); const price = row.precio === '' ? 0 : Number(row.precio);
    if (!row.nombre) messages.push('nombre vacío');
    if (!row.sku) messages.push('SKU vacío');
    if (row.stock === '' || !Number.isFinite(stock) || stock < 0) messages.push('stock inválido');
    if (row.costo === '' || !Number.isFinite(cost) || cost < 0) messages.push('costo inválido');
    if (row.stock_minimo !== '' && (!Number.isFinite(minStock) || minStock < 0)) messages.push('stock mínimo inválido');
    if (row.precio !== '' && (!Number.isFinite(price) || price < 0)) messages.push('precio inválido');
    if (!row.sede) messages.push('sede vacía');
    else if (branchNames.length && !branchNames.includes(row.sede)) messages.push(`sede inexistente: ${row.sede}`);
    if (messages.length) errors.push({ row: index + 2, messages });
    else products.push({ rowNumber: index + 2, name: row.nombre, subtitle: row.subtitulo || 'Importado por lote', sku: row.sku.toUpperCase(), category: row.categoria || 'Ferretería', stock, minStock: Number.isFinite(minStock) ? minStock : 0, unit: row.unidad || 'unid.', cost, price, location: row.ubicacion || 'Depósito Central', branch: row.sede || defaultBranch });
  });
  return { products, errors, columnsError: '', stats: { totalRows: rows.length - 1, validRows: products.length, invalidRows: errors.length, totalUnits: products.reduce((sum, row) => sum + row.stock, 0), totalValuation: products.reduce((sum, row) => sum + row.stock * row.cost, 0) } };
}

export function parseCsvProducts(text, defaultBranch = 'CD Norte') {
  const lines = text.split(/\r?\n/).filter((line) => line.trim());
  if (lines.length < 2) return [];
  const delimiter = lines[0].includes(';') ? ';' : ',';
  return parseRows(lines.map((line) => splitCsvLine(line, delimiter)), [], defaultBranch).products;
}

export function parseBulkCsv(text, branches, defaultBranch = 'CD Norte') {
  const lines = text.split(/\r?\n/).filter((line) => line.trim());
  if (lines.length < 2) return { products: [], errors: [], columnsError: 'El archivo debe incluir encabezado y al menos una fila.', stats: { totalRows: 0, validRows: 0, invalidRows: 0, totalUnits: 0, totalValuation: 0 } };
  const delimiter = lines[0].includes(';') ? ';' : ',';
  return parseRows(lines.map((line) => splitCsvLine(line, delimiter)), branches, defaultBranch);
}

async function unzipXlsx(buffer) {
  const view = new DataView(buffer); const decoder = new TextDecoder(); const files = {};
  for (let offset = 0; offset < view.byteLength - 30;) {
    if (view.getUint32(offset, true) !== 0x04034b50) { offset += 1; continue; }
    const method = view.getUint16(offset + 8, true); const compressedSize = view.getUint32(offset + 18, true); const nameSize = view.getUint16(offset + 26, true); const extraSize = view.getUint16(offset + 28, true); const name = decoder.decode(new Uint8Array(buffer, offset + 30, nameSize)); const start = offset + 30 + nameSize + extraSize; const raw = new Uint8Array(buffer, start, compressedSize);
    let data = raw; if (method === 8) { const stream = new Blob([raw]).stream().pipeThrough(new DecompressionStream('deflate-raw')); data = new Uint8Array(await new Response(stream).arrayBuffer()); }
    files[name] = decoder.decode(data); offset = start + compressedSize;
  }
  const shared = files['xl/sharedStrings.xml'] ? [...files['xl/sharedStrings.xml'].matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map((match) => match[1].replace(/&amp;/g, '&').replace(/&lt;/g, '<')) : [];
  const sheet = files['xl/worksheets/sheet1.xml'] || ''; return [...sheet.matchAll(/<row[^>]*>([\s\S]*?)<\/row>/g)].map((row) => [...row[1].matchAll(/<c([^>]*)>(?:<v>([\s\S]*?)<\/v>)?/g)].map((cell) => { const value = cell[2] || ''; return /t="s"/.test(cell[1]) ? shared[Number(value)] || '' : value; }));
}

export async function parseBulkFile(file, branches, defaultBranch = 'CD Norte') {
  const isCsv = /\.csv$/i.test(file.name) || file.type === 'text/csv';
  if (isCsv) return parseBulkCsv(await file.text(), branches, defaultBranch);
  const rows = await unzipXlsx(await file.arrayBuffer()); return parseRows(rows, branches, defaultBranch);
}
