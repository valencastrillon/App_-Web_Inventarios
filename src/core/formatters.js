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
export function parseCsvProducts(text, defaultBranch = 'CD Norte') {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length <= 1) return [];

  const delimiter = lines[0].includes(';') ? ';' : ',';
  return lines.slice(1).map((line, index) => {
    const cols = line.split(delimiter).map((col) => col.trim());
    return {
      name: cols[0] || `Artículo importado ${index + 1}`,
      subtitle: cols[1] || 'Importado por lote CSV',
      sku: (cols[2] || `IMP-${100 + index}`).toUpperCase(),
      category: cols[3] || 'Ferretería',
      stock: Number(cols[4]) || 0,
      minStock: Number(cols[5]) || 10,
      unit: cols[6] || 'unid.',
      cost: Number(cols[7]) || 0,
      price: Number(cols[8]) || 0,
      location: cols[9] || 'Depósito Central · Pasillo A-1',
      branch: cols[10] || defaultBranch,
      icon: 'wrench',
    };
  });
}
