/**
 * @fileoverview Componente de Tarjeta de Indicador Clave (KPI Card).
 */

import { escapeHtml } from '../core/formatters.js';

/**
 * Renderiza una tarjeta KPI ejecutiva con ícono, valor tabular, badge de variación y pie descriptivo.
 * @param {{
 *   label: string,
 *   value: string,
 *   delta: string,
 *   deltaTone?: 'up' | 'down' | 'warn',
 *   footnote: string,
 *   iconHtml: string,
 *   tone?: 'blue' | 'amber' | 'green' | 'red'
 * }} props
 * @returns {string} HTML string
 */
export function renderKpiCard({
  label,
  value,
  delta,
  deltaTone = 'up',
  footnote,
  iconHtml,
  tone = 'blue',
}) {
  const deltaClass =
    deltaTone === 'up' ? 'delta-up' : deltaTone === 'down' ? 'delta-down' : 'delta-warn';

  return `<article class="kpi-card">
    <div class="kpi-top">
      <span class="kpi-label">${escapeHtml(label)}</span>
      <div class="kpi-icon tone-${tone}" aria-hidden="true">${iconHtml}</div>
    </div>
    <div class="kpi-value tabular">${escapeHtml(value)}</div>
    <div class="kpi-foot">
      <span class="kpi-delta ${deltaClass}">${escapeHtml(delta)}</span>
      <span>${escapeHtml(footnote)}</span>
    </div>
  </article>`;
}
