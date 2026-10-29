/**
 * @fileoverview Gestor de Drawers Modales Laterales:
 * - Alta / Edición de Producto (`product`)
 * - Registro de Movimiento de Stock (`movement`)
 * - Nueva Categoría (`category`)
 * - Homologación de Proveedor (`supplier`)
 * - Gestión de Sedes y Sucursales de Comercial Norte SRL (`branches`)
 * - Carga Masiva de Productos (`import` -> delegado a `BulkImportDrawer.js`)
 */

import { escapeHtml } from '../core/formatters.js';
import { icon } from '../core/icons.js';
import { renderBulkImportDrawer } from './BulkImportDrawer.js';

/**
 * Renderiza el drawer activo según `state.drawer`.
 * @param {object} state Estado global.
 * @returns {string} HTML string
 */
export function renderActiveDrawer(state) {
  const { drawer } = state;
  if (!drawer) return '';

  if (drawer === 'import') {
    return renderBulkImportDrawer(state);
  }

  if (drawer === 'product') {
    return renderProductDrawer(state);
  }

  if (drawer === 'movement') {
    return renderMovementDrawer(state);
  }

  if (drawer === 'category') {
    return renderCategoryDrawer(state);
  }

  if (drawer === 'supplier') {
    return renderSupplierDrawer(state);
  }

  if (drawer === 'branches') {
    return renderBranchesDrawer(state);
  }

  return '';
}

function renderProductDrawer(state) {
  const { editingProduct, productDraft: d, categories, branches } = state;
  const selectableBranches = branches.filter((b) => b.id !== 'all');

  return `<div class="drawer-backdrop" data-action="close-drawer">
    <aside
      class="drawer"
      role="dialog"
      aria-modal="true"
      aria-label="${editingProduct ? 'Editar producto' : 'Nuevo producto'}"
      data-stop-propagation="true"
    >
      <div class="drawer-header">
        <div>
          <div class="drawer-title">
            ${editingProduct ? `Editar ${escapeHtml(editingProduct.sku)}` : 'Dar de alta nuevo producto'}
          </div>
          <div style="font-size: 12.5px; color: var(--text-secondary); margin-top: 2px;">
            Completá la ficha técnica, sede asignada y niveles de stock de seguridad.
          </div>
        </div>
        <button type="button" class="icon-btn" data-action="close-drawer" aria-label="Cerrar">
          ${icon('x', 18)}
        </button>
      </div>

      <div class="drawer-body">
        <div class="field">
          <label for="prd-name">Nombre del producto *</label>
          <input
            id="prd-name"
            class="input"
            value="${escapeHtml(d.name)}"
            placeholder="Ej. Llave Térmica Tripolar 3x32A"
            data-draft="productDraft"
            data-field="name"
          />
        </div>

        <div class="field">
          <label for="prd-sub">Especificación / Subtítulo</label>
          <input
            id="prd-sub"
            class="input"
            value="${escapeHtml(d.subtitle)}"
            placeholder="Ej. Curva C · Normalizada IRAM"
            data-draft="productDraft"
            data-field="subtitle"
          />
        </div>

        <div class="form-grid">
          <div class="field">
            <label for="prd-sku">Código SKU *</label>
            <input
              id="prd-sku"
              class="input"
              value="${escapeHtml(d.sku)}"
              placeholder="ELE-0450"
              data-draft="productDraft"
              data-field="sku"
            />
          </div>
          <div class="field">
            <label for="prd-cat">Categoría</label>
            <select
              id="prd-cat"
              class="select"
              data-draft="productDraft"
              data-field="category"
            >
              ${categories
                .map(
                  (c) =>
                    `<option value="${escapeHtml(c.name)}" ${
                      d.category === c.name ? 'selected' : ''
                    }>${escapeHtml(c.name)}</option>`
                )
                .join('')}
            </select>
          </div>
        </div>

        <div class="form-grid">
          <div class="field">
            <label for="prd-stock">Stock actual</label>
            <input
              id="prd-stock"
              class="input"
              type="number"
              min="0"
              value="${escapeHtml(d.stock)}"
              data-draft="productDraft"
              data-field="stock"
            />
          </div>
          <div class="field">
            <label for="prd-min">Punto de pedido (mínimo)</label>
            <input
              id="prd-min"
              class="input"
              type="number"
              min="0"
              value="${escapeHtml(d.minStock)}"
              data-draft="productDraft"
              data-field="minStock"
            />
          </div>
        </div>

        <div class="form-grid">
          <div class="field">
            <label for="prd-cost">Costo unitario (ARS)</label>
            <input
              id="prd-cost"
              class="input"
              type="number"
              min="0"
              value="${escapeHtml(d.cost)}"
              data-draft="productDraft"
              data-field="cost"
            />
          </div>
          <div class="field">
            <label for="prd-price">Precio de venta (ARS)</label>
            <input
              id="prd-price"
              class="input"
              type="number"
              min="0"
              value="${escapeHtml(d.price)}"
              data-draft="productDraft"
              data-field="price"
            />
          </div>
        </div>

        <div class="form-grid">
          <div class="field">
            <label for="prd-branch">Sede / Sucursal</label>
            <select
              id="prd-branch"
              class="select"
              data-draft="productDraft"
              data-field="branch"
            >
              ${selectableBranches
                .map(
                  (b) =>
                    `<option value="${escapeHtml(b.name)}" ${
                      d.branch === b.name ? 'selected' : ''
                    }>${escapeHtml(b.name)}</option>`
                )
                .join('')}
            </select>
          </div>
          <div class="field">
            <label for="prd-loc">Ubicación física</label>
            <input
              id="prd-loc"
              class="input"
              value="${escapeHtml(d.location)}"
              data-draft="productDraft"
              data-field="location"
            />
          </div>
        </div>
      </div>

      <div class="drawer-footer">
        <button type="button" class="btn btn-secondary" data-action="close-drawer">
          Cancelar
        </button>
        <button type="button" class="btn btn-primary" data-action="save-product">
          ${icon('save', 15)}
          ${editingProduct ? 'Guardar cambios' : 'Crear producto'}
        </button>
      </div>
    </aside>
  </div>`;
}

function renderMovementDrawer(state) {
  const { movementDraft: d, products } = state;
  const types = ['Ingreso', 'Egreso', 'Ajuste', 'Transferencia'];

  return `<div class="drawer-backdrop" data-action="close-drawer">
    <aside
      class="drawer"
      role="dialog"
      aria-modal="true"
      aria-label="Registrar movimiento de stock"
      data-stop-propagation="true"
    >
      <div class="drawer-header">
        <div>
          <div class="drawer-title">Registrar movimiento de stock</div>
          <div style="font-size: 12.5px; color: var(--text-secondary); margin-top: 2px;">
            Impacta automáticamente sobre las existencias del artículo seleccionado.
          </div>
        </div>
        <button type="button" class="icon-btn" data-action="close-drawer" aria-label="Cerrar">
          ${icon('x', 18)}
        </button>
      </div>

      <div class="drawer-body">
        <div class="field">
          <label>Tipo de operación</label>
          <div class="segmented" style=" display: grid; grid-template-columns: repeat(4, 1fr);">
            ${types
              .map(
                (t) =>
                  `<button
                    type="button"
                    class="seg-btn ${d.type === t ? 'active' : ''}"
                    data-action="set-movement-type"
                    data-mov-type="${t}"
                  >${t}</button>`
              )
              .join('')}
          </div>
        </div>

        <div class="field">
          <label for="mov-product">Producto afectado</label>
          <select
            id="mov-product"
            class="select"
            data-draft="movementDraft"
            data-field="productId"
          >
            ${products
              .map(
                (p) =>
                  `<option value="${escapeHtml(p.id)}" ${
                    d.productId === p.id ? 'selected' : ''
                  }>${escapeHtml(p.sku)} — ${escapeHtml(p.name)} (Stock: ${p.stock} ${escapeHtml(
                    p.unit
                  )})</option>`
              )
              .join('')}
          </select>
        </div>

        <div class="form-grid">
          <div class="field">
            <label for="mov-qty">Cantidad</label>
            <input
              id="mov-qty"
              class="input"
              type="number"
              value="${escapeHtml(d.quantity)}"
              data-draft="movementDraft"
              data-field="quantity"
            />
          </div>
          <div class="field">
            <label for="mov-resp">Operador responsable</label>
            <input
              id="mov-resp"
              class="input"
              value="${escapeHtml(d.responsible)}"
              data-draft="movementDraft"
              data-field="responsible"
            />
          </div>
        </div>

        <div class="field">
          <label for="mov-ref">Documento / Referencia</label>
          <input
            id="mov-ref"
            class="input"
            value="${escapeHtml(d.reference)}"
            placeholder="Ej. OC #4418 · Remito #10902"
            data-draft="movementDraft"
            data-field="reference"
          />
        </div>
      </div>

      <div class="drawer-footer">
        <button type="button" class="btn btn-secondary" data-action="close-drawer">
          Cancelar
        </button>
        <button type="button" class="btn btn-primary" data-action="save-movement">
          ${icon('save', 15)} Confirmar movimiento
        </button>
      </div>
    </aside>
  </div>`;
}

function renderCategoryDrawer(state) {
  const { categoryDraft: d } = state;

  return `<div class="drawer-backdrop" data-action="close-drawer">
    <aside
      class="drawer"
      role="dialog"
      aria-modal="true"
      aria-label="Nueva categoría"
      data-stop-propagation="true"
    >
      <div class="drawer-header">
        <div class="drawer-title">Crear categoría de inventario</div>
        <button type="button" class="icon-btn" data-action="close-drawer" aria-label="Cerrar">
          ${icon('x', 18)}
        </button>
      </div>

      <div class="drawer-body">
        <div class="form-grid">
          <div class="field">
            <label for="cat-name">Nombre del rubro *</label>
            <input
              id="cat-name"
              class="input"
              value="${escapeHtml(d.name)}"
              placeholder="Ej. Hidráulica y Gas"
              data-draft="categoryDraft"
              data-field="name"
            />
          </div>
          <div class="field">
            <label for="cat-code">Prefijo SKU (3 letras)</label>
            <input
              id="cat-code"
              class="input"
              maxlength="4"
              value="${escapeHtml(d.code)}"
              placeholder="HID"
              data-draft="categoryDraft"
              data-field="code"
            />
          </div>
        </div>

        <div class="field">
          <label for="cat-desc">Descripción operativa</label>
          <textarea
            id="cat-desc"
            class="textarea"
            placeholder="Detalle de artículos incluidos en la categoría..."
            data-draft="categoryDraft"
            data-field="description"
          >${escapeHtml(d.description)}</textarea>
        </div>

        <div class="form-grid">
          <div class="field">
            <label for="cat-margin">Margen objetivo (%)</label>
            <input
              id="cat-margin"
              class="input"
              type="number"
              value="${escapeHtml(d.targetMargin)}"
              data-draft="categoryDraft"
              data-field="targetMargin"
            />
          </div>
          <div class="field">
            <label for="cat-loc">Sector de depósito</label>
            <input
              id="cat-loc"
              class="input"
              value="${escapeHtml(d.location)}"
              data-draft="categoryDraft"
              data-field="location"
            />
          </div>
        </div>
      </div>

      <div class="drawer-footer">
        <button type="button" class="btn btn-secondary" data-action="close-drawer">
          Cancelar
        </button>
        <button type="button" class="btn btn-primary" data-action="save-category">
          ${icon('save', 15)} Guardar categoría
        </button>
      </div>
    </aside>
  </div>`;
}

function renderSupplierDrawer(state) {
  const { supplierDraft: d, categories } = state;

  return `<div class="drawer-backdrop" data-action="close-drawer">
    <aside
      class="drawer"
      role="dialog"
      aria-modal="true"
      aria-label="Homologar proveedor"
      data-stop-propagation="true"
    >
      <div class="drawer-header">
        <div class="drawer-title">Homologar nuevo proveedor</div>
        <button type="button" class="icon-btn" data-action="close-drawer" aria-label="Cerrar">
          ${icon('x', 18)}
        </button>
      </div>

      <div class="drawer-body">
        <div class="field">
          <label for="sup-name">Razón Social *</label>
          <input
            id="sup-name"
            class="input"
            value="${escapeHtml(d.name)}"
            placeholder="Ej. Metalúrgica del Oeste S.A."
            data-draft="supplierDraft"
            data-field="name"
          />
        </div>

        <div class="form-grid">
          <div class="field">
            <label for="sup-cuit">CUIT</label>
            <input
              id="sup-cuit"
              class="input"
              value="${escapeHtml(d.cuit)}"
              data-draft="supplierDraft"
              data-field="cuit"
            />
          </div>
          <div class="field">
            <label for="sup-cat">Rubro principal</label>
            <select
              id="sup-cat"
              class="select"
              data-draft="supplierDraft"
              data-field="category"
            >
              ${categories
                .map(
                  (c) =>
                    `<option value="${escapeHtml(c.name)}" ${
                      d.category === c.name ? 'selected' : ''
                    }>${escapeHtml(c.name)}</option>`
                )
                .join('')}
            </select>
          </div>
        </div>

        <div class="form-grid">
          <div class="field">
            <label for="sup-contact">Ejecutivo de cuenta</label>
            <input
              id="sup-contact"
              class="input"
              value="${escapeHtml(d.contact)}"
              placeholder="Nombre y Apellido"
              data-draft="supplierDraft"
              data-field="contact"
            />
          </div>
          <div class="field">
            <label for="sup-lead">Lead time (días)</label>
            <input
              id="sup-lead"
              class="input"
              type="number"
              min="1"
              value="${escapeHtml(d.leadTimeDays)}"
              data-draft="supplierDraft"
              data-field="leadTimeDays"
            />
          </div>
        </div>

        <div class="form-grid">
          <div class="field">
            <label for="sup-email">Email de pedidos</label>
            <input
              id="sup-email"
              class="input"
              type="email"
              value="${escapeHtml(d.email)}"
              data-draft="supplierDraft"
              data-field="email"
            />
          </div>
          <div class="field">
            <label for="sup-phone">Teléfono</label>
            <input
              id="sup-phone"
              class="input"
              value="${escapeHtml(d.phone)}"
              data-draft="supplierDraft"
              data-field="phone"
            />
          </div>
        </div>
      </div>

      <div class="drawer-footer">
        <button type="button" class="btn btn-secondary" data-action="close-drawer">
          Cancelar
        </button>
        <button type="button" class="btn btn-primary" data-action="save-supplier">
          ${icon('save', 15)} Homologar proveedor
        </button>
      </div>
    </aside>
  </div>`;
}

function renderBranchesDrawer(state) {
  const { branches, branchLocation, products, branchDraft: d } = state;

  return `<div class="drawer-backdrop" data-action="close-drawer">
    <aside
      class="drawer drawer-wide"
      role="dialog"
      aria-modal="true"
      aria-label="Sedes y Sucursales de Comercial Norte SRL"
      data-stop-propagation="true"
    >
      <div class="drawer-header">
        <div>
          <div class="drawer-title">Sedes y Sucursales — Comercial Norte SRL</div>
          <div style="font-size: 12.5px; color: var(--text-secondary); margin-top: 2px;">
            Visualizá el estado operativo de cada planta o cambiá la sede activa de trabajo.
          </div>
        </div>
        <button type="button" class="icon-btn" data-action="close-drawer" aria-label="Cerrar">
          ${icon('x', 18)}
        </button>
      </div>

      <div class="drawer-body">
        <div class="branches-modal-grid">
          ${branches
            .map((b) => {
              const isSelected = branchLocation === b.name;
              const branchSkus =
                b.name === 'Todas las sedes'
                  ? products.length
                  : products.filter((p) => p.branch === b.name).length;

              return `<div class="branch-modal-card ${isSelected ? 'selected' : ''}">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;">
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <div class="kpi-icon tone-blue" style="width: 36px; height: 36px;">
                      ${icon('building2', 18)}
                    </div>
                    <div>
                      <div style="font-weight: 700; font-size: 14px; color: var(--text-primary);">
                        ${escapeHtml(b.name)}
                      </div>
                      <div style="font-size: 12px; color: var(--text-secondary);">
                        ${escapeHtml(b.city)}
                      </div>
                    </div>
                  </div>
                  <span class="badge ${b.status === 'Operativa' ? 'badge-success' : 'badge-warning'}">
                    <span class="badge-dot"></span>
                    ${escapeHtml(b.status)}
                  </span>
                </div>

                <div style="font-size: 12px; color: var(--text-secondary); display: flex; flex-direction: column; gap: 5px; margin: 10px 0;">
                  <div style="display: flex; align-items: center; gap: 6px;">
                    ${icon('mapPin', 13)} ${escapeHtml(b.address)}
                  </div>
                  <div style="display: flex; align-items: center; gap: 6px;">
                    ${icon('userCheck', 13)} Responsable: <strong>${escapeHtml(b.manager)}</strong> · ${escapeHtml(b.phone)}
                  </div>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 10px; border-top: 1px solid var(--border);">
                  <div style="font-size: 12px; color: var(--text-secondary);">
                    <strong class="tabular" style="color: var(--text-primary);">${branchSkus} SKUs</strong> · Ocupación ${b.occupancy}%
                  </div>
                  <button
                    type="button"
                    class="btn btn-sm ${isSelected ? 'btn-primary' : 'btn-secondary'}"
                    data-action="select-branch-and-close"
                    data-branch="${escapeHtml(b.name)}"
                  >
                    ${isSelected ? `${icon('checkCircle2', 14)} Sede activa` : 'Cambiar a esta sede'}
                  </button>
                </div>
              </div>`;
            })
            .join('')}
        </div>

        <div class="panel" style="margin-top: 12px;">
          <div class="panel-header">
            <div>
              <div class="panel-title">Incorporar nueva Sede o Sucursal a la empresa</div>
              <div class="panel-subtitle">
                Habilitá un nuevo centro de distribución o punto de venta dentro de Comercial Norte SRL
              </div>
            </div>
          </div>
          <div class="panel-body">
            <div class="form-grid">
              <div class="field">
                <label>Nombre de la Sede *</label>
                <input
                  class="input"
                  value="${escapeHtml(d.name)}"
                  placeholder="Ej. Sucursal Oeste (Morón)"
                  data-draft="branchDraft"
                  data-field="name"
                />
              </div>
              <div class="field">
                <label>Ciudad / Zona</label>
                <input
                  class="input"
                  value="${escapeHtml(d.city)}"
                  placeholder="Ej. Morón, GBA Oeste"
                  data-draft="branchDraft"
                  data-field="city"
                />
              </div>
              <div class="field">
                <label>Dirección operativa</label>
                <input
                  class="input"
                  value="${escapeHtml(d.address)}"
                  placeholder="Av. Rivadavia 18400"
                  data-draft="branchDraft"
                  data-field="address"
                />
              </div>
              <div class="field">
                <label>Encargado de Sede</label>
                <input
                  class="input"
                  value="${escapeHtml(d.manager)}"
                  placeholder="Nombre del responsable"
                  data-draft="branchDraft"
                  data-field="manager"
                />
              </div>
            </div>
            <div style="display: flex; justify-content: flex-end; margin-top: 12px;">
              <button type="button" class="btn btn-primary btn-sm" data-action="save-branch">
                ${icon('plus', 14)} Dar de alta sucursal
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="drawer-footer">
        <button type="button" class="btn btn-secondary" data-action="close-drawer">
          Cerrar ventana
        </button>
      </div>
    </aside>
  </div>`;
}
