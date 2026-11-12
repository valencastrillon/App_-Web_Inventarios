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
  const { screen, branchLocation, branches, products, theme, branchMenuOpen, apiConnection } = state;

  const lowStockCount = products.filter((p) => stockStatus(p) !== 'En stock').length;
  const currentBranch = branches.find((b) => b.name === branchLocation) || branches[0];

  // Cálculo del estado visual de conexión
  const conn = apiConnection || { backendOnline: false, supabaseOnline: false, activeSource: 'local' };
  let statusClass = 'status-local';
  let statusText = 'Modo Local';
  let statusTitle = 'Operando con almacenamiento local. Hacé clic para reintentar conexión con API :4000 y Supabase';

  if (conn.backendOnline) {
    statusClass = 'status-backend';
    statusText = `API :4000 · ${conn.backendLatency || 12}ms`;
    statusTitle = `Conectado al Backend Local en http://localhost:4000 (${conn.backendLatency}ms)`;
  } else if (conn.supabaseOnline) {
    statusClass = 'status-supabase';
    statusText = `Supabase Cloud · ${conn.supabaseLatency || 45}ms`;
    statusTitle = `Conectado a Supabase PostgreSQL Cloud (${conn.supabaseLatency}ms)`;
  }

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
                <div class="branch-item-info">
                  <div class="branch-item-name">
                    ${escapeHtml(b.name)}
                    <span class="branch-item-city">${escapeHtml(b.city)}</span>
                  </div>
                  <div class="branch-item-meta">${escapeHtml(b.address)} · ${b.warehouses} dep.</div>
                </div>
                <div class="branch-item-right">
                  <span class="branch-occ-pill">${b.occupancy}% ocup.</span>
                  ${active ? 'Sede activa' : ''}
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
            Administrar Sedes y Sucursales (${branches.length - 1} activas)
          </button>
        </div>
      </div>`
    : '';

  return `<header class="topbar">
    <div class="breadcrumbs">
      <div class="breadcrumbs-meta">
        <button
          type="button"
          class="branch-Select-trigger"
          data-action="open-branches-drawer"
          title="Ver todas las Sedes y Sucursales de Comercial Norte SRL"
        >
          <span>Sedes / Sucursales</span>
        </button>
        <span class="breadcrumbs-sep">/</span>
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
      </div>
      <h2 class="breadcrumbs-screen-title">${escapeHtml(SCREEN_TITLES[screen] || 'Dashboard')}</h2>
    </div>

    <div class="topbar-actions">
      <!-- Indicador de Conectividad de Endpoints (Backend REST / Supabase) -->
      <button
        type="button"
        class="api-status-pill ${statusClass}"
        data-action="check-endpoints"
        title="${escapeHtml(statusTitle)}"
        aria-label="Estado de conexión del sistema"
      >
        <span class="api-status-dot"></span>
        <span class="api-status-label">${escapeHtml(statusText)}</span>
      </button>

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
        title="Subir productos masivamente por CSV o Excel"
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
