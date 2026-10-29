/**
 * @fileoverview Barra Superior (Header / Topbar) con selector de
 * Sedes/Sucursales y alertas críticas.
 */

import { escapeHtml, stockStatus } from '../core/formatters.js';
import { icon } from '../core/icons.js';

const SCREEN_TITLES = {
  dashboard: 'Resumen general',
  productos: 'Catálogo de productos',
  conversion: 'Conversión de kits y cajas',
  movimientos: 'Movimientos de stock',
  categorias: 'Categorías y ubicaciones',
  reportes: 'Reportes y analítica',
  configuracion: 'Configuración del sistema',
};

/**
 * Renderiza la barra superior de la aplicación.
 * @param {object} state Estado global de la aplicación.
 * @returns {string} HTML string
 */
export function renderHeader(state) {
  const { screen, branchLocation, branches, products, theme, branchMenuOpen } = state;

  const lowStockCount = products.filter((p) => stockStatus(p) !== 'En stock').length;
  const currentBranch = branches.find((b) => b.name === branchLocation) || branches[0];

  const branchDropdownHtml = branchMenuOpen
    ? `<div class="branch-dropdown-panel" role="listbox" aria-label="Sedes de Comercial Norte SRL">
        <div class="branch-dropdown-head">
          <div>
            <div class="branch-dropdown-title">Sedes de Comercial Norte SRL</div>
            <div class="branch-dropdown-sub">Filtrar inventario o auditar sucursal</div>
          </div>
          <button
            type="button"
            class="btn btn-ghost btn-sm"
            data-action="open-branches-drawer"
          >
            Ver detalle
          </button>
        </div>
        <div class="branch-dropdown-list">
          ${branches
            .map((b) => {
              const active = b.name === branchLocation;
              return `<button
                type="button"
                class="branch-dropdown-item ${active ? 'active' : ''}"
                data-action="select-branch"
                data-branch="${escapeHtml(b.name)}"
              >
                <div class="branch-item-icon">${icon('building2', 15)}</div>
                <div class="branch-item-info">
                  <div class="branch-item-name">
                    ${escapeHtml(b.name)}
                    <span class="branch-item-city">${escapeHtml(b.city)}</span>
                  </div>
                  <div class="branch-item-meta">${escapeHtml(b.address)} · ${b.warehouses} dep.</div>
                </div>
                <div class="branch-item-right">
                  <span class="branch-occ-pill">${b.occupancy}% ocup.</span>
                  ${active ? icon('check', 15) : ''}
                </div>
              </button>`;
            })
            .join('')}
        </div>
        <div class="branch-dropdown-foot">
          <button
            type="button"
            class="btn btn-secondary btn-sm"
            style="width: 100%; justify-content: center;"
            data-action="open-branches-drawer"
          >
            ${icon('mapPin', 14)}
            Administrar Sedes y Sucursales (${branches.length - 1} activas)
          </button>
        </div>
      </div>`
    : '';

  return `<header class="topbar">
    <div class="breadcrumbs">
      <button
        type="button"
        class="branch-Select-trigger"
        data-action="open-branches-drawer"
        title="Ver todas las Sedes y Sucursales de Comercial Norte SRL"
      >
        ${icon('building2', 14)}
        <span>Sedes / Sucursales</span>
      </button>
      ${icon('chevronRight', 14)}
      <div class="branch-dropdown-wrap">
        <button
          type="button"
          class="branch-active-pill"
          data-action="toggle-branch-menu"
          aria-expanded="${branchMenuOpen}"
          aria-label="Seleccionar sede o sucursal"
        >
          <span class="branch-dot"></span>
          <span>${escapeHtml(branchLocation)}</span>
          <span class="branch-city-tag">${escapeHtml(currentBranch.city)}</span>
        </button>
        ${branchDropdownHtml}
      </div>
      ${icon('chevronRight', 14)}
      <strong>${escapeHtml(SCREEN_TITLES[screen] || 'Dashboard')}</strong>
    </div>

    <div class="topbar-actions">
      <button
        type="button"
        class="icon-btn"
        aria-label="Cambiar entre modo claro y oscuro"
        title="${theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}"
        data-action="toggle-theme"
      >
        ${icon(theme === 'dark' ? 'sun' : 'moon', 18)}
      </button>

      <button
        type="button"
        class="icon-btn"
        aria-label="Ver alertas de stock crítico (${lowStockCount})"
        title="${lowStockCount} productos requieren reposición"
        data-action="open-alerts"
      >
        ${icon('bell', 18)}
        ${lowStockCount > 0 ? '<span class="notif-dot"></span>' : ''}
      </button>

      <button
        type="button"
        class="btn btn-secondary"
        data-action="open-import-drawer"
        title="Subir productos masivamente por tabla o CSV"
      >
        ${icon('upload', 16)}
        <span>Carga masiva</span>
      </button>

      <button
        type="button"
        class="btn btn-primary"
        data-action="new-product"
      >
        ${icon('plus', 16)}
        <span>Nuevo producto</span>
      </button>
    </div>
  </header>`;
}
