/**
 * @fileoverview Punto de entrada principal (Entry Point) de la aplicación Logic Control.
 * Coordina el ciclo de renderizado declarativo sobre el DOM, preserva el foco de
 * los campos de entrada activos y centraliza los eventos mediante Event Delegation.
 */

import { renderActiveDrawer } from './components/DrawerManager.js';
import { renderHeader } from './components/Header.js';
import { renderSidebar } from './components/Sidebar.js';
import { parseBulkFile } from './core/formatters.js';
import { icon } from './core/icons.js';
import { initRouter, navigate, navigateFromMenu } from './core/router.js';
import { store } from './core/store.js';
import {
  createNewUser,
  loginSession,
  logoutSession,
  submitPasswordChange,
  toggleUserEnabled,
  updateUserRole,
} from './services/authService.js';
import {
  executeKitConversion,
  importProductsBatch,
  openEditProductDrawer,
  openNewProductDrawer,
  removeProductById,
  saveCategoryDraft,
  saveMovementDraft,
  saveProductDraft,
} from './services/inventoryService.js';
import { renderConversionView } from './views/ConversionView.js';
import { renderDashboardView } from './views/DashboardView.js';
import { renderCategoriesView } from './views/DirectoriesView.js';
import { renderLoginView } from './views/LoginView.js';
import { renderMovementsView } from './views/MovementsView.js';
import { renderProductsView } from './views/ProductsView.js';
import { renderReportsView } from './views/ReportsView.js';
import { renderSettingsView } from './views/SettingsView.js';

const rootEl = document.getElementById('root');

async function loadBulkFile(file) {
  const state = store.getState();
  const defaultBranch = state.branchLocation === 'Todas las sedes' ? 'CD Norte' : state.branchLocation;
  try {
    const parsed = await parseBulkFile(file, state.branches, defaultBranch);
    store.setState({ bulkImportState: { ...state.bulkImportState, fileName: file.name, csvPreview: parsed.products, csvErrors: parsed.errors, csvStats: parsed.stats, columnsError: parsed.columnsError } });
  } catch (error) {
    store.setState({ bulkImportState: { ...state.bulkImportState, fileName: file.name, csvPreview: [], csvErrors: [{ row: 0, messages: [error.message || 'No se pudo leer el archivo'] }], columnsError: 'No se pudo leer el archivo. Verificá que sea un CSV o XLSX válido.' } });
  }
}

/**
 * Renderiza la vista activa según `state.screen`.
 * @param {object} state
 * @returns {string}
 */
function renderCurrentScreen(state) {
  switch (state.screen) {
    case 'dashboard':
      return renderDashboardView(state);
    case 'productos':
      return renderProductsView(state);
    case 'conversion':
      return renderConversionView(state);
    case 'movimientos':
      return renderMovementsView(state);
    case 'categorias':
      return renderCategoriesView(state);
    case 'reportes':
      return renderReportsView(state);
    case 'configuracion':
      return renderSettingsView(state);
    default:
      return renderDashboardView(state);
  }
}

/**
 * Renderiza el árbol completo de la aplicación preservando el foco y posición del cursor
 * en inputs activos (como buscadores o celdas de formulario).
 */
function renderApp() {
  const state = store.getState();

  // Capturar elemento con foco antes de actualizar el DOM
  const activeEl = document.activeElement;
  const focusDescriptor = activeEl
    ? {
        id: activeEl.id || null,
        dataInput: activeEl.getAttribute?.('data-input') || null,
        dataSettingInput: activeEl.getAttribute?.('data-setting-input') || null,
        dataLoginInput: activeEl.getAttribute?.('data-login-input') || null,
        dataDraft: activeEl.getAttribute?.('data-draft') || null,
        dataField: activeEl.getAttribute?.('data-field') || null,
        selectionStart: typeof activeEl.selectionStart === 'number' ? activeEl.selectionStart : null,
        selectionEnd: typeof activeEl.selectionEnd === 'number' ? activeEl.selectionEnd : null,
      }
    : null;

  if (!state.authenticated) {
    rootEl.innerHTML = `
      ${renderLoginView(state)}
      ${renderToast(state.toast)}
    `;
  } else {
    const shellClasses = 'app-shell';

    rootEl.innerHTML = `
      <div class="${shellClasses}">
        ${renderSidebar(state)}

        <div class="main-area">
          ${renderHeader(state)}
          <main class="content-scroll">
            ${renderCurrentScreen(state)}
          </main>
        </div>

        ${renderActiveDrawer(state)}
        ${renderToast(state.toast)}
      </div>
    `;
  }

  // Restaurar foco si el usuario estaba escribiendo en un input
  restoreFocus(focusDescriptor);
}

function renderToast(toastMessage) {
  if (!toastMessage) return '';
  return `<div class="toast-stack" role="status" aria-live="polite">
    <div class="toast">
      ${icon('checkCircle2', 16)}
      <span>${toastMessage}</span>
    </div>
  </div>`;
}

function restoreFocus(desc) {
  if (!desc) return;
  let target = null;

  if (desc.id) {
    target = document.getElementById(desc.id);
  } else if (desc.dataDraft && desc.dataField) {
    target = document.querySelector(
      `[data-draft="${desc.dataDraft}"][data-field="${desc.dataField}"]`
    );
  } else if (desc.dataSettingInput) {
    target = document.querySelector(`[data-setting-input="${desc.dataSettingInput}"]`);
  } else if (desc.dataLoginInput) {
    target = document.querySelector(`[data-login-input="${desc.dataLoginInput}"]`);
  } else if (desc.dataInput) {
    target = document.querySelector(`[data-input="${desc.dataInput}"]`);
  }

  if (target && typeof target.focus === 'function') {
    target.focus();
    if (
      desc.selectionStart !== null &&
      typeof target.setSelectionRange === 'function' &&
      target.type !== 'number' &&
      target.type !== 'email'
    ) {
      try {
        target.setSelectionRange(desc.selectionStart, desc.selectionEnd);
      } catch {
        // Algunos tipos de input no admiten setSelectionRange
      }
    }
  }
}

/* ============================================================================
   DELEGACIÓN CENTRALIZADA DE EVENTOS (CLICK, INPUT, CHANGE, SUBMIT, KEYDOWN)
   ============================================================================ */

rootEl.addEventListener('click', (event) => {
  // Evitar que clics dentro de un drawer lo cierren por el backdrop
  const actionBtn = event.target.closest('[data-action]');
  if (!actionBtn) return;

  // Si hizo clic en el contenedor del drawer pero no en el backdrop mismo, ignorar close-drawer
  if (
    actionBtn.dataset.action === 'close-drawer' &&
    event.target !== actionBtn &&
    event.target.closest('[data-stop-propagation="true"]')
  ) {
    return;
  }

  const action = actionBtn.dataset.action;
  const state = store.getState();

  switch (action) {
    // Navegación desde el menú lateral (oculta el menú automáticamente al entrar)
    case 'nav-menu': {
      const targetScreen = actionBtn.dataset.screen;
      if (targetScreen) navigateFromMenu(targetScreen);
      break;
    }

    // Navegación interna desde botones de la página
    case 'nav': {
      const targetScreen = actionBtn.dataset.screen;
      if (targetScreen) navigate(targetScreen);
      break;
    }

    // Modo Oscuro / Claro
    case 'set-theme': {
      const nextTheme = actionBtn.dataset.theme;
      if (nextTheme === 'light' || nextTheme === 'dark') {
        store.setState({ theme: nextTheme });
      }
      break;
    }

    case 'toggle-theme': {
      store.setState({ theme: state.theme === 'dark' ? 'light' : 'dark' });
      break;
    }

    // Sedes y Sucursales
    case 'toggle-branch-menu': {
      store.setState({ branchMenuOpen: !state.branchMenuOpen });
      break;
    }

    case 'select-branch': {
      const branch = actionBtn.dataset.branch;
      if (branch) {
        store.setState({ branchLocation: branch, branchMenuOpen: false });
      }
      break;
    }

    case 'select-branch-and-close': {
      const branch = actionBtn.dataset.branch;
      if (branch) {
        store.setState({ branchLocation: branch, drawer: null, branchMenuOpen: false });
        store.showToast(`Visualizando inventario de: ${branch}`);
      }
      break;
    }

    case 'open-branches-drawer': {
      store.setState({ drawer: 'branches', branchMenuOpen: false });
      break;
    }


    // Alertas y Centro de Ayuda
    case 'open-alerts': {
      navigate('reportes');
      store.showToast('Mostrando artículos con alerta de reposición');
      break;
    }

    case 'show-help-toast': {
      store.showToast('Centro de soporte: soporte@logiccontrol.ar · Línea directa int. 402');
      break;
    }

    // Login y Google Workspace SSO
    case 'toggle-google-picker': {
      store.setState({
        loginState: {
          ...state.loginState,
          googlePickerOpen: !state.loginState.googlePickerOpen,
        },
      });
      break;
    }

    case 'google-login-account': {
      const name = actionBtn.dataset.accountName || 'Operador';
      const email = actionBtn.dataset.accountEmail || '';
      loginSession(`Autenticado con Google Workspace: ${name} (${email})`);
      break;
    }

    case 'forgot-password-toast': {
      store.setState({
        loginState: {
          ...state.loginState,
          error: 'Contactá al administrador de sistemas para blanquear tu clave corporativa.',
        },
      });
      break;
    }

    case 'logout': {
      logoutSession();
      break;
    }

    // Drawers de Productos, Movimientos, Categorías y Carga Masiva
    case 'new-product': {
      openNewProductDrawer();
      break;
    }

    case 'edit-product': {
      const id = actionBtn.dataset.productId;
      store.setState({
        productsViewState: { ...state.productsViewState, menuRowId: null },
      });
      if (id) openEditProductDrawer(id);
      break;
    }

    case 'delete-product': {
      const id = actionBtn.dataset.productId;
      if (id) removeProductById(id);
      break;
    }

    case 'toggle-product-row-menu': {
      const id = actionBtn.dataset.productId;
      const current = state.productsViewState.menuRowId;
      store.setState({
        productsViewState: {
          ...state.productsViewState,
          menuRowId: current === id ? null : id,
        },
      });
      break;
    }

    case 'save-product': {
      saveProductDraft();
      break;
    }

    case 'open-movement-drawer': {
      store.setState({ drawer: 'movement' });
      break;
    }

    case 'set-movement-type': {
      const movType = actionBtn.dataset.movType;
      if (movType) {
        store.setState({
          movementDraft: { ...state.movementDraft, type: movType },
        });
      }
      break;
    }

    case 'save-movement': {
      saveMovementDraft();
      break;
    }

    case 'open-category-drawer': {
      store.setState({ drawer: 'category' });
      break;
    }

    case 'save-category': {
      saveCategoryDraft();
      break;
    }

    case 'open-import-drawer': {
      store.setState({ drawer: 'import' });
      break;
    }

    case 'close-drawer': {
      store.setState({ drawer: null });
      break;
    }

    case 'trigger-csv-input': {
      const fileInput = document.getElementById('bulk-csv-file-input');
      if (fileInput) fileInput.click();
      break;
    }

    case 'clear-bulk-file': {
      store.setState({ bulkImportState: { ...state.bulkImportState, csvPreview: [], csvErrors: [], csvStats: { totalRows: 0, validRows: 0, invalidRows: 0, totalUnits: 0, totalValuation: 0 }, columnsError: '', fileName: '' } });
      break;
    }

    case 'download-csv-template': {
      const sample = [
        'nombre,subtitulo,sku,categoria,stock,stock_minimo,unidad,costo,precio,ubicacion,sede',
        'Multímetro Digital True RMS,Pantalla retroiluminada,ELE-0901,Electricidad,35,10,unid.,24500,38900,Depósito Central · Pasillo B-2,CD Norte',
        'Botín de Seguridad Punta Acero,Talle 42 · Cuero flor,SEG-0310,Seguridad Ind.,22,12,pares,38000,59500,Depósito Central · Pasillo D-2,Sucursal Centro',
        'Esmalte Sintético Antióxido 4L,Negro brillante,PIN-0402,Pinturería,19,8,latas,21900,33900,Depósito Sur · Sector C,Depósito Sur',
      ].join('\n');
      const blob = new Blob([sample], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'plantilla-logic-control-productos.csv';
      a.click();
      URL.revokeObjectURL(url);
      break;
    }

    case 'submit-bulk-csv': {
      if (state.bulkImportState.csvPreview.length > 0) {
        importProductsBatch(state.bulkImportState.csvPreview);
      }
      break;
    }

    // Filtros de Dashboard
    case 'set-dashboard-period': {
      const period = actionBtn.dataset.period;
      if (period) {
        store.setState({
          dashboardState: { ...state.dashboardState, period },
        });
      }
      break;
    }

    case 'reset-dashboard-filters': {
      store.setState({
        branchLocation: 'Todas las sedes',
        dashboardState: {
          ...state.dashboardState,
          categoryFilter: 'Todas',
          statusFilter: 'Todos',
        },
      });
      break;
    }

    // Paginación y exportación de Productos
    case 'set-products-page': {
      const page = Number(actionBtn.dataset.page) || 1;
      store.setState({
        productsViewState: { ...state.productsViewState, page },
      });
      break;
    }

    case 'reset-products-filters': {
      store.setState({
        productsViewState: {
          ...state.productsViewState,
          search: '',
          category: 'Todas',
          status: 'Todos',
          page: 1,
        },
      });
      break;
    }

    case 'export-products-csv': {
      const header = 'SKU,Producto,Categoria,Sede,Stock,Minimo,Unidad,Costo,Precio,Ubicacion';
      const rows = state.products.map(
        (p) =>
          `"${p.sku}","${p.name}","${p.category}","${p.branch}",${p.stock},${p.minStock},"${p.unit}",${p.cost},${p.price},"${p.location}"`
      );
      const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'logic-control-catalogo.csv';
      a.click();
      URL.revokeObjectURL(url);
      store.showToast(`Catálogo exportado (${state.products.length} registros)`);
      break;
    }

    // Conversión de Kits / Cajas
    case 'toggle-custom-conversion': {
      store.setState({
        conversionState: {
          ...state.conversionState,
          customMode: !state.conversionState.customMode,
        },
      });
      break;
    }

    case 'select-kit-recipe': {
      const recipeId = actionBtn.dataset.recipeId;
      if (recipeId) {
        store.setState({
          conversionState: {
            ...state.conversionState,
            customMode: false,
            selectedRecipeId: recipeId,
          },
        });
      }
      break;
    }

    case 'execute-kit-conversion': {
      executeKitConversion();
      break;
    }

    // Movimientos y Reportes
    case 'set-movements-type': {
      const filter = actionBtn.dataset.movFilter;
      if (filter) {
        store.setState({
          movementsViewState: { ...state.movementsViewState, typeFilter: filter },
        });
      }
      break;
    }

    case 'reset-movements-filters': {
      store.setState({
        movementsViewState: { search: '', typeFilter: 'Todos' },
      });
      break;
    }

    case 'export-movements-toast': {
      store.showToast('Reporte de movimientos exportado a CSV');
      break;
    }

    case 'export-report-toast': {
      store.showToast('Informe ejecutivo de valorización descargado');
      break;
    }

    // Configuración, Usuarios y Seguridad de Contraseña
    case 'save-settings': {
      store.showToast('Preferencias del sistema guardadas correctamente');
      break;
    }

    case 'toggle-add-user': {
      store.setState({
        settingsState: {
          ...state.settingsState,
          addingUser: !state.settingsState.addingUser,
        },
      });
      break;
    }

    case 'cancel-add-user': {
      store.setState({
        settingsState: {
          ...state.settingsState,
          addingUser: false,
        },
      });
      break;
    }

    case 'toggle-user-enabled': {
      const userId = actionBtn.dataset.userId;
      if (userId) toggleUserEnabled(userId);
      break;
    }

    case 'toggle-show-passwords': {
      store.setState({
        settingsState: {
          ...state.settingsState,
          showPasswords: !state.settingsState.showPasswords,
        },
      });
      break;
    }

    case 'clear-password-fields': {
      store.setState({
        settingsState: {
          ...state.settingsState,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        },
      });
      break;
    }

    default:
      break;
  }
});

/* Eventos de entrada de texto en tiempo real (input) */
rootEl.addEventListener('input', (event) => {
  const target = event.target;
  const state = store.getState();

  // Buscador de catálogo de productos
  if (target.dataset.input === 'products-search') {
    store.setState({
      productsViewState: {
        ...state.productsViewState,
        search: target.value,
        page: 1,
      },
    });
    return;
  }

  // Buscador de movimientos
  if (target.dataset.input === 'movements-search') {
    store.setState({
      movementsViewState: {
        ...state.movementsViewState,
        search: target.value,
      },
    });
    return;
  }

  // Inputs de Login
  if (target.dataset.loginInput) {
    const field = target.dataset.loginInput;
    store.setState({
      loginState: {
        ...state.loginState,
        [field]: target.value,
        error: '',
      },
    });
    return;
  }

  // Inputs de borradores de Drawers (producto, movimiento, categoría y sede)
  if (target.dataset.draft && target.dataset.field) {
    const draftName = target.dataset.draft;
    const field = target.dataset.field;
    store.setState({
      [draftName]: {
        ...state[draftName],
        [field]: target.value,
      },
    });
    return;
  }

  // Inputs del Conversor de Kits
  if (target.dataset.conversionInput) {
    const field = target.dataset.conversionInput;
    store.setState({
      conversionState: {
        ...state.conversionState,
        [field]: target.value,
      },
    });
    return;
  }

  // Inputs de Configuración y Contraseña
  if (target.dataset.settingInput) {
    const field = target.dataset.settingInput;
    store.setState({
      settingsState: {
        ...state.settingsState,
        [field]: target.value,
        passwordSavedMessage:
          field.includes('Password') ? '' : state.settingsState.passwordSavedMessage,
      },
    });
  }
});

/* Eventos de cambio en selects, checkboxes y archivos (change) */
rootEl.addEventListener('change', (event) => {
  const target = event.target;
  const state = store.getState();

  // Archivo CSV / Excel en Carga Masiva
  if (target.id === 'bulk-csv-file-input') {
    const file = target.files?.[0];
    if (!file) return;
    loadBulkFile(file);
    return;
  }

  // Filtros en Dashboard
  if (target.dataset.action === 'set-dashboard-category') {
    store.setState({
      dashboardState: { ...state.dashboardState, categoryFilter: target.value },
    });
    return;
  }

  if (target.dataset.action === 'set-dashboard-status') {
    store.setState({
      dashboardState: { ...state.dashboardState, statusFilter: target.value },
    });
    return;
  }

  // Filtros en Productos
  if (target.dataset.action === 'set-products-category') {
    store.setState({
      productsViewState: { ...state.productsViewState, category: target.value, page: 1 },
    });
    return;
  }

  if (target.dataset.action === 'set-products-status') {
    store.setState({
      productsViewState: { ...state.productsViewState, status: target.value, page: 1 },
    });
    return;
  }

  if (target.dataset.action === 'set-products-sort') {
    store.setState({
      productsViewState: { ...state.productsViewState, sortBy: target.value },
    });
    return;
  }

  // Cambio de rol de usuario en Configuración
  if (target.dataset.action === 'change-user-role') {
    const userId = target.dataset.userId;
    if (userId) updateUserRole(userId, target.value);
    return;
  }

  // Checkboxes de Login
  if (target.dataset.loginCheckbox === 'remember') {
    store.setState({
      loginState: { ...state.loginState, remember: target.checked },
    });
    return;
  }

  // Checkboxes de Configuración
  if (target.dataset.settingCheckbox) {
    const key = target.dataset.settingCheckbox;
    store.setState({
      settingsState: { ...state.settingsState, [key]: target.checked },
    });
  }
});

rootEl.addEventListener('dragover', (event) => {
  const area = event.target.closest('.bulk-upload-area');
  if (!area) return;
  event.preventDefault();
  area.classList.add('is-dragging');
});

rootEl.addEventListener('dragleave', (event) => {
  const area = event.target.closest('.bulk-upload-area');
  if (area && !area.contains(event.relatedTarget)) area.classList.remove('is-dragging');
});

rootEl.addEventListener('drop', (event) => {
  const area = event.target.closest('.bulk-upload-area');
  if (!area) return;
  event.preventDefault();
  area.classList.remove('is-dragging');
  const file = event.dataTransfer?.files?.[0];
  if (file) loadBulkFile(file);
});

/* Eventos de envío de formularios (submit) */
rootEl.addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.target;
  const formType = form.dataset.form;
  const state = store.getState();

  if (formType === 'login') {
    const { email, password } = state.loginState;
    if (!email.trim() || !password.trim()) {
      store.setState({
        loginState: {
          ...state.loginState,
          error: 'Completá tu correo corporativo y contraseña para continuar.',
        },
      });
      return;
    }
    loginSession('Sesión iniciada correctamente');
    return;
  }

  if (formType === 'add-user') {
    createNewUser();
    return;
  }

  if (formType === 'change-password') {
    submitPasswordChange();
  }
});

/* Atajo global para cerrar drawers y menús desplegables */
window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    const state = store.getState();
    if (state.drawer || state.branchMenuOpen) {
      store.setState({
        drawer: null,
        branchMenuOpen: false,
      });
    }
  }
});

// Suscribir el motor de renderizado al Store e inicializar la aplicación
store.subscribe(renderApp);
initRouter();
renderApp();
