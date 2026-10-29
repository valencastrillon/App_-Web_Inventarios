/**
 * @fileoverview Vista Principal de Dashboard (DashboardView).
 * Presenta el resumen consolidado de todas las sedes de Comercial Norte SRL por defecto,
 * y cuenta con un filtro interactivo para inspeccionar sucursales de manera individual.
 */

import { renderDataTable } from '../components/DataTable.js';
import { renderKpiCard } from '../components/KpiCard.js';
import { renderStatusBadge } from '../components/StatusBadge.js';
import { escapeHtml, formatCurrency, formatNumber, stockStatus } from '../core/formatters.js';
import { icon } from '../core/icons.js';
import { chartSeriesByBranch } from '../data/mockData.js';

/**
 * Renderiza la vista de Dashboard con KPIs, comparativa de sedes, gráfico de flujo y tabla de alertas.
 * @param {object} state Estado global.
 * @returns {string} HTML string
 */
export function renderDashboardView(state) {
  const {
    products,
    movements,
    branches,
    branchLocation,
    dashboardState,
  } = state;
  const { period, categoryFilter, statusFilter } = dashboardState;

  const isAllBranches = branchLocation === 'Todas las sedes';
  const operationalBranches = branches.filter((b) => b.id !== 'all');
  const activeBranchInfo = branches.find((b) => b.name === branchLocation) || branches[0];

  const branchProducts = isAllBranches
    ? products
    : products.filter((p) => p.branch === branchLocation);

  const branchMovements = isAllBranches
    ? movements
    : movements.filter((m) => m.branch === branchLocation);

  const totalUnits = branchProducts.reduce((acc, p) => acc + p.stock, 0);
  const totalValuation = branchProducts.reduce((acc, p) => acc + p.stock * p.cost, 0);
  const lowStockItems = branchProducts.filter((p) => stockStatus(p) !== 'En stock');
  const outOfStockCount = branchProducts.filter((p) => p.stock === 0).length;

  const branchBreakdown = operationalBranches.map((b) => {
    const items = products.filter((p) => p.branch === b.name);
    const units = items.reduce((acc, p) => acc + p.stock, 0);
    const value = items.reduce((acc, p) => acc + p.stock * p.cost, 0);
    const alerts = items.filter((p) => stockStatus(p) !== 'En stock').length;
    return {
      ...b,
      skuCount: items.length,
      units,
      value,
      alerts,
    };
  });

  const categories = ['Todas', ...Array.from(new Set(products.map((p) => p.category)))];

  const filteredProducts = branchProducts.filter((p) => {
    const matchesSearch = true;
    const matchesCategory = categoryFilter === 'Todas' || p.category === categoryFilter;
    const status = stockStatus(p);
    const matchesStatus = statusFilter === 'Todos' || status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const branchSeries =
    chartSeriesByBranch[branchLocation] || chartSeriesByBranch['Todas las sedes'];
  const bars = branchSeries[period] || branchSeries['30d'];

  const columns = [
    {
      key: 'product',
      header: 'Producto',
      render: (p) => `<div class="product-cell">
        <div>
          <div class="product-name">${escapeHtml(p.name)}</div>
          <div class="product-sub">${escapeHtml(p.subtitle)} · ${escapeHtml(p.location)}</div>
        </div>
      </div>`,
    },
    {
      key: 'sku',
      header: 'SKU',
      render: (p) => `<span class="sku-code">${escapeHtml(p.sku)}</span>`,
    },
    {
      key: 'branch',
      header: 'Sede / Sucursal',
      render: (p) => `<span class="branch-table-tag">${escapeHtml(p.branch)}</span>`,
    },
    {
      key: 'category',
      header: 'Categoría',
      render: (p) => escapeHtml(p.category),
    },
    {
      key: 'stock',
      header: 'Existencia',
      align: 'right',
      render: (p) => {
        const pct = Math.min(100, Math.round((p.stock / Math.max(p.minStock * 2, 1)) * 100));
        const color =
          p.stock === 0 ? 'var(--danger)' : p.stock <= p.minStock ? 'var(--warning)' : 'var(--success)';
        return `<div class="stock-cell" style="align-items: flex-end;">
          <div class="stock-num tabular">
            ${formatNumber(p.stock)} <span style="color: var(--text-tertiary); font-weight: 400;">${escapeHtml(p.unit)}</span>
          </div>
          <div class="stock-bar-track">
            <div class="stock-bar-fill" style="width: ${pct}%; background: ${color};"></div>
          </div>
        </div>`;
      },
    },
    {
      key: 'price',
      header: 'Precio venta',
      align: 'right',
      render: (p) => `<span class="tabular" style="font-weight: 600;">${formatCurrency(p.price)}</span>`,
    },
    {
      key: 'status',
      header: 'Estado',
      render: (p) => renderStatusBadge(stockStatus(p)),
    },
  ];

  const kpisHtml = `<div class="kpi-grid">
    ${renderKpiCard({
      label: isAllBranches ? 'Artículos consolidados (3 sedes)' : `Artículos en ${branchLocation}`,
      value: `${formatNumber(branchProducts.length)} SKUs`,
      delta: `${formatNumber(totalUnits)} u.`,
      deltaTone: 'up',
      footnote: isAllBranches
        ? 'existencias sumadas en toda la empresa'
        : `unidades alojadas en ${branchLocation}`,
      iconHtml: '',
      tone: 'blue',
    })}
    ${renderKpiCard({
      label: 'Alertas de reposición',
      value: `${lowStockItems.length} ítems`,
      delta: `${outOfStockCount} sin stock`,
      deltaTone: lowStockItems.length > 0 ? 'warn' : 'up',
      footnote: isAllBranches ? 'en todas las sucursales' : `debajo del mínimo en ${branchLocation}`,
      iconHtml: '',
      tone: 'amber',
    })}
    ${renderKpiCard({
      label: isAllBranches ? 'Valorización total empresa' : `Valorización ${branchLocation}`,
      value: formatCurrency(totalValuation),
      delta: isAllBranches ? '100% global' : `${activeBranchInfo.occupancy}% ocup.`,
      deltaTone: 'up',
      footnote: 'costo promedio ponderado',
      iconHtml: '',
      tone: 'green',
    })}
    ${renderKpiCard({
      label: 'Movimientos auditados',
      value: `${branchMovements.length} reg.`,
      delta: isAllBranches ? '3 plantas' : branchLocation,
      deltaTone: 'up',
      footnote: 'ingresos, egresos y desarmes',
      iconHtml: '',
      tone: 'blue',
    })}
  </div>`;

  const branchCardsOrDetailHtml = isAllBranches
    ? `<div class="branch-overview-grid">
        ${branchBreakdown
          .map(
            (b) => `<article class="branch-overview-card">
              <div class="branch-overview-head">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <div>
                    <div class="branch-overview-title">${escapeHtml(b.name)}</div>
                    <div class="branch-overview-city">${escapeHtml(b.city)} · ${escapeHtml(b.manager)}</div>
                  </div>
                </div>
                <span class="badge ${b.status === 'Operativa' ? 'badge-success' : 'badge-warning'}">
                  ${escapeHtml(b.status)}
                </span>
              </div>

              <div class="branch-overview-metrics">
                <div>
                  <span class="lbl">Catálogo</span>
                  <strong class="tabular">${b.skuCount} SKUs (${formatNumber(b.units)} u.)</strong>
                </div>
                <div>
                  <span class="lbl">Valorización</span>
                  <strong class="tabular">${formatCurrency(b.value)}</strong>
                </div>
                <div>
                  <span class="lbl">Alertas</span>
                  <strong class="tabular" style="color: ${
                    b.alerts > 0 ? 'var(--warning-text)' : 'var(--success-text)'
                  };">${b.alerts} críticas</strong>
                </div>
              </div>

              <div class="branch-overview-foot">
                <span style="font-size: 11.5px; color: var(--text-tertiary);">
                  ${escapeHtml(b.address)}
                </span>
                <button
                  type="button"
                  class="btn btn-secondary btn-sm"
                  data-action="select-branch"
                  data-branch="${escapeHtml(b.name)}"
                >
                  Inspeccionar sede
                </button>
              </div>
            </article>`
          )
          .join('')}
      </div>`
    : `<div class="branch-single-banner">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div>
            <div style="font-weight: 700; font-size: 14px; color: var(--text-primary);">
              Estás visualizando únicamente: ${escapeHtml(activeBranchInfo.name)} (${escapeHtml(
                activeBranchInfo.city
              )})
            </div>
            <div style="font-size: 12.5px; color: var(--text-secondary);">
              Dirección: ${escapeHtml(activeBranchInfo.address)} · Encargado: <strong>${escapeHtml(
                activeBranchInfo.manager
              )}</strong> (${escapeHtml(activeBranchInfo.phone)}) · Ocupación de nave: <strong>${
                activeBranchInfo.occupancy
              }%</strong>
            </div>
          </div>
        </div>
        <button
          type="button"
          class="btn btn-secondary btn-sm"
          data-action="select-branch"
          data-branch="Todas las sedes"
        >
          Volver al resumen de todas las sedes
        </button>
      </div>`;

  return `<div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">
          ${
            isAllBranches
              ? 'Resumen General — Todas las Sedes'
              : `Panel Operativo — ${escapeHtml(branchLocation)}`
          }
        </h1>
        <p class="page-subtitle">
          ${
            isAllBranches
              ? 'Consolidado corporativo en tiempo real de Comercial Norte SRL. Usá el filtro de sucursales para inspeccionar cada sede de manera individual.'
              : `Vista individual filtrada para ${escapeHtml(branchLocation)} (${escapeHtml(
                  activeBranchInfo.city
                )}) · Responsable: ${escapeHtml(activeBranchInfo.manager)}.`
          }
        </p>
      </div>
      <div class="page-actions">
        <button
          type="button"
          class="btn btn-secondary"
          data-action="nav"
          data-screen="conversion"
        >
          ${icon('boxes', 15)}
          <span>Convertir kits / cajas</span>
        </button>
        <button
          type="button"
          class="btn btn-secondary"
          data-action="open-import-drawer"
        >
          ${icon('upload', 15)}
          <span>Carga masiva</span>
        </button>
        <button
          type="button"
          class="btn btn-primary"
          data-action="open-movement-drawer"
        >
          <span>Registrar movimiento</span>
        </button>
      </div>
    </div>

    <!-- Barra de Filtro de Sedes / Sucursales -->
    <section class="branch-switcher-bar" aria-label="Filtro de visualización por sucursal">
      <div class="branch-switcher-label">
        <div>
          <strong>Visualización por Sede / Sucursal</strong>
          <span>Alterná entre el consolidado general de la empresa o el detalle individual de cada planta</span>
        </div>
      </div>

      <div class="branch-pills-group" role="tablist">
        ${branches
          .map((b) => {
            const active = branchLocation === b.name;
            const count =
              b.name === 'Todas las sedes'
                ? products.length
                : products.filter((p) => p.branch === b.name).length;
            return `<button
              type="button"
              role="tab"
              aria-selected="${active}"
              class="branch-filter-pill ${active ? 'active' : ''}"
              data-action="select-branch"
              data-branch="${escapeHtml(b.name)}"
            >
              <span>${escapeHtml(b.name)}</span>
              <span class="branch-pill-count tabular">${count}</span>
            </button>`;
          })
          .join('')}
      </div>
    </section>

    ${kpisHtml}
    ${branchCardsOrDetailHtml}

    <div class="dashboard-split">
      <section class="panel">
        <div class="panel-header">
          <div>
            <div class="panel-title">
              Flujo de inventario — ${escapeHtml(branchLocation)}
            </div>
            <div class="panel-subtitle">
              Comparativa de unidades recepcionadas vs. despachadas (${
                isAllBranches ? 'consolidado 3 sedes' : escapeHtml(branchLocation)
              })
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 12px;">
            <div class="chart-legend">
              <span><i class="legend-swatch" style="background: var(--accent);"></i>Ingresos</span>
              <span><i class="legend-swatch" style="background: var(--border-strong);"></i>Egresos</span>
            </div>
            <div class="segmented" role="tablist" aria-label="Período del gráfico">
              <button
                type="button"
                class="seg-btn ${period === '30d' ? 'active' : ''}"
                data-action="set-dashboard-period"
                data-period="30d"
              >30 días</button>
              <button
                type="button"
                class="seg-btn ${period === '90d' ? 'active' : ''}"
                data-action="set-dashboard-period"
                data-period="90d"
              >90 días</button>
              <button
                type="button"
                class="seg-btn ${period === '12m' ? 'active' : ''}"
                data-action="set-dashboard-period"
                data-period="12m"
              >12 meses</button>
            </div>
          </div>
        </div>
        <div class="panel-body">
          <div class="bar-chart">
            ${bars
              .map(
                (col) => `<div class="bar-col">
                  <div class="bar-pair">
                    <div
                      class="bar in"
                      style="height: ${col.ingresos}%;"
                      title="Ingresos: ${col.ingresos} u."
                    ></div>
                    <div
                      class="bar out"
                      style="height: ${col.egresos}%;"
                      title="Egresos: ${col.egresos} u."
                    ></div>
                  </div>
                  <span class="bar-label">${escapeHtml(col.label)}</span>
                </div>`
              )
              .join('')}
          </div>
        </div>
      </section>

      <section class="panel">
        <div class="panel-header">
          <div>
            <div class="panel-title">Actividad reciente</div>
            <div class="panel-subtitle">
              ${
                isAllBranches
                  ? 'Últimos movimientos en todas las sedes'
                  : `Movimientos registrados en ${escapeHtml(branchLocation)}`
              }
            </div>
          </div>
          <button
            type="button"
            class="btn btn-ghost btn-sm"
            data-action="nav"
            data-screen="movimientos"
          >
            Ver historial
          </button>
        </div>
        <div class="panel-body" style="padding-top: 8px; padding-bottom: 8px;">
          <div class="feed-list">
            ${branchMovements
              .slice(0, 5)
              .map(
                (m) => `<div class="feed-item">
                  <div class="feed-content">
                    <div class="feed-title">
                      ${escapeHtml(m.type)} · ${escapeHtml(m.productName)}
                    </div>
                    <div class="feed-meta">
                      ${escapeHtml(m.reference)} · <strong>${escapeHtml(m.branch)}</strong> · ${escapeHtml(m.date)}
                    </div>
                  </div>
                  <div
                    class="feed-qty tabular"
                    style="color: ${
                      m.type === 'Ingreso' ? 'var(--success-text)' : 'var(--text-primary)'
                    };"
                  >
                    ${m.type === 'Ingreso' ? '+' : '-'}${Math.abs(m.quantity)}
                  </div>
                </div>`
              )
              .join('')}
          </div>
        </div>
      </section>
    </div>

    <section class="panel">
      <div class="panel-header">
        <div>
          <div class="panel-title">
            Control de existencias (${
              isAllBranches ? 'Consolidado General' : escapeHtml(branchLocation)
            })
          </div>
          <div class="panel-subtitle">
            Mostrando ${filteredProducts.length} de ${branchProducts.length} productos en ${escapeHtml(
              branchLocation
            )}
          </div>
        </div>
        <button
          type="button"
          class="btn btn-secondary btn-sm"
          data-action="nav"
          data-screen="productos"
        >
          Abrir catálogo completo
        </button>
      </div>

      <div class="toolbar">
        <div class="toolbar-left">
          <select
            class="select"
            aria-label="Filtrar por categoría"
            data-action="set-dashboard-category"
          >
            ${categories
              .map(
                (cat) =>
                  `<option value="${escapeHtml(cat)}" ${
                    categoryFilter === cat ? 'selected' : ''
                  }>${cat === 'Todas' ? 'Todas las categorías' : escapeHtml(cat)}</option>`
              )
              .join('')}
          </select>

          <select
            class="select"
            aria-label="Filtrar por estado de stock"
            data-action="set-dashboard-status"
          >
            <option value="Todos" ${statusFilter === 'Todos' ? 'selected' : ''}>Todos los estados</option>
            <option value="En stock" ${statusFilter === 'En stock' ? 'selected' : ''}>En stock</option>
            <option value="Stock bajo" ${statusFilter === 'Stock bajo' ? 'selected' : ''}>Stock bajo</option>
            <option value="Sin stock" ${statusFilter === 'Sin stock' ? 'selected' : ''}>Sin stock</option>
          </select>
        </div>

        <div class="toolbar-right">
          ${
            categoryFilter !== 'Todas' || statusFilter !== 'Todos' || !isAllBranches
              ? `<button
                  type="button"
                  class="btn btn-ghost btn-sm"
                  data-action="reset-dashboard-filters"
                >
                  Restablecer vista general
                </button>`
              : ''
          }
        </div>
      </div>

      ${renderDataTable({
        columns,
        rows: filteredProducts.slice(0, 8),
        emptyActionAction: 'reset-dashboard-filters',
      })}
    </section>
  </div>`;
}
