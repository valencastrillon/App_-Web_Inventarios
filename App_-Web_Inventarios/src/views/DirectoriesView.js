/**
 * @fileoverview Vistas de Directorios Maestros:
 * - Categorías y Ubicaciones (`renderCategoriesView`)
 */

import { escapeHtml, formatCurrency, formatNumber } from '../core/formatters.js';

/**
 * Renderiza la vista de Categorías y Ubicaciones de almacén.
 * @param {object} state Estado global.
 * @returns {string} HTML string
 */
export function renderCategoriesView(state) {
  const { categories, products } = state;

  const cardsHtml = categories.map((category) => {
    const items = products.filter((product) => product.category === category.name);
    const locations = [...new Set(items.map((product) => product.location))];
    const totalUnits = items.reduce((sum, product) => sum + product.stock, 0);
    const totalValue = items.reduce((sum, product) => sum + product.stock * product.cost, 0);
    const locationGroups = locations.map((location) => {
      const locationItems = items.filter((product) => product.location === location);
      const units = locationItems.reduce((sum, product) => sum + product.stock, 0);
      const value = locationItems.reduce((sum, product) => sum + product.stock * product.cost, 0);
      return `<section class="category-location-group">
        <div class="category-location-head">
          <div>
            <div class="category-location-title">${escapeHtml(location)}</div>
            <div class="category-location-count">${locationItems.length} productos · ${formatNumber(units)} unidades</div>
          </div>
          <strong class="tabular">${formatCurrency(value)}</strong>
        </div>
        <div class="category-product-list">
          ${locationItems.map((product) => `<div class="category-product-row">
            <span class="category-product-name">${escapeHtml(product.name)}</span>
            <span class="category-product-units tabular">${formatNumber(product.stock)} ${escapeHtml(product.unit)}</span>
            <span class="category-product-value tabular">${formatCurrency(product.stock * product.cost)}</span>
          </div>`).join('')}
        </div>
      </section>`;
    }).join('');

    return `<article class="category-card">
      <header class="category-card-header">
        <div class="category-card-heading">
          <h2 class="category-card-title">${escapeHtml(category.name)}</h2>
          <span class="category-chip">SKU ${escapeHtml(category.code)}</span>
          <span class="category-chip">Margen ${category.targetMargin}%</span>
        </div>
        <div class="category-card-summary">${items.length} productos · ${formatNumber(totalUnits)} unidades · <strong class="tabular">${formatCurrency(totalValue)}</strong></div>
        <p class="category-card-description">${escapeHtml(category.description)}</p>
      </header>
      <div class="category-location-list">${locationGroups}</div>
    </article>`;
  }).join('');

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
          Nueva categoría
        </button>
      </div>
    </div>

    <div class="category-card-list">${cardsHtml}</div>
  </div>`;
}
