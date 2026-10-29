/**
 * @fileoverview Vista de Historial de Movimientos (MovementsView).
 * Registra y audita Ingresos, Egresos, Ajustes y Transferencias entre sedes.
 */

import { renderDataTable } from '../components/DataTable.js';
import { renderStatusBadge } from '../components/StatusBadge.js';
import { escapeHtml, formatNumber } from '../core/formatters.js';
import { icon } from '../core/icons.js';

/**
 * Renderiza la vista de auditoría de movimientos de stock.
 * @param {object} state Estado global.
 * @returns {string} HTML string
 */
export function renderMovementsView(state) {
  const { movements, movementsViewState: v } = state;
  const { search, typeFilter } = v;

  const filtered = movements.filter((m) => {
    const q = search.trim().toLowerCase();
    const matchQ =
      !q ||
      m.productName.toLowerCase().includes(q) ||
      m.sku.toLowerCase().includes(q) ||
      m.reference.toLowerCase().includes(q) ||
      m.responsible.toLowerCase().includes(q);
    const matchType = typeFilter === 'Todos' || m.type === typeFilter;
    return matchQ && matchType;
  });

  const totalIn = movements
    .filter((m) => m.type === 'Ingreso')
    .reduce((acc, m) => acc + m.quantity, 0);

  const totalOut = movements
    .filter((m) => m.type === 'Egreso')
    .reduce((acc, m) => acc + m.quantity, 0);

  const columns = [
    {
      key: 'id',
      header: 'Operación',
      render: (m) => `<span class="sku-code">${escapeHtml(m.id)}</span>`,
    },
    {
      key: 'date',
      header: 'Fecha y hora',
      render: (m) =>
        `<span style="color: var(--text-secondary); font-size: 12.5px;">${escapeHtml(m.date)}</span>`,
    },
    {
      key: 'type',
      header: 'Tipo',
      render: (m) => renderStatusBadge(m.type),
    },
    {
      key: 'product',
      header: 'Artículo / SKU',
      render: (m) => `<div>
        <div class="product-name">${escapeHtml(m.productName)}</div>
        <div class="product-sub">${escapeHtml(m.sku)} · ${escapeHtml(m.reference)}</div>
      </div>`,
    },
    {
      key: 'responsible',
      header: 'Responsable',
      render: (m) => escapeHtml(m.responsible),
    },
    {
      key: 'qty',
      header: 'Impacto',
      align: 'right',
      render: (m) => {
        const isPositive = m.type === 'Ingreso' || (m.type === 'Ajuste' && m.quantity > 0);
        const color = isPositive
          ? 'var(--success-text)'
          : m.type === 'Transferencia'
            ? 'var(--info-text)'
            : 'var(--danger-text)';
        const sign = isPositive ? '+' : m.type === 'Egreso' ? '-' : '';
        return `<span class="tabular" style="font-weight: 700; color: ${color};">
          ${sign}${formatNumber(m.quantity)} u.
        </span>`;
      },
    },
  ];

  const types = ['Todos', 'Ingreso', 'Egreso', 'Ajuste', 'Transferencia'];

  return `<div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Historial de movimientos</h1>
        <p class="page-subtitle">
          Trazabilidad completa de recepciones de compra, despachos a obra, ajustes y transferencias.
        </p>
      </div>
      <div class="page-actions">
        <button
          type="button"
          class="btn btn-secondary"
          data-action="export-movements-toast"
        >
          ${icon('download', 15)}
          <span>Exportar bitácora</span>
        </button>
        <button
          type="button"
          class="btn btn-primary"
          data-action="open-movement-drawer"
        >
          ${icon('plus', 16)}
          <span>Registrar movimiento</span>
        </button>
      </div>
    </div>

    <div class="kpi-grid" style="grid-template-columns: repeat(3, minmax(0, 1fr));">
      <div class="kpi-card">
        <div class="kpi-top">
          <span class="kpi-label">Unidades ingresadas (mes)</span>
        </div>
        <div class="kpi-value tabular">+${formatNumber(totalIn)} u.</div>
        <div class="kpi-foot">Recepciones verificadas por calidad</div>
      </div>

      <div class="kpi-card">
        <div class="kpi-top">
          <span class="kpi-label">Unidades despachadas (mes)</span>
        </div>
        <div class="kpi-value tabular">-${formatNumber(totalOut)} u.</div>
        <div class="kpi-foot">Órdenes de salida y entregas</div>
      </div>

      <div class="kpi-card">
        <div class="kpi-top">
          <span class="kpi-label">Transferencias entre sedes</span>
        </div>
        <div class="kpi-value tabular">
          ${movements.filter((m) => m.type === 'Transferencia').length} envíos
        </div>
        <div class="kpi-foot">Sin discrepancias de recepción</div>
      </div>
    </div>

    <section class="panel">
      <div class="toolbar">
        <div class="toolbar-left">
          <div style="position: relative; width: 280px;">
            <span style="position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: var(--text-tertiary); display: inline-flex;">
              ${icon('search', 15)}
            </span>
            <input
              id="movements-search-input"
              class="input"
              style="padding-left: 32px;"
              value="${escapeHtml(search)}"
              placeholder="Buscar por producto, remito o responsable..."
              aria-label="Buscar movimiento"
              data-input="movements-search"
            />
          </div>

          <div class="segmented" role="tablist" aria-label="Tipo de movimiento">
            ${types
              .map(
                (t) =>
                  `<button
                    type="button"
                    class="seg-btn ${typeFilter === t ? 'active' : ''}"
                    data-action="set-movements-type"
                    data-mov-filter="${t}"
                  >${t}</button>`
              )
              .join('')}
          </div>
        </div>
      </div>

      ${renderDataTable({
        columns,
        rows: filtered,
        emptyActionAction: 'reset-movements-filters',
      })}
    </section>
  </div>`;
}
