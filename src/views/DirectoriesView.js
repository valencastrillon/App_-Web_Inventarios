/**
 * @fileoverview Vistas de Directorios Maestros:
 * - Categorías y Ubicaciones (`renderCategoriesView`)
 * - Directorio de Proveedores Homologados (`renderSuppliersView`)
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

/**
 * Renderiza la vista de Directorio de Proveedores homologados.
 * @param {object} state Estado global.
 * @returns {string} HTML string
 */
export function renderSuppliersView(state) {
  const { suppliers } = state;

  const cardsHtml = suppliers
    .map(
      (s) => `<article class="entity-card">
        <div class="entity-head">
          <div style="display: flex; align-items: center; gap: 10px;">
            <div class="kpi-icon tone-green">${icon('truck', 18)}</div>
            <div>
              <div class="entity-title">${escapeHtml(s.name)}</div>
              <div class="entity-sub">CUIT ${escapeHtml(s.cuit)} · Rubro ${escapeHtml(s.category)}</div>
            </div>
          </div>
          <button
            type="button"
            class="badge ${s.active ? 'badge-success' : 'badge-neutral'}"
            style="cursor: pointer;"
            title="Clic para alternar estado activo"
            data-action="toggle-supplier-active"
            data-supplier-id="${escapeHtml(s.id)}"
          >
            <span class="badge-dot"></span>
            ${s.active ? 'Activo' : 'Pausado'}
          </button>
        </div>

        <div class="entity-meta">
          <div style="display: flex; align-items: center; gap: 8px;">
            ${icon('mail', 13)}
            <span>${escapeHtml(s.contact)} · ${escapeHtml(s.email)}</span>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            ${icon('phone', 13)}
            <span>${escapeHtml(s.phone)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 8px; border-top: 1px solid var(--border);">
            <span style="display: inline-flex; align-items: center; gap: 5px; font-weight: 600; color: var(--text-primary);">
              ${icon('clock3', 13)} Lead time: ${s.leadTimeDays} días
            </span>
            <span class="sku-code">SLA ★ ${s.rating.toFixed(1)}</span>
          </div>
        </div>
      </article>`
    )
    .join('');

  return `<div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Proveedores homologados</h1>
        <p class="page-subtitle">
          Directorio de abastecimiento, tiempos de entrega promedio (Lead Time) y contactos comerciales.
        </p>
      </div>
      <div class="page-actions">
        <button
          type="button"
          class="btn btn-primary"
          data-action="open-supplier-drawer"
        >
          ${icon('plus', 16)}
          <span>Nuevo proveedor</span>
        </button>
      </div>
    </div>

    <div class="cards-grid">${cardsHtml}</div>
  </div>`;
}
