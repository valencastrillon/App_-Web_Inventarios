/**
 * @fileoverview Capa de Servicios de Negocio para Inventario, Movimientos,
 * Conversión de Kits/Cajas, Carga Masiva y Sedes/Sucursales.
 */

import { store } from '../core/store.js';

/**
 * Abre el drawer para crear un nuevo producto con valores por defecto según la sede activa.
 */
export function openNewProductDrawer() {
  const state = store.getState();
  store.setState({
    editingProduct: null,
    productDraft: {
      name: '',
      subtitle: '',
      sku: `FER-0${state.products.length + 510}`,
      category: 'Ferretería',
      stock: '15',
      minStock: '10',
      unit: 'unid.',
      cost: '12500',
      price: '19800',
      location: 'Depósito Central · Pasillo A-1',
      branch: state.branchLocation === 'Todas las sedes' ? 'CD Norte' : state.branchLocation,
    },
    drawer: 'product',
  });
}

/**
 * Abre el drawer para editar un producto existente.
 * @param {string} productId
 */
export function openEditProductDrawer(productId) {
  const state = store.getState();
  const product = state.products.find((p) => p.id === productId);
  if (!product) return;

  store.setState({
    editingProduct: product,
    productDraft: {
      name: product.name,
      subtitle: product.subtitle,
      sku: product.sku,
      category: product.category,
      stock: String(product.stock),
      minStock: String(product.minStock),
      unit: product.unit,
      cost: String(product.cost),
      price: String(product.price),
      location: product.location,
      branch: product.branch,
    },
    drawer: 'product',
  });
}

/**
 * Guarda (crea o actualiza) el producto actualmente en `productDraft`.
 */
export function saveProductDraft() {
  const state = store.getState();
  const draft = state.productDraft;
  if (!draft.name.trim()) {
    store.showToast('Ingresá un nombre para el producto');
    return;
  }

  const normalized = {
    id: state.editingProduct ? state.editingProduct.id : String(Date.now()),
    name: draft.name.trim(),
    subtitle: draft.subtitle.trim() || 'Especificación estándar',
    sku: draft.sku.trim().toUpperCase() || 'GEN-0001',
    category: draft.category,
    stock: Math.max(0, Number(draft.stock) || 0),
    minStock: Math.max(0, Number(draft.minStock) || 0),
    unit: draft.unit.trim() || 'unid.',
    cost: Math.max(0, Number(draft.cost) || 0),
    price: Math.max(0, Number(draft.price) || 0),
    location: draft.location.trim() || 'Depósito Central',
    branch: draft.branch || 'CD Norte',
    updatedAt: 'ahora mismo',
  };

  const nextProducts = state.editingProduct
    ? state.products.map((p) => (p.id === state.editingProduct.id ? normalized : p))
    : [normalized, ...state.products];

  store.setState({
    products: nextProducts,
    drawer: null,
  });

  store.showToast(
    state.editingProduct
      ? `Producto ${normalized.sku} actualizado`
      : `Producto ${normalized.sku} creado en ${normalized.branch}`
  );
}

/**
 * Elimina un producto del catálogo por su ID.
 * @param {string} id
 */
export function removeProductById(id) {
  const state = store.getState();
  const target = state.products.find((p) => p.id === id);
  store.setState({
    products: state.products.filter((p) => p.id !== id),
    productsViewState: {
      ...state.productsViewState,
      menuRowId: null,
    },
  });
  if (target) {
    store.showToast(`Se eliminó "${target.name}" del catálogo`);
  }
}

/**
 * Registra un movimiento de inventario (Ingreso, Egreso, Ajuste, Transferencia)
 * y actualiza automáticamente el stock del artículo involucrado.
 */
export function saveMovementDraft() {
  const state = store.getState();
  const draft = state.movementDraft;
  const product = state.products.find((p) => p.id === draft.productId);
  if (!product) return;

  const rawQty = Number(draft.quantity) || 0;
  if (rawQty === 0) {
    store.showToast('La cantidad debe ser distinta de cero');
    return;
  }

  const delta =
    draft.type === 'Egreso' ? -Math.abs(rawQty) : draft.type === 'Ingreso' ? Math.abs(rawQty) : rawQty;

  const nextProducts = state.products.map((p) =>
    p.id === product.id ? { ...p, stock: Math.max(0, p.stock + delta), updatedAt: 'ahora mismo' } : p
  );

  const newMovement = {
    id: `MOV-${9043 + state.movements.length}`,
    date: 'Hoy · recién registrado',
    type: draft.type,
    productId: product.id,
    productName: product.name,
    sku: product.sku,
    quantity: Math.abs(rawQty),
    responsible: draft.responsible.trim() || 'L. Gómez',
    reference: draft.reference.trim() || 'Registro manual',
    branch: product.branch,
  };

  store.setState({
    products: nextProducts,
    movements: [newMovement, ...state.movements],
    drawer: null,
  });

  store.showToast(`${draft.type} registrado para ${product.sku}`);
}

/**
 * Crea una nueva categoría en el nomenclador.
 */
export function saveCategoryDraft() {
  const state = store.getState();
  const draft = state.categoryDraft;
  if (!draft.name.trim()) return;

  const newCat = {
    id: `CAT-0${state.categories.length + 1}`,
    name: draft.name.trim(),
    code: (draft.code.trim() || draft.name.slice(0, 3)).toUpperCase(),
    description: draft.description.trim() || 'Rubro operativo de almacén',
    targetMargin: Number(draft.targetMargin) || 40,
    location: draft.location.trim() || 'Depósito Central',
  };

  store.setState({
    categories: [...state.categories, newCat],
    drawer: null,
  });
  store.showToast(`Categoría "${newCat.name}" creada`);
}

/**
 * Importa un lote de productos validado desde un archivo CSV o Excel.
 * @param {Array<object>} rows
 */
export function importProductsBatch(rows) {
  const state = store.getState();
  const stamped = rows.map((row, index) => ({
    ...row,
    id: `IMP-${Date.now()}-${index}`,
    updatedAt: 'importado recién',
  }));

  store.setState({
    products: [...stamped, ...state.products],
    drawer: null,
  });
  store.showToast(`${stamped.length} productos importados al catálogo general`);
}

/**
 * Ejecuta la conversión de Kits o Cajas a unidades individuales,
 * descontando las cajas de origen, sumando las unidades destino y generando los
 * dos movimientos de trazabilidad (Egreso de bulto + Ingreso de unidades).
 */
export function executeKitConversion() {
  const state = store.getState();
  const conv = state.conversionState;
  const activeRecipe =
    state.kitRecipes.find((r) => r.id === conv.selectedRecipeId) || state.kitRecipes[0];

  const sourceId = conv.customMode ? conv.customSourceId : activeRecipe?.sourceProductId;
  const targetId = conv.customMode ? conv.customTargetId : activeRecipe?.targetProductId;
  const factor = Math.max(1, conv.customMode ? Number(conv.customFactor) || 1 : activeRecipe?.conversionFactor || 1);
  const qtyBoxes = Math.max(1, Number(conv.boxesToConvert) || 1);
  const generatedUnits = qtyBoxes * factor;

  const sourceProduct = state.products.find((p) => p.id === sourceId);
  const targetProduct = state.products.find((p) => p.id === targetId);

  if (!sourceProduct || !targetProduct) return;

  if (sourceId === targetId) {
    store.showToast('El producto de origen (caja/kit) y el de destino (unidad) deben ser distintos');
    return;
  }

  if (sourceProduct.stock < qtyBoxes) {
    store.showToast(
      `Stock insuficiente de "${sourceProduct.name}" (${sourceProduct.stock} disp.). Se requieren ${qtyBoxes}.`
    );
    return;
  }

  const nextProducts = state.products.map((p) => {
    if (p.id === sourceId) {
      return { ...p, stock: Math.max(0, p.stock - qtyBoxes), updatedAt: 'recién convertido' };
    }
    if (p.id === targetId) {
      return { ...p, stock: p.stock + generatedUnits, updatedAt: 'recién ingresado por desarme' };
    }
    return p;
  });

  const outMov = {
    id: `MOV-${9044 + state.movements.length}`,
    date: 'Hoy · conversión kit',
    type: 'Egreso',
    productId: sourceProduct.id,
    productName: sourceProduct.name,
    sku: sourceProduct.sku,
    quantity: qtyBoxes,
    responsible: conv.responsible,
    reference: `Desarme de ${qtyBoxes} caja(s)/kit(s) → ${generatedUnits} u. de ${targetProduct.sku}`,
    branch: conv.branch,
  };

  const inMov = {
    id: `MOV-${9045 + state.movements.length}`,
    date: 'Hoy · conversión kit',
    type: 'Ingreso',
    productId: targetProduct.id,
    productName: targetProduct.name,
    sku: targetProduct.sku,
    quantity: generatedUnits,
    responsible: conv.responsible,
    reference: `Ingreso fraccionado desde ${sourceProduct.sku} (factor x${factor})`,
    branch: conv.branch,
  };

  store.setState({
    products: nextProducts,
    movements: [inMov, outMov, ...state.movements],
  });

  store.showToast(
    `Conversión exitosa: -${qtyBoxes} ${sourceProduct.unit} (${sourceProduct.sku}) → +${generatedUnits} ${targetProduct.unit} (${targetProduct.sku})`
  );
}
