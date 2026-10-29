/**
 * @fileoverview Componente de Menú Lateral (Sidebar).
 * Incluye:
 * - Auto-ocultamiento al seleccionar cualquier sección (`data-nav-menu`).
 * - Acceso directo a "Convertir kits / cajas (Proveedores)".
 * - Selector de Apariencia (Modo Claro y Modo Oscuro) justo debajo de Configuración.
 */

import { escapeHtml, stockStatus } from '../core/formatters.js';
import { icon } from '../core/icons.js';

/**
 * Renderiza el menú lateral completo.
 * @param {object} state Estado global de la aplicación.
 * @returns {string} HTML string
 */
export function renderSidebar(state) {
  const { screen, products, movements, theme } = state;

  const lowStockCount = products.filter((p) => stockStatus(p) !== 'En stock').length;
  const kitStockCount = products.filter((p) => p.sku.startsWith('KIT-')).length;

  const mainNav = [
    { id: 'dashboard', label: 'Dashboard', iconName: 'layoutDashboard' },
    {
      id: 'productos',
      label: 'Productos',
      iconName: 'package',
      badge: String(products.length),
      badgeTone: 'neutral',
    },
    {
      id: 'conversion',
      label: 'Convertir kits / cajas',
      iconName: 'boxes',
      badge: 'Proveedores',
      badgeTone: 'accent',
    },
    {
      id: 'movimientos',
      label: 'Movimientos',
      iconName: 'arrowLeftRight',
      badge: String(movements.length),
      badgeTone: 'neutral',
    },
    { id: 'categorias', label: 'Categorías', iconName: 'tags' },
    { id: 'proveedores', label: 'Proveedores', iconName: 'truck' },
    {
      id: 'reportes',
      label: 'Reportes',
      iconName: 'barChart3',
      badge: lowStockCount > 0 ? `${lowStockCount} alertas` : undefined,
      badgeTone: 'warning',
    },
  ];

  const navItemsHtml = mainNav
    .map((item) => {
      const active = screen === item.id;
      return `<button
        type="button"
        class="nav-item ${active ? 'active' : ''}"
        data-action="nav-menu"
        data-screen="${item.id}"
        aria-current="${active ? 'page' : 'false'}"
      >
        ${icon(item.iconName, 18)}
        <span>${escapeHtml(item.label)}</span>
        ${
          item.badge
            ? `<span class="nav-badge ${item.badgeTone ? `tone-${item.badgeTone}` : ''}">${escapeHtml(item.badge)}</span>`
            : ''
        }
      </button>`;
    })
    .join('');

  return `<aside class="sidebar" aria-label="Navegación principal">
    <div class="sidebar-brand">
      <div class="brand-mark" aria-hidden="true">S</div>
      <div class="brand-text">
        <div class="brand-name">Stockia</div>
        <div class="brand-sub">Comercial Norte SRL</div>
      </div>
      <button
        type="button"
        class="sidebar-close-btn"
        data-action="hide-sidebar"
        title="Ocultar menú lateral"
        aria-label="Ocultar menú lateral"
      >
        ${icon('panelLeftClose', 16)}
      </button>
    </div>

    <div class="sidebar-quick-stats">
      <div class="quick-stat-pill">
        <span class="quick-stat-dot ok"></span>
        <span>${products.length} SKUs</span>
      </div>
      <div class="quick-stat-pill">
        <span class="quick-stat-dot warn"></span>
        <span>${kitStockCount} kits prov.</span>
      </div>
    </div>

    <nav class="sidebar-nav">
      <div class="nav-group-label">Operación de almacén</div>
      ${navItemsHtml}

      <div class="nav-group-label">Administración</div>
      <button
        type="button"
        class="nav-item ${screen === 'configuracion' ? 'active' : ''}"
        data-action="nav-menu"
        data-screen="configuracion"
        aria-current="${screen === 'configuracion' ? 'page' : 'false'}"
      >
        ${icon('settings', 18)}
        <span>Configuración</span>
      </button>

      <!-- Selector de Modo Claro / Oscuro debajo de Configuración -->
      <div class="sidebar-theme-box" role="group" aria-label="Selector de tema visual">
        <div class="sidebar-theme-header">
          <span class="sidebar-theme-title">
            ${icon(theme === 'dark' ? 'moon' : 'sun', 14)}
            Apariencia de interfaz
          </span>
          <span class="sidebar-theme-status">${theme === 'dark' ? 'Oscuro' : 'Claro'}</span>
        </div>
        <div class="sidebar-theme-switch">
          <button
            type="button"
            class="theme-option-btn ${theme === 'light' ? 'active' : ''}"
            data-action="set-theme"
            data-theme="light"
            aria-pressed="${theme === 'light'}"
          >
            ${icon('sun', 14)}
            <span>Modo claro</span>
          </button>
          <button
            type="button"
            class="theme-option-btn ${theme === 'dark' ? 'active' : ''}"
            data-action="set-theme"
            data-theme="dark"
            aria-pressed="${theme === 'dark'}"
          >
            ${icon('moon', 14)}
            <span>Modo oscuro</span>
          </button>
        </div>
      </div>

      <button
        type="button"
        class="nav-item"
        data-action="show-help-toast"
      >
        ${icon('circleHelp', 18)}
        <span>Centro de ayuda</span>
        ${icon('chevronRight', 15)}
      </button>
    </nav>

    <div class="sidebar-footer">
      <div class="user-card">
        <div class="user-avatar" aria-hidden="true">LG</div>
        <div class="user-info">
          <div class="user-name">Lucas Gómez</div>
          <div class="user-role">
            ${icon('userCheck', 12)}
            Jefe de Depósito
          </div>
        </div>
        <button
          type="button"
          class="icon-btn"
          title="Cerrar sesión"
          aria-label="Cerrar sesión"
          data-action="logout"
        >
          ${icon('logOut', 16)}
        </button>
      </div>
    </div>
  </aside>`;
}
