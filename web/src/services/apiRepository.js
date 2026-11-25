/**
 * @fileoverview Repositorio Unificado de Datos (API Repository).
 * Implementa una estrategia de conexión resiliente e híbrida:
 * 1. Prioridad 1: Backend REST configurado en VITE_API_BASE_URL.
 * 2. Prioridad 2 (Cloud): Base de datos y Auth en Supabase.
 * 3. Fallback Offline: Persistencia local reactiva garantizando continuidad operativa.
 *
 * Expone métodos asíncronos normalizados con cabeceras strict application/json.
 */

import { config } from '../core/config.js';
import { apiClient } from './apiClient.js';
import { supabase } from './supabaseClient.js';

/**
 * @typedef {'backend' | 'supabase' | 'local'} DataSource
 */

/**
 * Estado de conectividad de los orígenes de datos
 */
class ConnectionManager {
  constructor() {
    this.status = {
      backendOnline: false,
      backendLatency: 0,
      backendError: null,
      supabaseOnline: false,
      supabaseLatency: 0,
      supabaseError: null,
      activeSource: 'local', // 'backend' | 'supabase' | 'local'
      lastChecked: null,
    };
    this.listeners = new Set();
  }

  /**
   * Suscribe un callback a cambios de estado de conexión
   * @param {(status: typeof this.status) => void} fn
   * @returns {() => void} Función de desuscripción
   */
  subscribe(fn) {
    this.listeners.add(fn);
    fn(this.status);
    return () => this.listeners.delete(fn);
  }

  notify() {
    this.listeners.forEach((fn) => {
      try {
        fn(this.status);
      } catch (err) {
        console.error('Error en listener de conexión:', err);
      }
    });
  }

  /**
   * Ejecuta ping a los endpoints para determinar la ruta óptima
   */
  async checkConnections() {
    const [backendRes, supabaseRes] = await Promise.allSettled([
      apiClient.checkHealth(),
      supabase.checkHealth(),
    ]);

    const isBackend = backendRes.status === 'fulfilled' && backendRes.value.online;
    const isSupabase = supabaseRes.status === 'fulfilled' && supabaseRes.value.online;

    const backendError =
      backendRes.status === 'rejected'
        ? backendRes.reason?.message || String(backendRes.reason)
        : !isBackend
          ? backendRes.value?.error || 'Backend no disponible'
          : null;

    const supabaseError =
      supabaseRes.status === 'rejected'
        ? supabaseRes.reason?.message || String(supabaseRes.reason)
        : !isSupabase
          ? supabaseRes.value?.error || 'Supabase no disponible'
          : null;

    const activeSource = isBackend ? 'backend' : isSupabase ? 'supabase' : 'local';

    if (activeSource === 'local') {
      console.error(
        '[ConnectionManager] Activando Modo Local porque fallaron la API y Supabase:',
        {
          apiBaseUrl: config.API_BASE_URL || '(no configurada)',
          backendError,
          supabaseUrl: config.SUPABASE_URL || '(no configurada)',
          supabaseError,
        }
      );
    } else if (!isBackend && config.API_BASE_URL) {
      console.warn('[ConnectionManager] API no disponible; operando con Supabase Cloud:', {
        apiBaseUrl: config.API_BASE_URL,
        backendError,
      });
    }

    this.status = {
      backendOnline: isBackend,
      backendLatency: isBackend ? backendRes.value.latency : 0,
      backendError,
      supabaseOnline: isSupabase,
      supabaseLatency: isSupabase ? supabaseRes.value.latency : 0,
      supabaseError,
      activeSource,
      lastChecked: new Date(),
    };

    this.notify();
    return this.status;
  }
}

export const connectionManager = new ConnectionManager();

// ==========================================
// REPOSITORIO DE PRODUCTOS
// ==========================================
export const productsApi = {
  /**
   * Obtiene todos los productos del inventario
   * @returns {Promise<{ success: boolean, data: any[], source: DataSource, error?: string }>}
   */
  async getAll() {
    // 1. Probar backend REST (solo si VITE_API_BASE_URL está configurada)
    if (config.API_BASE_URL) {
      try {
        const res = await apiClient.get('/api/products');
        if (res && (Array.isArray(res) || Array.isArray(res.data))) {
          return {
            success: true,
            data: Array.isArray(res) ? res : res.data,
            source: 'backend',
          };
        }
      } catch (err) {
        console.error('[productsApi.getAll] Error consultando API:', err);
      }
    }

    // 2. Probar Supabase
    try {
      const { data, error } = await supabase.from('products').select('*').order('name');
      if (error) {
        console.error('[productsApi.getAll] Error consultando Supabase:', error);
      } else if (Array.isArray(data) && data.length > 0) {
        return { success: true, data, source: 'supabase' };
      }
    } catch (err) {
      console.error('[productsApi.getAll] Excepción consultando Supabase:', err);
    }

    return { success: false, data: [], source: 'local' };
  },

  /**
   * Crea un producto en el sistema
   * @param {object} product
   */
  async create(product) {
    // 1. Intentar backend (solo si está configurado)
    if (config.API_BASE_URL) {
      try {
        const res = await apiClient.post('/api/products', product);
        return { success: true, data: res, source: 'backend' };
      } catch (apiErr) {
        console.error('[productsApi.create] Error en API:', apiErr);
      }
    }

    // 2. Intentar Supabase
    try {
      const { data, error } = await supabase.from('products').insert(product);
      if (error) {
        console.error('[productsApi.create] Error en Supabase:', error);
      } else if (data) {
        return { success: true, data, source: 'supabase' };
      }
    } catch (supaErr) {
      console.error('[productsApi.create] Excepción en Supabase:', supaErr);
    }

    return { success: true, data: product, source: 'local' };
  },

  /**
   * Actualiza un producto existente
   * @param {string} id
   * @param {object} updates
   */
  async update(id, updates) {
    if (config.API_BASE_URL) {
      try {
        const res = await apiClient.put(`/api/products/${encodeURIComponent(id)}`, updates);
        return { success: true, data: res, source: 'backend' };
      } catch (apiErr) {
        console.error('[productsApi.update] Error en API:', apiErr);
      }
    }

    try {
      const { data, error } = await supabase.from('products').update(updates).eq('id', id);
      if (error) {
        console.error('[productsApi.update] Error en Supabase:', error);
      } else {
        return { success: true, data, source: 'supabase' };
      }
    } catch (supaErr) {
      console.error('[productsApi.update] Excepción en Supabase:', supaErr);
    }

    return { success: true, data: { id, ...updates }, source: 'local' };
  },

  /**
   * Elimina un producto por ID
   * @param {string} id
   */
  async delete(id) {
    if (config.API_BASE_URL) {
      try {
        await apiClient.delete(`/api/products/${encodeURIComponent(id)}`);
        return { success: true, source: 'backend' };
      } catch (apiErr) {
        console.error('[productsApi.delete] Error en API:', apiErr);
      }
    }

    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) {
        console.error('[productsApi.delete] Error en Supabase:', error);
      } else {
        return { success: true, source: 'supabase' };
      }
    } catch (supaErr) {
      console.error('[productsApi.delete] Excepción en Supabase:', supaErr);
    }

    return { success: true, source: 'local' };
  },
};

// ==========================================
// REPOSITORIO DE MOVIMIENTOS
// ==========================================
export const movementsApi = {
  /**
   * Obtiene la bitácora de movimientos
   */
  async getAll() {
    if (config.API_BASE_URL) {
      try {
        const res = await apiClient.get('/api/movements');
        if (res && (Array.isArray(res) || Array.isArray(res.data))) {
          return {
            success: true,
            data: Array.isArray(res) ? res : res.data,
            source: 'backend',
          };
        }
      } catch (err) {
        console.error('[movementsApi.getAll] Error consultando API:', err);
      }
    }

    try {
      const { data, error } = await supabase.from('movements').select('*').order('id', { ascending: false });
      if (error) {
        console.error('[movementsApi.getAll] Error consultando Supabase:', error);
      } else if (Array.isArray(data) && data.length > 0) {
        return { success: true, data, source: 'supabase' };
      }
    } catch (err) {
      console.error('[movementsApi.getAll] Excepción consultando Supabase:', err);
    }

    return { success: false, data: [], source: 'local' };
  },

  /**
   * Registra un nuevo movimiento
   * @param {object} movement
   */
  async create(movement) {
    if (config.API_BASE_URL) {
      try {
        const res = await apiClient.post('/api/movements', movement);
        return { success: true, data: res, source: 'backend' };
      } catch (apiErr) {
        console.error('[movementsApi.create] Error en API:', apiErr);
      }
    }

    try {
      const { data, error } = await supabase.from('movements').insert(movement);
      if (error) {
        console.error('[movementsApi.create] Error en Supabase:', error);
      } else if (data) {
        return { success: true, data, source: 'supabase' };
      }
    } catch (supaErr) {
      console.error('[movementsApi.create] Excepción en Supabase:', supaErr);
    }

    return { success: true, data: movement, source: 'local' };
  },
};

// ==========================================
// REPOSITORIO DE CATEGORÍAS
// ==========================================
export const categoriesApi = {
  async getAll() {
    if (config.API_BASE_URL) {
      try {
        const res = await apiClient.get('/api/categories');
        if (res && (Array.isArray(res) || Array.isArray(res.data))) {
          return {
            success: true,
            data: Array.isArray(res) ? res : res.data,
            source: 'backend',
          };
        }
      } catch (err) {
        console.error('[categoriesApi.getAll] Error consultando API:', err);
      }
    }

    try {
      const { data, error } = await supabase.from('categories').select('*').order('name');
      if (error) {
        console.error('[categoriesApi.getAll] Error consultando Supabase:', error);
      } else if (Array.isArray(data) && data.length > 0) {
        return { success: true, data, source: 'supabase' };
      }
    } catch (err) {
      console.error('[categoriesApi.getAll] Excepción consultando Supabase:', err);
    }

    return { success: false, data: [], source: 'local' };
  },

  async create(category) {
    if (config.API_BASE_URL) {
      try {
        const res = await apiClient.post('/api/categories', category);
        return { success: true, data: res, source: 'backend' };
      } catch (apiErr) {
        console.error('[categoriesApi.create] Error en API:', apiErr);
      }
    }

    try {
      const { data, error } = await supabase.from('categories').insert(category);
      if (error) {
        console.error('[categoriesApi.create] Error en Supabase:', error);
      } else if (data) {
        return { success: true, data, source: 'supabase' };
      }
    } catch (supaErr) {
      console.error('[categoriesApi.create] Excepción en Supabase:', supaErr);
    }

    return { success: true, data: category, source: 'local' };
  },
};

// ==========================================
// REPOSITORIO DE EMPRESAS / ORGANIZACIONES (ADMIN)
// ==========================================
export const companiesApi = {
  async getAll() {
    if (config.API_BASE_URL) {
      try {
        const res = await apiClient.get('/api/companies');
        if (res && (Array.isArray(res) || Array.isArray(res.data))) {
          return {
            success: true,
            data: Array.isArray(res) ? res : res.data,
            source: 'backend',
          };
        }
      } catch (err) {
        console.error('[companiesApi.getAll] Error consultando API:', err);
      }
    }

    try {
      const { data, error } = await supabase.from('companies').select('*');
      if (error) {
        console.error('[companiesApi.getAll] Error consultando Supabase:', error);
      } else if (Array.isArray(data) && data.length > 0) {
        return { success: true, data, source: 'supabase' };
      }
    } catch (err) {
      console.error('[companiesApi.getAll] Excepción consultando Supabase:', err);
    }

    return { success: false, data: [], source: 'local' };
  },

  async save(company) {
    if (config.API_BASE_URL) {
      try {
        const res = await apiClient.post('/api/companies', company);
        return { success: true, data: res, source: 'backend' };
      } catch (apiErr) {
        console.error('[companiesApi.save] Error en API:', apiErr);
      }
    }

    try {
      const { data, error } = await supabase.from('companies').insert(company);
      if (error) {
        console.error('[companiesApi.save] Error en Supabase:', error);
      } else {
        return { success: true, data, source: 'supabase' };
      }
    } catch (supaErr) {
      console.error('[companiesApi.save] Excepción en Supabase:', supaErr);
    }

    return { success: true, data: company, source: 'local' };
  },

  async update(id, updates) {
    if (config.API_BASE_URL) {
      try {
        const res = await apiClient.put(`/api/companies/${encodeURIComponent(id)}`, updates);
        return { success: true, data: res, source: 'backend' };
      } catch (apiErr) {
        console.error('[companiesApi.update] Error en API:', apiErr);
      }
    }

    try {
      const { data, error } = await supabase.from('companies').update(updates).eq('id', id);
      if (error) {
        console.error('[companiesApi.update] Error en Supabase:', error);
      } else {
        return { success: true, data, source: 'supabase' };
      }
    } catch (supaErr) {
      console.error('[companiesApi.update] Excepción en Supabase:', supaErr);
    }

    return { success: true, data: { id, ...updates }, source: 'local' };
  },
};

// ==========================================
// REPOSITORIO DE AUTENTICACIÓN
// ==========================================
export const authApi = {
  /**
   * Intenta autenticar al usuario vía API o Supabase Auth
   * @param {{ email: string, password: string }} credentials
   */
  async login(credentials) {
    // 1. Intentar API (solo si está configurada)
    if (config.API_BASE_URL) {
      try {
        const res = await apiClient.post('/api/auth/login', credentials);
        if (res && res.token) {
          window.sessionStorage.setItem(config.STORAGE_KEYS.AUTH_TOKEN, res.token);
          if (res.user) {
            window.sessionStorage.setItem(config.STORAGE_KEYS.USER_DATA, JSON.stringify(res.user));
          }
          return { success: true, user: res.user, token: res.token, source: 'backend' };
        }
      } catch (apiErr) {
        console.error('[authApi.login] Error en API:', apiErr);
      }
    }

    // 2. Intentar Supabase Auth
    try {
      const { data, error } = await supabase.auth.signInWithPassword(credentials);
      if (error) {
        console.error('[authApi.login] Error en Supabase Auth:', error);
      } else if (data && data.user) {
        return {
          success: true,
          user: data.user,
          token: data.access_token,
          source: 'supabase',
        };
      }
    } catch (supaErr) {
      console.error('[authApi.login] Excepción en Supabase Auth:', supaErr);
    }

    return { success: false, error: 'Credenciales inválidas o servicio no disponible', source: 'local' };
  },

  /**
   * Cierra la sesión activa en todos los orígenes
   */
  async logout() {
    try {
      if (config.API_BASE_URL) {
        await apiClient.post('/api/auth/logout').catch(() => {});
      }
      await supabase.auth.signOut().catch(() => {});
    } finally {
      window.sessionStorage.removeItem(config.STORAGE_KEYS.AUTH_TOKEN);
      window.sessionStorage.removeItem(config.STORAGE_KEYS.USER_DATA);
      window.localStorage.removeItem(config.STORAGE_KEYS.AUTH_TOKEN);
      window.localStorage.removeItem(config.STORAGE_KEYS.USER_DATA);
    }
    return { success: true };
  },
};
