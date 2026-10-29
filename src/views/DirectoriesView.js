/**
 * @fileoverview Vistas de Directorios Maestros:
 * - Categorías y Ubicaciones (`renderCategoriesView`)
 */

import { escapeHtml, formatCurrency, formatNumber } from '../core/formatters.js';
import { icon } from '../core/icons.js';

/**
 * Renderiza la vista de Categorías y Ubicaciones de almacén.
 * @param {object} state Estado global.
 * @returns {string} HTML string
 */
export function renderCategoriesView(state) {
  const { categories, products } = state;

  const cardsHtml = categories
    .map((cat) => {
      const items = products.filter((p) => p.category === cat.name);
      const units = items.reduce((acc, p) => acc + p.stock, 0);
      const value = items.reduce((acc, p) => acc + p.stock * p.cost, 0);

      return `<article class="entity-card">
        <div class="entity-head">
          <div style="display: flex; align-items: center; gap: 10px;">
            <div class="kpi-icon tone-blue">${icon('tags', 18)}</div>
            <div>
              <div class="entity-title">${escapeHtml(cat.name)}</div>
              <div class="entity-sub">Prefijo SKU: ${escapeHtml(cat.code)}</div>
            </div>
          </div>
          <span class="badge badge-info">Margen ${cat.targetMargin}%</span>
        </div>

        <p style="font-size: 12.5px; color: var(--text-secondary); line-height: 1.45;">
          ${escapeHtml(cat.description)}
        </p>

        <div class="entity-meta">
          <div style="display: flex; align-items: center; gap: 6px;">
            ${icon('mapPin', 13)}
            <span>${escapeHtml(cat.location)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding-top: 6px; border-top: 1px solid var(--border); color: var(--text-primary); font-weight: 600;">
            <span>${items.length} productos (${formatNumber(units)} u.)</span>
            <span class="tabular">${formatCurrency(value)}</span>
          </div>
        </div>
      </article>`;
    })
    .join('');

  return `<div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Categorías y sectores</h1>
        <p class="page-subtitle">
          Estructura de rubros, márgenes comerciales objetivo y asignación de pasillos físicos.
        </p>
      </div>
      <div class="page-actions">
        <button
          type="button"
          class="btn btn-primary"
          data-action="open-category-drawer"
        >
          ${icon('plus', 16)}
          <span>Nueva categoría</span>
        </button>
      </div>
    </div>

    <div class="cards-grid">${cardsHtml}</div>
  </div>`;
}
