/**
 * @fileoverview Componente reutilizable de Tabla de Datos (DataTable) con soporte para estado vacío.
 */

import { escapeHtml } from '../core/formatters.js';

/**
 * Renderiza una tabla de datos o un estado vacío cuando no hay registros.
 * @param {{
 *   columns: Array<{ key: string, header: string, align?: 'left' | 'right', render: (row: any) => string }>,
 *   rows: Array<any>,
 *   emptyTitle?: string,
 *   emptyDescription?: string,
 *   emptyActionAction?: string,
 *   emptyActionLabel?: string
 * }} props
 * @returns {string} HTML string
 */
export function renderDataTable({
  columns,
  rows,
  emptyTitle = 'No se encontraron registros',
  emptyDescription = 'Probá ajustando los filtros activos o limpiando la búsqueda para volver a ver resultados.',
  emptyActionAction = '',
  emptyActionLabel = 'Restablecer filtros',
}) {
  if (!rows || rows.length === 0) {
    return `<div class="empty-state">
      <div class="empty-title">${escapeHtml(emptyTitle)}</div>
      <p class="empty-desc">${escapeHtml(emptyDescription)}</p>
      ${
        emptyActionAction
          ? `<button type="button" class="btn btn-secondary" data-action="${escapeHtml(emptyActionAction)}">${escapeHtml(emptyActionLabel)}</button>`
          : ''
      }
    </div>`;
  }

  const headCells = columns
    .map(
      (col) =>
        `<th class="${col.align === 'right' ? 'align-right' : ''}">${escapeHtml(col.header)}</th>`
    )
    .join('');

  const bodyRows = rows
    .map((row) => {
      const cells = columns
        .map(
          (col) =>
            `<td class="${col.align === 'right' ? 'align-right' : ''}">${col.render(row)}</td>`
        )
        .join('');
      return `<tr>${cells}</tr>`;
    })
    .join('');

  return `<div class="table-scroll">
    <table class="data-table">
      <thead>
        <tr>${headCells}</tr>
      </thead>
      <tbody>${bodyRows}</tbody>
    </table>
  </div>`;
}
