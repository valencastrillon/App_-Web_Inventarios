/**
 * @fileoverview Vista de Conversión de Kits / Cajas de Proveedores (ConversionView).
 * Permite seleccionar una receta homologada de proveedor o configurar una conversión
 * libre para desglosar bultos mayoristas en unidades individuales de mostrador.
 */

import { escapeHtml, formatCurrency, formatNumber } from '../core/formatters.js';
import { icon } from '../core/icons.js';

/**
 * Renderiza la vista de conversión de kits y cajas de proveedores.
 * @param {object} state Estado global.
 * @returns {string} HTML string
 */
export function renderConversionView(state) {
  const { products, kitRecipes, suppliers, branches, conversionState: conv } = state;

  const selectableBranches = branches.filter((b) => b.id !== 'all');
  const activeRecipe =
    kitRecipes.find((r) => r.id === conv.selectedRecipeId) || kitRecipes[0];

  const sourceId = conv.customMode ? conv.customSourceId : activeRecipe?.sourceProductId;
  const targetId = conv.customMode ? conv.customTargetId : activeRecipe?.targetProductId;
  const factor = Math.max(
    1,
    conv.customMode ? Number(conv.customFactor) || 1 : activeRecipe?.conversionFactor || 1
  );
  const qtyBoxes = Math.max(1, Number(conv.boxesToConvert) || 1);

  const sourceProduct = products.find((p) => p.id === sourceId);
  const targetProduct = products.find((p) => p.id === targetId);

  const generatedUnits = qtyBoxes * factor;
  const unitCostEstimated = sourceProduct ? Math.round(sourceProduct.cost / factor) : 0;

  return `<div class="page">
    <div class="page-header">
      <div>
        <div class="conversion-badge-top">
          ${icon('truck', 14)}
          <span>Módulo de Fraccionamiento Mayorista · Proveedores</span>
        </div>
        <h1 class="page-title">Convertir Kits o Cajas a Unidades</h1>
        <p class="page-subtitle">
          Desglosá cajas master, bultos cerrados o kits promocionales recibidos de proveedores en unidades individuales listas para venta o despacho.
        </p>
      </div>
    </div>

    <div class="conversion-layout">
      <!-- Columna Izquierda: Recetas de Proveedores -->
      <section class="panel">
        <div class="panel-header">
          <div>
            <div class="panel-title">Plantillas de conversión por proveedor</div>
            <div class="panel-subtitle">
              Seleccioná una relación de empaque homologada o creá una conversión libre
            </div>
          </div>
          <button
            type="button"
            class="btn btn-sm ${conv.customMode ? 'btn-primary' : 'btn-secondary'}"
            data-action="toggle-custom-conversion"
          >
            ${icon('sparkles', 14)}
            ${conv.customMode ? 'Usando modo libre' : 'Conversión libre'}
          </button>
        </div>

        <div class="panel-body" style="display: flex; flex-direction: column; gap: 12px;">
          ${kitRecipes
            .map((recipe) => {
              const src = products.find((p) => p.id === recipe.sourceProductId);
              const dst = products.find((p) => p.id === recipe.targetProductId);
              const isSelected = !conv.customMode && recipe.id === conv.selectedRecipeId;

              return `<button
                type="button"
                class="recipe-card ${isSelected ? 'selected' : ''}"
                data-action="select-kit-recipe"
                data-recipe-id="${escapeHtml(recipe.id)}"
              >
                <div class="recipe-card-top">
                  <span class="recipe-supplier-tag">
                    ${icon('truck', 12)} ${escapeHtml(recipe.supplier)}
                  </span>
                  <span class="recipe-factor-pill">1 caja = ${recipe.conversionFactor} u.</span>
                </div>
                <div class="recipe-title">${escapeHtml(recipe.name)}</div>
                <div class="recipe-flow">
                  <div class="recipe-node">
                    <span class="sku-code">${escapeHtml(src?.sku || 'KIT')}</span>
                    <span>${escapeHtml(src?.name || 'Caja proveedor')}</span>
                    <strong class="tabular">Disp: ${src?.stock ?? 0} ${escapeHtml(src?.unit || 'cajas')}</strong>
                  </div>
                  ${icon('arrowRight', 16)}
                  <div class="recipe-node">
                    <span class="sku-code">${escapeHtml(dst?.sku || 'UNI')}</span>
                    <span>${escapeHtml(dst?.name || 'Unidad venta')}</span>
                    <strong class="tabular">Actual: ${dst?.stock ?? 0} ${escapeHtml(dst?.unit || 'u.')}</strong>
                  </div>
                </div>
                <div class="recipe-notes">${escapeHtml(recipe.notes)}</div>
              </button>`;
            })
            .join('')}
        </div>
      </section>

      <!-- Columna Derecha: Simulador y Ejecución de Conversión -->
      <section class="panel">
        <div class="panel-header">
          <div>
            <div class="panel-title">Ejecutar desarme e impacto en stock</div>
            <div class="panel-subtitle">
              Se generará un movimiento de salida del bulto mayorista y un ingreso automático de unidades
            </div>
          </div>
        </div>

        <div class="panel-body" style="display: flex; flex-direction: column; gap: 16px;">
          ${
            conv.customMode
              ? `<div class="form-grid">
                  <div class="field">
                    <label>Producto Origen (Caja / Kit Proveedor)</label>
                    <select
                      class="select"
                      data-conversion-input="customSourceId"
                    >
                      ${products
                        .map(
                          (p) =>
                            `<option value="${escapeHtml(p.id)}" ${
                              conv.customSourceId === p.id ? 'selected' : ''
                            }>${escapeHtml(p.sku)} · ${escapeHtml(p.name)} (${p.stock} ${escapeHtml(
                              p.unit
                            )})</option>`
                        )
                        .join('')}
                    </select>
                  </div>
                  <div class="field">
                    <label>Producto Destino (Unidad fraccionada)</label>
                    <select
                      class="select"
                      data-conversion-input="customTargetId"
                    >
                      ${products
                        .map(
                          (p) =>
                            `<option value="${escapeHtml(p.id)}" ${
                              conv.customTargetId === p.id ? 'selected' : ''
                            }>${escapeHtml(p.sku)} · ${escapeHtml(p.name)} (${p.stock} ${escapeHtml(
                              p.unit
                            )})</option>`
                        )
                        .join('')}
                    </select>
                  </div>
                </div>`
              : ''
          }

          <div class="form-grid">
            <div class="field">
              <label for="conv-qty">Cantidad de cajas / kits a abrir</label>
              <input
                id="conv-qty"
                class="input tabular"
                type="number"
                min="1"
                max="100"
                value="${qtyBoxes}"
                data-conversion-input="boxesToConvert"
              />
            </div>

            <div class="field">
              <label for="conv-factor">Unidades contenidas por caja (Factor)</label>
              <input
                id="conv-factor"
                class="input tabular"
                type="number"
                min="1"
                value="${factor}"
                data-conversion-input="customFactor"
                ${conv.customMode ? '' : 'disabled'}
              />
            </div>
          </div>

          <div class="form-grid">
            <div class="field">
              <label for="conv-branch">Sede donde se realiza el fraccionamiento</label>
              <select
                id="conv-branch"
                class="select"
                data-conversion-input="branch"
              >
                ${selectableBranches
                  .map(
                    (b) =>
                      `<option value="${escapeHtml(b.name)}" ${
                        conv.branch === b.name ? 'selected' : ''
                      }>${escapeHtml(b.name)} — ${escapeHtml(b.city)}</option>`
                  )
                  .join('')}
              </select>
            </div>

            <div class="field">
              <label for="conv-resp">Operador responsable</label>
              <input
                id="conv-resp"
                class="input"
                value="${escapeHtml(conv.responsible)}"
                data-conversion-input="responsible"
              />
            </div>
          </div>

          <!-- Previsualización del Impacto -->
          <div class="conversion-preview-box">
            <div class="conversion-preview-col">
              <span class="conversion-preview-label">Baja de Bulto Cerrado</span>
              <div class="conversion-preview-name">${escapeHtml(sourceProduct?.name || '—')}</div>
              <div class="conversion-preview-math danger tabular">
                Stock: ${sourceProduct?.stock ?? 0} → ${Math.max(0, (sourceProduct?.stock ?? 0) - qtyBoxes)} ${escapeHtml(sourceProduct?.unit || '')} (-${qtyBoxes})
              </div>
            </div>

            <div class="conversion-preview-arrow">
              ${icon('boxes', 20)}
              <span>x${factor}</span>
            </div>

            <div class="conversion-preview-col">
              <span class="conversion-preview-label">Alta de Unidades Individuales</span>
              <div class="conversion-preview-name">${escapeHtml(targetProduct?.name || '—')}</div>
              <div class="conversion-preview-math success tabular">
                Stock: ${targetProduct?.stock ?? 0} → ${(targetProduct?.stock ?? 0) + generatedUnits} ${escapeHtml(targetProduct?.unit || '')} (+${formatNumber(generatedUnits)})
              </div>
            </div>
          </div>

          <div class="conversion-cost-note">
            ${icon('packageCheck', 16)}
            <span>
              Costo unitario resultante por unidad desglosada: <strong>${formatCurrency(unitCostEstimated)}</strong> (calculado sobre costo de caja ${formatCurrency(sourceProduct?.cost || 0)}). Proveedores activos vinculados: ${suppliers.filter((s) => s.active).length}.
            </span>
          </div>

          <button
            type="button"
            class="btn btn-primary"
            style="width: 100%; justify-content: center; height: 42px;"
            data-action="execute-kit-conversion"
          >
            ${icon('checkCircle2', 16)}
            Confirmar conversión (+${formatNumber(generatedUnits)} ${escapeHtml(targetProduct?.unit || 'unidades')})
          </button>
        </div>
      </section>
    </div>
  </div>`;
}
