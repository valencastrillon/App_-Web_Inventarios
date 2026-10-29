/**
 * @fileoverview Componente de Etiqueta de Estado (StatusBadge) para stock y movimientos.
 */

import { escapeHtml } from '../core/formatters.js';

const TONE_MAP = {
  'En stock': 'badge-success',
  'Stock bajo': 'badge-warning',
  'Sin stock': 'badge-danger',
  Ingreso: 'badge-success',
  Egreso: 'badge-danger',
  Ajuste: 'badge-warning',
  Transferencia: 'badge-info',
};

/**
 * Renderiza un badge semántico con punto indicador.
 * @param {string} status
 * @returns {string} HTML string
 */
export function renderStatusBadge(status) {
  const toneClass = TONE_MAP[status] || 'badge-neutral';
  return `<span class="badge ${toneClass}">
    <span class="badge-dot"></span>
    ${escapeHtml(status)}
  </span>`;
}
