/**
 * @fileoverview Drawer de Carga Masiva de Productos.
 * Incluye dos modalidades:
 * 1. Tabla/Formulario interactivo multi-fila editable en pantalla.
 * 2. Importación de archivos CSV / Excel con descarga de plantilla modelo.
 */

import { escapeHtml, formatCurrency } from '../core/formatters.js';
import { icon } from '../core/icons.js';

/**
 * Renderiza el drawer de carga masiva cuando `state.drawer === 'import'`.
 * @param {object} state Estado global.
 * @returns {string} HTML string
 */
export function renderBulkImportDrawer(state) {
  const { bulkImportState, categories, branches } = state;
  const { activeTab, rows, csvPreview, fileName } = bulkImportState;

  const selectableBranches = branches.filter((b) => b.id !== 'all');
  const validTableRows = rows.filter((r) => r.name.trim() !== '' && r.sku.trim() !== '');
  const totalUnits = validTableRows.reduce((acc, r) => acc + (Number(r.stock) || 0), 0);
  const totalValuation = validTableRows.reduce(
    (acc, r) => acc + (Number(r.stock) || 0) * (Number(r.cost) || 0),
    0
  );

  const tableSectionHtml =
    activeTab === 'table'
      ? `<div class="bulk-summary-strip">
          <div class="bulk-stat">
            <span class="bulk-stat-label">Filas válidas</span>
            <strong class="tabular">${validTableRows.length} de ${rows.length}</strong>
          </div>
          <div class="bulk-stat">
            <span class="bulk-stat-label">Unidades totales a ingresar</span>
            <strong class="tabular">${totalUnits} u.</strong>
          </div>
          <div class="bulk-stat">
            <span class="bulk-stat-label">Valorización de costo</span>
            <strong class="tabular">${formatCurrency(totalValuation)}</strong>
          </div>
          <div class="bulk-stat-actions">
            <button type="button" class="btn btn-secondary btn-sm" data-action="bulk-add-row">
              ${icon('plus', 14)} Agregar fila
            </button>
            <button type="button" class="btn btn-ghost btn-sm" data-action="bulk-add-three-rows">
              ${icon('sparkles', 14)} +3 filas rápidas
            </button>
          </div>
        </div>

        <div class="bulk-grid-wrapper">
          <table class="bulk-form-table">
            <thead>
              <tr>
                <th style="width: 36px;">#</th>
                <th style="min-width: 190px;">Nombre del Producto *</th>
                <th style="width: 115px;">Código SKU *</th>
                <th style="width: 140px;">Categoría</th>
                <th style="width: 145px;">Sede / Sucursal</th>
                <th style="width: 82px;">Stock</th>
                <th style="width: 82px;">Mín.</th>
                <th style="width: 105px;">Costo ($)</th>
                <th style="width: 105px;">Precio ($)</th>
                <th style="min-width: 155px;">Ubicación física</th>
                <th style="width: 44px;"></th>
              </tr>
            </thead>
            <tbody>
              ${rows
                .map(
                  (row, idx) => `<tr>
                    <td class="bulk-row-idx tabular">${idx + 1}</td>
                    <td>
                      <input
                        class="bulk-cell-input"
                        type="text"
                        value="${escapeHtml(row.name)}"
                        placeholder="Ej. Llave Térmica 2x25A"
                        data-bulk-row="${escapeHtml(row.id)}"
                        data-bulk-field="name"
                      />
                    </td>
                    <td>
                      <input
                        class="bulk-cell-input mono"
                        type="text"
                        value="${escapeHtml(row.sku)}"
                        placeholder="ELE-0100"
                        data-bulk-row="${escapeHtml(row.id)}"
                        data-bulk-field="sku"
                      />
                    </td>
                    <td>
                      <select
                        class="bulk-cell-select"
                        data-bulk-row="${escapeHtml(row.id)}"
                        data-bulk-field="category"
                      >
                        ${categories
                          .map(
                            (cat) =>
                              `<option value="${escapeHtml(cat.name)}" ${
                                row.category === cat.name ? 'selected' : ''
                              }>${escapeHtml(cat.name)}</option>`
                          )
                          .join('')}
                      </select>
                    </td>
                    <td>
                      <select
                        class="bulk-cell-select"
                        data-bulk-row="${escapeHtml(row.id)}"
                        data-bulk-field="branch"
                      >
                        ${selectableBranches
                          .map(
                            (b) =>
                              `<option value="${escapeHtml(b.name)}" ${
                                row.branch === b.name ? 'selected' : ''
                              }>${escapeHtml(b.name)}</option>`
                          )
                          .join('')}
                      </select>
                    </td>
                    <td>
                      <input
                        class="bulk-cell-input tabular"
                        type="number"
                        min="0"
                        value="${escapeHtml(row.stock)}"
                        data-bulk-row="${escapeHtml(row.id)}"
                        data-bulk-field="stock"
                      />
                    </td>
                    <td>
                      <input
                        class="bulk-cell-input tabular"
                        type="number"
                        min="0"
                        value="${escapeHtml(row.minStock)}"
                        data-bulk-row="${escapeHtml(row.id)}"
                        data-bulk-field="minStock"
                      />
                    </td>
                    <td>
                      <input
                        class="bulk-cell-input tabular"
                        type="number"
                        min="0"
                        value="${escapeHtml(row.cost)}"
                        data-bulk-row="${escapeHtml(row.id)}"
                        data-bulk-field="cost"
                      />
                    </td>
                    <td>
                      <input
                        class="bulk-cell-input tabular"
                        type="number"
                        min="0"
                        value="${escapeHtml(row.price)}"
                        data-bulk-row="${escapeHtml(row.id)}"
                        data-bulk-field="price"
                      />
                    </td>
                    <td>
                      <input
                        class="bulk-cell-input"
                        type="text"
                        value="${escapeHtml(row.location)}"
                        placeholder="Pasillo A-1"
                        data-bulk-row="${escapeHtml(row.id)}"
                        data-bulk-field="location"
                      />
                    </td>
                    <td style="text-align: center;">
                      <button
                        type="button"
                        class="icon-btn"
                        style="width: 28px; height: 28px;"
                        data-action="bulk-remove-row"
                        data-row-id="${escapeHtml(row.id)}"
                        title="Quitar fila"
                        aria-label="Quitar fila"
                      >
                        ${icon('trash2', 14)}
                      </button>
                    </td>
                  </tr>`
                )
                .join('')}
            </tbody>
          </table>
        </div>`
      : `<div style="display: flex; flex-direction: column; gap: 16px;">
          <div class="dropzone" data-action="trigger-csv-input">
            <div class="dropzone-icon">${icon('upload', 22)}</div>
            <div style="font-weight: 600; color: var(--text-primary); margin-bottom: 4px;">
              ${
                fileName
                  ? `Archivo cargado: ${escapeHtml(fileName)}`
                  : 'Hacé clic para seleccionar un archivo CSV'
              }
            </div>
            <div style="font-size: 12.5px; color: var(--text-secondary);">
              Soporta delimitadores por coma (,) o punto y coma (;). Hasta 5.000 filas por lote.
            </div>
            <input
              id="bulk-csv-file-input"
              type="file"
              accept=".csv,text/csv"
              style="display: none;"
            />
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; background: var(--surface-subtle); padding: 12px 14px; border-radius: var(--radius-md); border: 1px solid var(--border);">
            <div style="font-size: 12.5px; color: var(--text-secondary);">
              ¿No tenés el formato a mano? Descargá la plantilla oficial con ejemplos e importala directamente.
            </div>
            <button type="button" class="btn btn-secondary btn-sm" data-action="download-csv-template">
              ${icon('download', 14)} Descargar plantilla CSV
            </button>
          </div>

          ${
            csvPreview.length > 0
              ? `<div style="border: 1px solid var(--border); border-radius: var(--radius-md); overflow: hidden;">
                  <div style="padding: 10px 14px; background: var(--surface-muted); font-size: 12px; font-weight: 600; display: flex; align-items: center; gap: 6px; color: var(--success-text);">
                    ${icon('checkCircle2', 15)} ${csvPreview.length} artículos validados listos para importar
                  </div>
                  <div class="table-scroll" style="max-height: 220px;">
                    <table class="data-table">
                      <thead>
                        <tr>
                          <th>Producto</th>
                          <th>SKU</th>
                          <th>Sede</th>
                          <th class="align-right">Stock</th>
                          <th class="align-right">Precio</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${csvPreview
                          .map(
                            (item) => `<tr>
                              <td><strong>${escapeHtml(item.name)}</strong></td>
                              <td><span class="sku-code">${escapeHtml(item.sku)}</span></td>
                              <td>${escapeHtml(item.branch)}</td>
                              <td class="align-right tabular">${item.stock} ${escapeHtml(item.unit)}</td>
                              <td class="align-right tabular">$${item.price.toLocaleString('es-AR')}</td>
                            </tr>`
                          )
                          .join('')}
                      </tbody>
                    </table>
                  </div>
                </div>`
              : ''
          }
        </div>`;

  return `<div class="drawer-backdrop" data-action="close-drawer">
    <aside
      class="drawer drawer-wide"
      role="dialog"
      aria-modal="true"
      aria-label="Carga masiva de productos"
      data-stop-propagation="true"
    >
      <div class="drawer-header">
        <div>
          <div class="drawer-title">Carga masiva de productos e inventario</div>
          <div style="font-size: 12.5px; color: var(--text-secondary); margin-top: 2px;">
            Completá la planilla interactiva en pantalla o subí un archivo CSV/Excel.
          </div>
        </div>
        <button type="button" class="icon-btn" data-action="close-drawer" aria-label="Cerrar">
          ${icon('x', 18)}
        </button>
      </div>

      <div class="bulk-tabs-bar">
        <button
          type="button"
          class="bulk-tab-btn ${activeTab === 'table' ? 'active' : ''}"
          data-action="set-bulk-tab"
          data-tab="table"
        >
          ${icon('fileSpreadsheet', 15)}
          <span>Tabla / Formulario interactivo (${rows.length} filas)</span>
        </button>
        <button
          type="button"
          class="bulk-tab-btn ${activeTab === 'csv' ? 'active' : ''}"
          data-action="set-bulk-tab"
          data-tab="csv"
        >
          ${icon('upload', 15)}
          <span>Importar archivo CSV / Excel</span>
        </button>
      </div>

      <div class="drawer-body">${tableSectionHtml}</div>

      <div class="drawer-footer">
        <button type="button" class="btn btn-secondary" data-action="close-drawer">
          Cancelar
        </button>
        ${
          activeTab === 'table'
            ? `<button
                type="button"
                class="btn btn-primary"
                data-action="submit-bulk-table"
                ${validTableRows.length === 0 ? 'disabled' : ''}
              >
                ${icon('checkCircle2', 16)}
                Guardar e importar ${validTableRows.length} productos
              </button>`
            : `<button
                type="button"
                class="btn btn-primary"
                data-action="submit-bulk-csv"
                ${csvPreview.length === 0 ? 'disabled' : ''}
              >
                ${icon('upload', 16)}
                Importar ${csvPreview.length > 0 ? `${csvPreview.length} productos` : 'lote CSV'}
              </button>`
        }
      </div>
    </aside>
  </div>`;
}
