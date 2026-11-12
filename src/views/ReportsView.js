/**
 * @fileoverview Vista de Reportes y Analítica Operativa (ReportsView).
 * Calcula valorización por categoría, margen bruto proyectado y listado de reposición urgente.
 */

import { renderStatusBadge } from '../components/StatusBadge.js';
import { escapeHtml, formatCurrency, formatNumber, stockStatus } from '../core/formatters.js';
import { icon } from '../core/icons.js';

/**
 * Renderiza la vista de reportes y analítica financiera de inventario.
 * @param {object} state Estado global.
 * @returns {string} HTML string
 */
export function renderReportsView(state) {
  const { products, categories } = state;

  const totalCost = products.reduce((acc, p) => acc + p.stock * p.cost, 0);
  const totalRetail = products.reduce((acc, p) => acc + p.stock * p.price, 0);
  const potentialMargin = totalRetail - totalCost;
  const critical = products.filter((p) => stockStatus(p) !== 'En stock');

  const byCategory = categories.map((cat) => {
    const items = products.filter((p) => p.category === cat.name);
    const val = items.reduce((acc, p) => acc + p.stock * p.cost, 0);
    const share = totalCost > 0 ? Math.round((val / totalCost) * 100) : 0;
    return { name: cat.name, value: val, share, count: items.length };
  });

  return `<div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Reportes y analítica operativa</h1>
        <p class="page-subtitle">
          Valorización financiera del inventario, margen bruto proyectado y planilla de reposición urgente.
        </p>
      </div>
      <div class="page-actions">
        <button
          type="button"
          class="btn btn-primary"
          data-action="export-report-toast"
        >
          ${icon('download', 15)}
          <span>Descargar informe ejecutivo</span>
        </button>
      </div>
    </div>

    <div class="kpi-grid" style="grid-template-columns: repeat(3, minmax(0, 1fr));">
      <div class="kpi-card">
        <div class="kpi-top">
          <span class="kpi-label">Capital inmovilizado (a costo)</span>
        </div>
        <div class="kpi-value tabular">${formatCurrency(totalCost)}</div>
        <div class="kpi-foot">100% auditado sobre ${products.length} SKUs</div>
      </div>

      <div class="kpi-card">
        <div class="kpi-top">
          <span class="kpi-label">Valor de realización (lista)</span>
        </div>
        <div class="kpi-value tabular">${formatCurrency(totalRetail)}</div>
        <div class="kpi-foot">Margen bruto potencial: ${formatCurrency(potentialMargin)}</div>
      </div>

      <div class="kpi-card">
        <div class="kpi-top">
          <span class="kpi-label">Ítems en punto de pedido</span>
        </div>
        <div class="kpi-value tabular">${critical.length} SKUs</div>
        <div class="kpi-foot">Requieren emisión de Orden de Compra</div>
      </div>
    </div>

    <div class="dashboard-split">
      <section class="panel">
        <div class="panel-header">
          <div>
            <div class="panel-title">Participación del capital por rubro</div>
            <div class="panel-subtitle">Distribución porcentual del stock valorizado a costo</div>
          </div>
        </div>
        <div class="panel-body" style="display: flex; flex-direction: column; gap: 14px;">
          ${byCategory
            .map(
              (row) => `<div style="display: flex; flex-direction: column; gap: 6px;">
                <div style="display: flex; justify-content: space-between; font-size: 13px;">
                  <span style="font-weight: 600;">
                    ${escapeHtml(row.name)} <span style="color: var(--text-tertiary); font-weight: 400;">(${row.count} SKUs)</span>
                  </span>
                  <span class="tabular" style="font-weight: 600;">
                    ${formatCurrency(row.value)} (${row.share}%)
                  </span>
                </div>
                <div class="stock-bar-track" style="width: 100%; height: 8px;">
                  <div
                    class="stock-bar-fill"
                    style="width: ${Math.max(row.share, 4)}%; background: var(--accent);"
                  ></div>
                </div>
              </div>`
            )
            .join('')}
        </div>
      </section>

      <section class="panel">
        <div class="panel-header">
          <div>
            <div class="panel-title">Prioridad de compra sugerida</div>
            <div class="panel-subtitle">Artículos debajo del stock mínimo de seguridad</div>
          </div>
        </div>
        <div class="table-scroll">
          <table class="data-table">
            <thead>
              <tr>
                <th>SKU / Producto</th>
                <th class="align-right">Actual / Mín.</th>
                <th class="align-right">Sugerido OC</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              ${critical
                .map((p) => {
                  const needed = Math.max(p.minStock * 2 - p.stock, p.minStock);
                  return `<tr>
                    <td>
                      <div class="product-name">${escapeHtml(p.name)}</div>
                      <div class="product-sub">${escapeHtml(p.sku)}</div>
                    </td>
                    <td class="align-right tabular">${p.stock} / ${p.minStock}</td>
                    <td class="align-right tabular" style="font-weight: 700; color: var(--accent);">
                      +${formatNumber(needed)} ${escapeHtml(p.unit)}
                    </td>
                    <td>${renderStatusBadge(stockStatus(p))}</td>
                  </tr>`;
                })
                .join('')}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  </div>`;
}
