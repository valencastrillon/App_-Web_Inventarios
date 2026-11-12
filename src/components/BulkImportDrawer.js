/** Drawer de carga masiva: la única fuente de datos es un archivo CSV/XLS/XLSX. */
import { escapeHtml, formatCurrency, formatNumber } from '../core/formatters.js';
import { icon } from '../core/icons.js';

function renderErrors(errors) {
  if (!errors.length) return '';
  return `<div class="bulk-import-errors" role="alert"><strong>${icon('triangleAlert', 15)} Hay ${errors.length} fila${errors.length === 1 ? '' : 's'} con errores</strong><ul>${errors.slice(0, 12).map((error) => `<li>Fila ${error.row}: ${escapeHtml(error.messages.join(' · '))}</li>`).join('')}</ul>${errors.length > 12 ? '<small>Se muestran los primeros 12 errores.</small>' : '<small>Las filas con error no se importan.</small>'}</div>`;
}

function renderPreview(state) {
  const { bulkImportState } = state;
  const { csvPreview, csvErrors, csvStats, columnsError } = bulkImportState;
  if (!bulkImportState.fileName) return '';
  const rows = csvPreview.slice(0, 12);
  return `<section class="bulk-import-preview" aria-label="Vista previa de importación">
    <div class="bulk-preview-heading"><div><strong>Vista previa de solo lectura</strong><small>${escapeHtml(bulkImportState.fileName)} · ${csvStats.totalRows} filas detectadas${rows.length < csvPreview.length ? ` · mostrando las primeras ${rows.length}` : ''}</small></div><button type="button" class="btn btn-ghost btn-sm" data-action="clear-bulk-file">${icon('rotateCcw', 14)} Cambiar archivo</button></div>
    ${columnsError ? `<div class="bulk-import-errors" role="alert"><strong>${icon('triangleAlert', 15)} Faltan columnas obligatorias</strong><span>${escapeHtml(columnsError)}</span></div>` : ''}
    <div class="bulk-summary-strip" aria-label="Resumen de validación"><div><span>Filas válidas</span><strong>${formatNumber(csvStats.validRows)}</strong></div><div><span>Filas con error</span><strong class="${csvStats.invalidRows ? 'is-error' : ''}">${formatNumber(csvStats.invalidRows)}</strong></div><div><span>Unidades totales</span><strong>${formatNumber(csvStats.totalUnits)} u.</strong></div><div><span>Valorización</span><strong>${formatCurrency(csvStats.totalValuation)}</strong></div></div>
    ${renderErrors(csvErrors)}
    ${rows.length ? `<div class="bulk-preview-table"><table class="data-table"><thead><tr><th>Estado</th><th>Fila</th><th>Producto</th><th>SKU</th><th>Sede</th><th class="align-right">Stock</th><th class="align-right">Costo</th></tr></thead><tbody>${rows.map((item) => `<tr><td><span class="status-pill status-pill-success">${icon('check', 12)} Válida</span></td><td>${item.rowNumber}</td><td><strong>${escapeHtml(item.name)}</strong></td><td><span class="sku-code">${escapeHtml(item.sku)}</span></td><td>${escapeHtml(item.branch)}</td><td class="align-right tabular">${formatNumber(item.stock)}</td><td class="align-right tabular">${formatCurrency(item.cost)}</td></tr>`).join('')}</tbody></table></div>` : '<div class="bulk-empty-preview">No hay filas válidas para importar.</div>'}
  </section>`;
}

export function renderBulkImportDrawer(state) {
  const { bulkImportState } = state;
  const { csvPreview, fileName, csvStats } = bulkImportState;
  const canImport = csvPreview.length > 0 && !bulkImportState.columnsError;
  return `<div class="drawer-backdrop" data-action="close-drawer"><aside class="drawer drawer-wide bulk-import-drawer" role="dialog" aria-modal="true" aria-label="Carga masiva de productos" data-stop-propagation="true">
    <div class="drawer-header"><div><div class="drawer-title">Carga masiva de productos e inventario</div><div class="drawer-subtitle">Subí un archivo CSV o Excel con tus productos.</div></div><button type="button" class="icon-btn" data-action="close-drawer" aria-label="Cerrar">${icon('x', 18)}</button></div>
    <div class="drawer-body bulk-import-body"><div class="bulk-upload-area ${fileName ? 'has-file' : ''}" data-action="trigger-csv-input" role="button" tabindex="0" aria-label="Seleccionar archivo CSV o Excel"><div class="bulk-upload-icon">${icon(fileName ? 'fileCheck2' : 'upload', 25)}</div><div><strong>${fileName ? `Archivo listo: ${escapeHtml(fileName)}` : 'Arrastrá tu archivo acá'}</strong><small>${fileName ? 'Podés cambiarlo seleccionando otro archivo.' : 'o hacé clic para seleccionar un archivo'}</small><small class="bulk-file-types">Formatos aceptados: .csv, .xlsx, .xls · hasta 5.000 filas</small></div><button type="button" class="btn btn-secondary btn-sm">${fileName ? 'Cambiar archivo' : 'Seleccionar archivo'}</button><input id="bulk-csv-file-input" type="file" accept=".csv,.xlsx,.xls,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel" hidden /></div>
      <div class="bulk-help-box"><div><strong>¿Usás Google Sheets?</strong><p>Descargá la hoja desde <b>Archivo &gt; Descargar &gt; Valores separados por comas (.csv)</b> o <b>Microsoft Excel (.xlsx)</b> y subí el archivo exportado. No se admite una URL pública de Google Sheets.</p></div><button type="button" class="btn btn-secondary btn-sm" data-action="download-csv-template">${icon('download', 14)} Descargar plantilla CSV</button></div>
      ${fileName ? `<div class="bulk-import-policy">${icon('shieldCheck', 15)} Se importan solo las filas válidas; las filas con error quedan fuera del catálogo.</div>` : ''}${renderPreview(state)}</div>
    <div class="drawer-footer"><button type="button" class="btn btn-secondary" data-action="close-drawer">Cancelar</button><button type="button" class="btn btn-primary" data-action="submit-bulk-csv" ${canImport ? '' : 'disabled'}>${icon('upload', 16)} Guardar e importar ${canImport ? `${csvStats.validRows} productos` : 'productos'}</button></div>
  </aside></div>`;
}
