/**
 * @fileoverview Vista de Catálogo de Productos (ProductsView).
 * Soporta filtrado multicriterio, ordenamiento dinámico, paginación y menú contextual por fila.
 */

import { renderDataTable } from '../components/DataTable.js';
import { renderStatusBadge } from '../components/StatusBadge.js';
import { escapeHtml, formatCurrency, formatNumber, stockStatus } from '../core/formatters.js';
import { icon } from '../core/icons.js';
import { renderProductIcon } from './DashboardView.js';

/**
 * Renderiza la vista completa del catálogo de productos.
 * @param {object} state Estado global.
 * @returns {string} HTML string
 */
export function renderProductsView(state) {
  const { products, globalSearch, branchLocation, productsViewState: v } = state;
  const pageSize = 8;

  const categories = ['Todas', ...Array.from(new Set(products.map((p) => p.category)))];

  const effectiveQuery = (v.search || globalSearch).trim().toLowerCase();

  const filtered = products
    .filter((p) => {
      const matchBranch = branchLocation === 'Todas las sedes' || p.branch === branchLocation;
      const matchQuery =
        !effectiveQuery ||
        p.name.toLowerCase().includes(effectiveQuery) ||
        p.sku.toLowerCase().includes(effectiveQuery) ||
        p.location.toLowerCase().includes(effectiveQuery);
      const matchCategory = v.category === 'Todas' || p.category === v.category;
      const st = stockStatus(p);
      const matchStatus = v.status === 'Todos' || st === v.status;
      return matchBranch && matchQuery && matchCategory && matchStatus;
    })
    .sort((a, b) => {
      if (v.sortBy === 'stock') return a.stock - b.stock;
      if (v.sortBy === 'price') return b.price - a.price;
      return a.name.localeCompare(b.name);
    });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(v.page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const columns = [
    {
      key: 'product',
      header: 'Artículo',
      render: (p) => `<div class="product-cell">
        <div class="product-thumb">${renderProductIcon(p.icon)}</div>
        <div>
          <div class="product-name">${escapeHtml(p.name)}</div>
          <div class="product-sub">${escapeHtml(p.subtitle)}</div>
        </div>
      </div>`,
    },
    {
      key: 'sku',
      header: 'Código SKU',
      render: (p) => `<span class="sku-code">${escapeHtml(p.sku)}</span>`,
    },
    {
      key: 'category',
      header: 'Rubro / Ubicación',
      render: (p) => `<div>
        <div style="font-weight: 500;">${escapeHtml(p.category)}</div>
        <div style="font-size: 12px; color: var(--text-tertiary);">${escapeHtml(p.location)}</div>
      </div>`,
    },
    {
      key: 'stock',
      header: 'Stock disponible',
      align: 'right',
      render: (p) => {
        const pct = Math.min(100, Math.round((p.stock / Math.max(p.minStock * 2, 1)) * 100));
        const color =
          p.stock === 0 ? 'var(--danger)' : p.stock <= p.minStock ? 'var(--warning)' : 'var(--success)';
        return `<div class="stock-cell" style="align-items: flex-end;">
          <div class="stock-num tabular">
            ${formatNumber(p.stock)} <span style="color: var(--text-tertiary); font-weight: 400;">/ mín. ${p.minStock} ${escapeHtml(p.unit)}</span>
          </div>
          <div class="stock-bar-track">
            <div class="stock-bar-fill" style="width: ${pct}%; background: ${color};"></div>
          </div>
        </div>`;
      },
    },
    {
      key: 'cost',
      header: 'Costo / Venta',
      align: 'right',
      render: (p) => `<div>
        <div class="tabular" style="font-weight: 600;">${formatCurrency(p.price)}</div>
        <div class="tabular" style="font-size: 11.5px; color: var(--text-tertiary);">
          Costo: ${formatCurrency(p.cost)}
        </div>
      </div>`,
    },
    {
      key: 'status',
      header: 'Estado',
      render: (p) => renderStatusBadge(stockStatus(p)),
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: (p) => `<div class="row-actions-wrap">
        <button
          type="button"
          class="icon-btn"
          style="width: 30px; height: 30px;"
          aria-label="Acciones para ${escapeHtml(p.name)}"
          data-action="toggle-product-row-menu"
          data-product-id="${escapeHtml(p.id)}"
        >
          ${icon('ellipsis', 16)}
        </button>
        ${
          v.menuRowId === p.id
            ? `<div class="row-menu" role="menu">
                <button
                  type="button"
                  data-action="edit-product"
                  data-product-id="${escapeHtml(p.id)}"
                >
                  Editar ficha y precios
                </button>
                <button
                  type="button"
                  class="danger"
                  data-action="delete-product"
                  data-product-id="${escapeHtml(p.id)}"
                >
                  Eliminar del catálogo
                </button>
              </div>`
            : ''
        }
      </div>`,
    },
  ];

  const pageButtonsHtml = Array.from({ length: totalPages }, (_, idx) => idx + 1)
    .map(
      (n) =>
        `<button
          type="button"
          class="page-btn ${n === currentPage ? 'active' : ''}"
          data-action="set-products-page"
          data-page="${n}"
        >${n}</button>`
    )
    .join('');

  return `<div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Catálogo de productos</h1>
        <p class="page-subtitle">
          Administrá costos, precios de lista, ubicaciones físicas y niveles mínimos de reposición.
        </p>
      </div>
      <div class="page-actions">
        <button
          type="button"
          class="btn btn-secondary"
          data-action="export-products-csv"
        >
          ${icon('download', 15)}
          <span>Exportar CSV</span>
        </button>
        <button
          type="button"
          class="btn btn-secondary"
          data-action="open-import-drawer"
        >
          ${icon('upload', 15)}
          <span>Importar lote</span>
        </button>
        <button
          type="button"
          class="btn btn-primary"
          data-action="new-product"
        >
          ${icon('plus', 16)}
          <span>Agregar producto</span>
        </button>
      </div>
    </div>

    <section class="panel">
      <div class="toolbar">
        <div class="toolbar-left">
          <div style="position: relative; width: 260px;">
            <span style="position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: var(--text-tertiary); display: inline-flex;">
              ${icon('search', 15)}
            </span>
            <input
              id="products-search-input"
              class="input"
              style="padding-left: 32px;"
              value="${escapeHtml(v.search)}"
              placeholder="Filtrar por nombre, SKU o pasillo..."
              aria-label="Filtrar productos"
              data-input="products-search"
            />
          </div>

          <select
            class="select"
            aria-label="Categoría"
            data-action="set-products-category"
          >
            ${categories
              .map(
                (c) =>
                  `<option value="${escapeHtml(c)}" ${
                    v.category === c ? 'selected' : ''
                  }>${c === 'Todas' ? 'Todas las categorías' : escapeHtml(c)}</option>`
              )
              .join('')}
          </select>

          <select
            class="select"
            aria-label="Estado de stock"
            data-action="set-products-status"
          >
            <option value="Todos" ${v.status === 'Todos' ? 'selected' : ''}>Todos los estados</option>
            <option value="En stock" ${v.status === 'En stock' ? 'selected' : ''}>En stock</option>
            <option value="Stock bajo" ${v.status === 'Stock bajo' ? 'selected' : ''}>Stock bajo</option>
            <option value="Sin stock" ${v.status === 'Sin stock' ? 'selected' : ''}>Sin stock</option>
          </select>
        </div>

        <div class="toolbar-right">
          <span style="font-size: 12.5px; color: var(--text-secondary);">Ordenar por:</span>
          <select
            class="select"
            aria-label="Ordenar productos"
            data-action="set-products-sort"
          >
            <option value="name" ${v.sortBy === 'name' ? 'selected' : ''}>Nombre (A-Z)</option>
            <option value="stock" ${v.sortBy === 'stock' ? 'selected' : ''}>Menor stock primero</option>
            <option value="price" ${v.sortBy === 'price' ? 'selected' : ''}>Mayor precio unitario</option>
          </select>
        </div>
      </div>

      ${renderDataTable({
        columns,
        rows: paginated,
        emptyActionAction: 'reset-products-filters',
      })}

      <div class="table-footer">
        <span>
          Mostrando <strong>${paginated.length}</strong> de <strong>${filtered.length}</strong> artículos
        </span>
        <div class="pagination">
          <button
            type="button"
            class="page-btn"
            data-action="set-products-page"
            data-page="${Math.max(1, currentPage - 1)}"
            ${currentPage === 1 ? 'disabled' : ''}
          >
            Anterior
          </button>
          ${pageButtonsHtml}
          <button
            type="button"
            class="page-btn"
            data-action="set-products-page"
            data-page="${Math.min(totalPages, currentPage + 1)}"
            ${currentPage === totalPages ? 'disabled' : ''}
          >
            Siguiente
          </button>
        </div>
      </div>
    </section>
  </div>`;
}
