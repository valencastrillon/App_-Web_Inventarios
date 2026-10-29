/**
 * @fileoverview Store Reactivo Centralizado (Patrón Observable / Pub-Sub) en Vanilla JS.
 * Mantiene una única fuente de verdad (Single Source of Truth) para toda la aplicación,
 * gestiona la persistencia en LocalStorage/SessionStorage y notifica a la vista en cada cambio.
 */

import {
  initialBranches,
  initialCategories,
  initialKitRecipes,
  initialMovements,
  initialProducts,
  initialUsers,
} from '../data/mockData.js';
import { getInitialParam } from './formatters.js';

const VALID_SCREENS = [
  'dashboard',
  'productos',
  'conversion',
  'movimientos',
  'categorias',
  'reportes',
  'configuracion',
];

function resolveInitialScreen() {
  const param = getInitialParam('screen');
  return param && VALID_SCREENS.includes(param) ? param : 'dashboard';
}

function resolveInitialTheme() {
  const param = getInitialParam('theme');
  if (param === 'dark' || param === 'light') return param;
  const saved = window.localStorage.getItem('stockia_theme');
  return saved === 'dark' ? 'dark' : 'light';
}

function resolveInitialAuth() {
  if (getInitialParam('login') === '1') return false;
  if (getInitialParam('screen')) return true;
  return window.sessionStorage.getItem('stockia_auth') === '1';
}

function resolveInitialUsers() {
  try {
    const raw = window.localStorage.getItem('stockia_users');
    return raw ? JSON.parse(raw) : initialUsers;
  } catch {
    return initialUsers;
  }
}

export function createEmptyBulkRows(defaultBranch = 'CD Norte') {
  return [
    {
      id: 'row-1',
      name: 'Taladro Inalámbrico 18V Brushless',
      sku: 'FER-0991',
      category: 'Ferretería',
      branch: defaultBranch,
      stock: '24',
      minStock: '8',
      unit: 'unid.',
      cost: '64000',
      price: '94500',
      location: 'Depósito Central · Pasillo A-2',
    },
    {
      id: 'row-2',
      name: 'Disyuntor Diferencial 2x40A 30mA',
      sku: 'ELE-0842',
      category: 'Electricidad',
      branch: 'Sucursal Centro',
      stock: '36',
      minStock: '12',
      unit: 'unid.',
      cost: '19800',
      price: '29900',
      location: 'Depósito Central · Pasillo B-2',
    },
    {
      id: 'row-3',
      name: 'Membrana Líquida Poliuretánica 20L',
      sku: 'PIN-0410',
      category: 'Pinturería',
      branch: 'Depósito Sur',
      stock: '15',
      minStock: '6',
      unit: 'baldes',
      cost: '58900',
      price: '87900',
      location: 'Depósito Sur · Sector C',
    },
  ];
}

const initialTheme = resolveInitialTheme();
document.documentElement.dataset.theme = initialTheme;

const state = {
  // Autenticación y navegación
  authenticated: resolveInitialAuth(),
  screen: resolveInitialScreen(),
  branchLocation: getInitialParam('branch') || 'Todas las sedes',
  theme: initialTheme,
  branchMenuOpen: false,

  // Datos principales del dominio
  products: [...initialProducts],
  categories: [...initialCategories],
  movements: [...initialMovements],
  branches: [...initialBranches],
  kitRecipes: [...initialKitRecipes],
  users: resolveInitialUsers(),

  // Estado de Login
  loginState: {
    email: 'lgomez@comercialnorte.com.ar',
    password: '••••••••••••',
    remember: true,
    error: '',
    googlePickerOpen: false,
  },

  // Estado del Dashboard
  dashboardState: {
    period: '30d',
    categoryFilter: 'Todas',
    statusFilter: 'Todos',
  },

  // Estado del Catálogo de Productos
  productsViewState: {
    search: '',
    category: 'Todas',
    status: 'Todos',
    sortBy: 'name',
    page: 1,
    menuRowId: null,
  },

  // Estado del conversor de kits y cajas
  conversionState: {
    selectedRecipeId: initialKitRecipes[0]?.id || '',
    boxesToConvert: 1,
    branch: 'CD Norte',
    responsible: 'L. Gómez',
    customMode: false,
    customSourceId: '13',
    customTargetId: '5',
    customFactor: 24,
  },

  // Estado del Historial de Movimientos
  movementsViewState: {
    search: '',
    typeFilter: 'Todos',
  },

  // Estado de Configuración y Seguridad
  settingsState: {
    company: 'Comercial Norte SRL',
    cuit: '30-71458920-6',
    warehouse: 'Depósito Central — Av. Constituyentes 4820, Tigre',
    currency: 'ARS ($ Peso Argentino)',
    criticalThreshold: '25',
    emailAlerts: true,
    dailyDigest: true,
    blockNegativeStock: true,
    autoSku: true,
    addingUser: false,
    newUserName: '',
    newUserEmail: '',
    newUserRole: 'Operador de Depósito',
    newUserBranch: 'CD Norte',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    showPasswords: false,
    passwordSavedMessage: '',
  },

  // Drawers laterales y borradores de formularios
  drawer: getInitialParam('drawer') === 'import' ? 'import' : null,
  editingProduct: null,
  productDraft: {
    name: '',
    subtitle: '',
    sku: '',
    category: 'Ferretería',
    stock: '0',
    minStock: '10',
    unit: 'unid.',
    cost: '0',
    price: '0',
    location: 'Depósito Central · Pasillo A-1',
    branch: 'CD Norte',
  },
  movementDraft: {
    type: 'Ingreso',
    productId: initialProducts[0].id,
    quantity: '10',
    responsible: 'L. Gómez',
    reference: 'OC #4418 · Reposición programada',
  },
  categoryDraft: {
    name: '',
    code: '',
    description: '',
    targetMargin: '40',
    location: 'Depósito Central · Pasillo E',
  },
  branchDraft: {
    name: '',
    city: '',
    address: '',
    manager: '',
    phone: '+54 11 ',
    warehouses: '1',
  },

  // Estado del Drawer de Carga Masiva
  bulkImportState: {
    activeTab: 'table',
    rows: createEmptyBulkRows('CD Norte'),
    csvPreview: [],
    fileName: '',
  },

  // Notificación flotante (Toast)
  toast: null,
};

const listeners = new Set();
let toastTimeoutId = null;

export const store = {
  /**
   * Obtiene una referencia de lectura al estado actual.
   */
  getState() {
    return state;
  },

  /**
   * Actualiza parcial o funcionalmente el estado global y notifica a los suscriptores.
   * @param {object | ((prevState: typeof state) => object)} partialOrUpdater
   */
  setState(partialOrUpdater) {
    const patch =
      typeof partialOrUpdater === 'function'
        ? partialOrUpdater(state)
        : partialOrUpdater;

    if (!patch || typeof patch !== 'object') return;

    Object.assign(state, patch);

    // Sincronizar efectos secundarios de persistencia
    if ('theme' in patch) {
      document.documentElement.dataset.theme = state.theme;
      window.localStorage.setItem('stockia_theme', state.theme);
    }

    if ('users' in patch) {
      try {
        window.localStorage.setItem('stockia_users', JSON.stringify(state.users));
      } catch {
        // Ignorar cuota excedida en modo privado
      }
    }

    listeners.forEach((listener) => listener(state));
  },

  /**
   * Muestra un mensaje toast temporal durante 3.2 segundos.
   * @param {string} message
   */
  showToast(message) {
    if (toastTimeoutId) window.clearTimeout(toastTimeoutId);
    this.setState({ toast: message });
    toastTimeoutId = window.setTimeout(() => {
      this.setState({ toast: null });
    }, 3200);
  },

  /**
   * Registra un listener que se ejecuta cada vez que cambia el estado.
   * @param {(currentState: typeof state) => void} listener
   * @returns {() => void} Función para cancelar la suscripción.
   */
  subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};
