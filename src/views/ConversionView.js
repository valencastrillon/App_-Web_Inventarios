/**
 * @fileoverview Vista de Conversión de Kits / Cajas (ConversionView).
 * Permite seleccionar una receta homologada o configurar una conversión
 * libre para desglosar bultos mayoristas en unidades individuales de mostrador.
 */

import { escapeHtml, formatCurrency, formatNumber } from '../core/formatters.js';

/**
 * Renderiza la vista de conversión de kits y cajas.
 * @param {object} state Estado global.
 * @returns {string} HTML string
 */
export function renderConversionView(state) {
  const { products, kitRecipes, branches, conversionState: conv } = state;

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
  const isValid = Boolean(
    sourceProduct &&
      targetProduct &&
      sourceProduct.id !== targetProduct.id &&
      qtyBoxes >= 1 &&
      factor >= 1 &&
      qtyBoxes <= sourceProduct.stock &&
      String(conv.responsible || '').trim()
  );

  return `<div class="page">
    <div class="page-header">
      <div>
        <div class="conversion-badge-top">
          <span>Módulo de fraccionamiento mayorista</span>
        </div>
        <h1 class="page-title">Convertir Kits o Cajas a Unidades</h1>
        <p class="page-subtitle">
          Desglosá cajas master, bultos cerrados o kits promocionales en unidades individuales listas para venta o despacho.
        </p>
      </div>
    </div>

    <div class="conversion-layout">
      <!-- Columna Izquierda: Recetas de empaque -->
      <section class="panel">
        <div class="panel-header">
          <div>
            <div class="panel-title">Plantillas de conversión por origen</div>
            <div class="panel-subtitle">
              Seleccioná una relación de empaque homologada o creá una conversión libre
            </div>
          </div>
          <button
            type="button"
            class="btn btn-sm ${conv.customMode ? 'btn-primary' : 'btn-secondary'}"
            data-action="toggle-custom-conversion"
          >
            ${conv.customMode ? 'Usando modo libre' : 'Conversión libre'}
          </button>
        </div>

        <div class="panel-body conversion-recipe-list">
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
                  <div>
                    <span class="recipe-supplier-tag">${escapeHtml(recipe.supplier)}</span>
                    <div class="recipe-title">${escapeHtml(recipe.name)}</div>
                  </div>
                  <span class="recipe-factor-pill">1 caja = ${recipe.conversionFactor} u.</span>
                </div>
                <div class="recipe-sku-table">
                  <div class="recipe-sku-head"><span>SKU</span><span>Descripción</span><span>Stock actual</span><span>Disponible</span></div>
                  <div class="recipe-sku-row"><strong class="sku-code">${escapeHtml(src?.sku || 'KIT')}</strong><span>${escapeHtml(src?.name || 'Caja proveedor')}</span><span class="tabular">${src?.stock ?? 0} ${escapeHtml(src?.unit || 'cajas')}</span><strong class="tabular">${src?.stock ?? 0}</strong></div>
                  <div class="recipe-sku-row"><strong class="sku-code">${escapeHtml(dst?.sku || 'UNI')}</strong><span>${escapeHtml(dst?.name || 'Unidad venta')}</span><span class="tabular">${dst?.stock ?? 0} ${escapeHtml(dst?.unit || 'u.')}</span><strong class="tabular">${dst?.stock ?? 0}</strong></div>
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

        <div class="panel-body conversion-execution-body">
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

          <div class="form-grid conversion-form-row">
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

          <div class="form-grid conversion-form-row">
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
            <div class="conversion-preview-card conversion-preview-out">
              <span class="conversion-preview-label">Baja</span>
              <strong class="conversion-preview-name">Bulto cerrado</strong>
              <span class="conversion-preview-sku">${escapeHtml(sourceProduct?.sku || '—')} · ${escapeHtml(sourceProduct?.name || '—')}</span>
              <div class="conversion-stock-values"><span>${sourceProduct?.stock ?? 0}</span><span>→</span><strong>${Math.max(0, (sourceProduct?.stock ?? 0) - qtyBoxes)}</strong><b>-${qtyBoxes}</b></div>
              <small>${escapeHtml(sourceProduct?.unit || 'cajas')}</small>
            </div>
            <div class="conversion-preview-arrow" aria-hidden="true"><span>×${factor}</span></div>
            <div class="conversion-preview-card conversion-preview-in">
              <span class="conversion-preview-label">Alta</span>
              <strong class="conversion-preview-name">Unidades individuales</strong>
              <span class="conversion-preview-sku">${escapeHtml(targetProduct?.sku || '—')} · ${escapeHtml(targetProduct?.name || '—')}</span>
              <div class="conversion-stock-values"><span>${targetProduct?.stock ?? 0}</span><span>→</span><strong>${(targetProduct?.stock ?? 0) + generatedUnits}</strong><b>+${formatNumber(generatedUnits)}</b></div>
              <small>${escapeHtml(targetProduct?.unit || 'unidades')}</small>
            </div>
          </div>

          <div class="conversion-cost-note">
            <span>Costo unitario resultante</span>
            <strong>${formatCurrency(unitCostEstimated)}</strong>
            <small>Calculado sobre costo de caja ${formatCurrency(sourceProduct?.cost || 0)}</small>
          </div>

          <button
            type="button"
            class="btn btn-primary conversion-submit"
            ${isValid ? '' : 'disabled'}
            data-action="execute-kit-conversion"
          >
            Confirmar conversión (+${formatNumber(generatedUnits)} ${escapeHtml(targetProduct?.unit || 'unidades')})
          </button>
        </div>
      </section>
    </div>
  </div>`;
}
