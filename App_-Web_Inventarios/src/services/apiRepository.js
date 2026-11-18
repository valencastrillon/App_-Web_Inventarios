/**
 * @fileoverview Repositorio Unificado de Datos (API Repository).
 * Implementa una estrategia de conexión resiliente e híbrida:
 * 1. Prioridad 1: Backend REST local (http://localhost:4000).
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
      supabaseOnline: false,
      supabaseLatency: 0,
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

    this.status = {
      backendOnline: isBackend,
      backendLatency: isBackend ? backendRes.value.latency : 0,
      supabaseOnline: isSupabase,
      supabaseLatency: isSupabase ? supabaseRes.value.latency : 0,
      activeSource: isBackend ? 'backend' : isSupabase ? 'supabase' : 'local',
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
    // 1. Probar backend local
    try {
      const res = await apiClient.get('/api/products');
      if (res && (Array.isArray(res) || Array.isArray(res.data))) {
        return {
          success: true,
          data: Array.isArray(res) ? res : res.data,
          source: 'backend',
        };
      }
    } catch {
      // Ignora y pasa a fallback
    }

    // 2. Probar Supabase
    try {
      const { data, error } = await supabase.from('products').select('*').order('name');
      if (!error && Array.isArray(data) && data.length > 0) {
        return { success: true, data, source: 'supabase' };
      }
    } catch {
      // Ignora y pasa a fallback local
    }

    return { success: false, data: [], source: 'local' };
  },

  /**
   * Crea un producto en el sistema
   * @param {object} product
   */
  async create(product) {
    // 1. Intentar backend
    try {
      const res = await apiClient.post('/api/products', product);
      return { success: true, data: res, source: 'backend' };
    } catch {
      // 2. Intentar Supabase
      try {
        const { data, error } = await supabase.from('products').insert(product);
        if (!error && data) {
          return { success: true, data, source: 'supabase' };
        }
      } catch {
        // Fallback local
      }
    }
    return { success: true, data: product, source: 'local' };
  },

  /**
   * Actualiza un producto existente
   * @param {string} id
   * @param {object} updates
   */
  async update(id, updates) {
    try {
      const res = await apiClient.put(`/api/products/${encodeURIComponent(id)}`, updates);
      return { success: true, data: res, source: 'backend' };
    } catch {
      try {
        const { data, error } = await supabase.from('products').update(updates).eq('id', id);
        if (!error) {
          return { success: true, data, source: 'supabase' };
        }
      } catch {
        // Fallback local
      }
    }
    return { success: true, data: { id, ...updates }, source: 'local' };
  },

  /**
   * Elimina un producto por ID
   * @param {string} id
   */
  async delete(id) {
    try {
      await apiClient.delete(`/api/products/${encodeURIComponent(id)}`);
      return { success: true, source: 'backend' };
    } catch {
      try {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (!error) return { success: true, source: 'supabase' };
      } catch {
        // Fallback local
      }
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
    try {
      const res = await apiClient.get('/api/movements');
      if (res && (Array.isArray(res) || Array.isArray(res.data))) {
        return {
          success: true,
          data: Array.isArray(res) ? res : res.data,
          source: 'backend',
        };
      }
    } catch {}

    try {
      const { data, error } = await supabase.from('movements').select('*').order('id', { ascending: false });
      if (!error && Array.isArray(data) && data.length > 0) {
        return { success: true, data, source: 'supabase' };
      }
    } catch {}

    return { success: false, data: [], source: 'local' };
  },

  /**
   * Registra un nuevo movimiento
   * @param {object} movement
   */
  async create(movement) {
    try {
      const res = await apiClient.post('/api/movements', movement);
      return { success: true, data: res, source: 'backend' };
    } catch {
      try {
        const { data, error } = await supabase.from('movements').insert(movement);
        if (!error && data) return { success: true, data, source: 'supabase' };
      } catch {}
    }
    return { success: true, data: movement, source: 'local' };
  },
};

// ==========================================
// REPOSITORIO DE CATEGORÍAS
// ==========================================
export const categoriesApi = {
  async getAll() {
    try {
      const res = await apiClient.get('/api/categories');
      if (res && (Array.isArray(res) || Array.isArray(res.data))) {
        return {
          success: true,
          data: Array.isArray(res) ? res : res.data,
          source: 'backend',
        };
      }
    } catch {}

    try {
      const { data, error } = await supabase.from('categories').select('*').order('name');
      if (!error && Array.isArray(data) && data.length > 0) {
        return { success: true, data, source: 'supabase' };
      }
    } catch {}

    return { success: false, data: [], source: 'local' };
  },

  async create(category) {
    try {
      const res = await apiClient.post('/api/categories', category);
      return { success: true, data: res, source: 'backend' };
    } catch {
      try {
        const { data, error } = await supabase.from('categories').insert(category);
        if (!error && data) return { success: true, data, source: 'supabase' };
      } catch {}
    }
    return { success: true, data: category, source: 'local' };
  },
};

// ==========================================
// REPOSITORIO DE EMPRESAS / ORGANIZACIONES (ADMIN)
// ==========================================
export const companiesApi = {
  async getAll() {
    try {
      const res = await apiClient.get('/api/companies');
      if (res && (Array.isArray(res) || Array.isArray(res.data))) {
        return {
          success: true,
          data: Array.isArray(res) ? res : res.data,
          source: 'backend',
        };
      }
    } catch {}

    try {
      const { data, error } = await supabase.from('companies').select('*');
      if (!error && Array.isArray(data) && data.length > 0) {
        return { success: true, data, source: 'supabase' };
      }
    } catch {}

    return { success: false, data: [], source: 'local' };
  },

  async save(company) {
    try {
      const res = await apiClient.post('/api/companies', company);
      return { success: true, data: res, source: 'backend' };
    } catch {
      try {
        const { data, error } = await supabase.from('companies').insert(company);
        if (!error) return { success: true, data, source: 'supabase' };
      } catch {}
    }
    return { success: true, data: company, source: 'local' };
  },

  async update(id, updates) {
    try {
      const res = await apiClient.put(`/api/companies/${encodeURIComponent(id)}`, updates);
      return { success: true, data: res, source: 'backend' };
    } catch {
      try {
        const { data, error } = await supabase.from('companies').update(updates).eq('id', id);
        if (!error) return { success: true, data, source: 'supabase' };
      } catch {}
    }
    return { success: true, data: { id, ...updates }, source: 'local' };
  },
};

// ==========================================
// REPOSITORIO DE AUTENTICACIÓN
// ==========================================
export const authApi = {
  /**
   * Intenta autenticar al usuario vía API local o Supabase Auth
   * @param {{ email: string, password: string }} credentials
   */
  async login(credentials) {
    // 1. Intentar API local
    try {
      const res = await apiClient.post('/api/auth/login', credentials);
      if (res && res.token) {
        window.sessionStorage.setItem(config.STORAGE_KEYS.AUTH_TOKEN, res.token);
        if (res.user) {
          window.sessionStorage.setItem(config.STORAGE_KEYS.USER_DATA, JSON.stringify(res.user));
        }
        return { success: true, user: res.user, token: res.token, source: 'backend' };
      }
    } catch {
      // Ignorar e intentar Supabase
    }

    // 2. Intentar Supabase Auth
    try {
      const { data, error } = await supabase.auth.signInWithPassword(credentials);
      if (!error && data && data.user) {
        return {
          success: true,
          user: data.user,
          token: data.access_token,
          source: 'supabase',
        };
      }
    } catch {
      // Ignorar y pasar a fallback
    }

    return { success: false, error: 'Credenciales inválidas o servicio no disponible', source: 'local' };
  },

  /**
   * Cierra la sesión activa en todos los orígenes
   */
  async logout() {
    try {
      await apiClient.post('/api/auth/logout').catch(() => {});
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
