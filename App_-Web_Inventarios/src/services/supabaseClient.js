/**
 * @fileoverview Cliente Ligero Nativo de Supabase para Frontend Vanilla JS.
 * Permite interactuar con la base de datos (PostgREST /rest/v1) y autenticación (/auth/v1)
 * de Supabase utilizando únicamente las credenciales públicas (VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY),
 * formato application/json y ES Modules sin necesidad de dependencias pesadas de npm.
 */

import { config } from '../core/config.js';

export class SupabaseError extends Error {
  /**
   * @param {string} message
   * @param {number} status
   * @param {any} [details]
   */
  constructor(message, status = 500, details = null) {
    super(message);
    this.name = 'SupabaseError';
    this.status = status;
    this.details = details;
  }
}

/**
 * Determina si un token tiene formato JWT (3 segmentos separados por punto).
 * Las claves modernas `sb_publishable_...` NO son JWT y NO deben enviarse en `Authorization: Bearer`.
 * @param {string | null | undefined} value
 * @returns {boolean}
 */
function isJwtToken(value) {
  return typeof value === 'string' && value.split('.').length === 3;
}

/**
 * Valida que las credenciales públicas de Supabase estén configuradas y cumplan HTTPS.
 * @returns {string | null} Mensaje de error si la configuración es inválida, o null si es válida.
 */
function validateSupabaseConfig() {
  if (!config.SUPABASE_URL) {
    return 'VITE_SUPABASE_URL no está configurada o fue bloqueada por contenido mixto (requiere https://).';
  }
  if (!config.SUPABASE_ANON_KEY) {
    return 'VITE_SUPABASE_ANON_KEY no está configurada o contiene una clave no permitida en frontend.';
  }
  if (
    typeof window !== 'undefined' &&
    window.location?.protocol === 'https:' &&
    /^http:\/\//i.test(config.SUPABASE_URL)
  ) {
    return `Contenido mixto bloqueado: VITE_SUPABASE_URL ("${config.SUPABASE_URL}") debe usar https://.`;
  }
  return null;
}

/**
 * Genera las cabeceras estándar para comunicarse con Supabase REST.
 * - Siempre envía `apikey` con la clave pública (`sb_publishable_...` o `anon` JWT).
 * - Solo envía `Authorization: Bearer <token>` si existe un JWT de sesión del usuario
 *   o si la clave pública es un JWT legacy (`eyJ...`). Nunca envía `sb_publishable_...` como Bearer.
 * @param {string} [customToken] Token JWT del usuario autenticado (si existe)
 * @returns {Record<string, string>}
 */
function getHeaders(customToken = null) {
  const userToken =
    customToken ||
    (typeof window !== 'undefined'
      ? window.sessionStorage.getItem(config.STORAGE_KEYS.AUTH_TOKEN) ||
        window.localStorage.getItem(config.STORAGE_KEYS.AUTH_TOKEN)
      : null);

  const bearerToken =
    userToken || (isJwtToken(config.SUPABASE_ANON_KEY) ? config.SUPABASE_ANON_KEY : null);

  const headers = {
    apikey: config.SUPABASE_ANON_KEY,
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Prefer: 'return=representation',
  };

  if (bearerToken) {
    headers.Authorization = `Bearer ${bearerToken}`;
  }

  return headers;
}

/**
 * Constructor de consultas tipo PostgREST fluido
 */
class QueryBuilder {
  /**
   * @param {string} table Nombre de la tabla en Supabase
   */
  constructor(table) {
    this.table = table;
    this.url = `${config.SUPABASE_URL}/rest/v1/${table}`;
    this.filters = [];
    this.selectColumns = '*';
    this.orderClause = null;
    this.limitCount = null;
  }

  /**
   * Define las columnas a retornar (ej: '*', 'id, name, stock')
   * @param {string} [columns='*']
   */
  select(columns = '*') {
    this.selectColumns = columns;
    return this;
  }

  /**
   * Filtro de igualdad (columna = valor)
   * @param {string} column
   * @param {any} value
   */
  eq(column, value) {
    this.filters.push(`${encodeURIComponent(column)}=eq.${encodeURIComponent(value)}`);
    return this;
  }

  /**
   * Filtro de desigualdad (columna != valor)
   * @param {string} column
   * @param {any} value
   */
  neq(column, value) {
    this.filters.push(`${encodeURIComponent(column)}=neq.${encodeURIComponent(value)}`);
    return this;
  }

  /**
   * Filtro de coincidencia de texto insensible a mayúsculas
   * @param {string} column
   * @param {string} pattern
   */
  ilike(column, pattern) {
    this.filters.push(`${encodeURIComponent(column)}=ilike.${encodeURIComponent(pattern)}`);
    return this;
  }

  /**
   * Ordena los resultados
   * @param {string} column
   * @param {{ ascending?: boolean }} [options]
   */
  order(column, { ascending = true } = {}) {
    this.orderClause = `${encodeURIComponent(column)}.${ascending ? 'asc' : 'desc'}`;
    return this;
  }

  /**
   * Limita el número de filas
   * @param {number} count
   */
  limit(count) {
    this.limitCount = count;
    return this;
  }

  /**
   * Construye la URL final con los query parameters
   * @returns {string}
   */
  _buildUrl() {
    const params = [];
    if (this.selectColumns) params.push(`select=${encodeURIComponent(this.selectColumns)}`);
    if (this.orderClause) params.push(`order=${this.orderClause}`);
    if (this.limitCount) params.push(`limit=${this.limitCount}`);
    params.push(...this.filters);

    return `${this.url}${params.length ? `?${params.join('&')}` : ''}`;
  }

  /**
   * Ejecuta la consulta de lectura GET
   * @returns {Promise<{ data: any[] | null, error: SupabaseError | null }>}
   */
  async execute() {
    const configError = validateSupabaseConfig();
    if (configError) {
      console.error(`[Supabase] SELECT ${this.table} cancelado:`, configError);
      return { data: null, error: new SupabaseError(configError, 0) };
    }

    try {
      const fullUrl = this._buildUrl();
      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new SupabaseError(
          errorData.message || errorData.error_description || `Error ${response.status}`,
          response.status,
          errorData
        );
      }

      const data = await response.json();
      return { data, error: null };
    } catch (err) {
      const supaErr = err instanceof SupabaseError ? err : new SupabaseError(err.message, 0, err);
      console.error(`[Supabase] Error en SELECT ${this.table}:`, supaErr);
      return {
        data: null,
        error: supaErr,
      };
    }
  }

  /**
   * Permite usar `await supabase.from('...').select()` directamente
   */
  then(resolve, reject) {
    return this.execute().then(resolve, reject);
  }

  /**
   * Inserta uno o varios registros en la tabla
   * @param {object | object[]} values
   * @returns {Promise<{ data: any | null, error: SupabaseError | null }>}
   */
  async insert(values) {
    const configError = validateSupabaseConfig();
    if (configError) {
      console.error(`[Supabase] INSERT ${this.table} cancelado:`, configError);
      return { data: null, error: new SupabaseError(configError, 0) };
    }

    try {
      const payload = Array.isArray(values) ? values : [values];
      const response = await fetch(`${this.url}`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new SupabaseError(
          errorData.message || `Error al insertar: ${response.status}`,
          response.status,
          errorData
        );
      }

      const data = await response.json();
      return { data: Array.isArray(values) ? data : data[0] || null, error: null };
    } catch (err) {
      const supaErr = err instanceof SupabaseError ? err : new SupabaseError(err.message, 0, err);
      console.error(`[Supabase] Error en INSERT ${this.table}:`, supaErr);
      return {
        data: null,
        error: supaErr,
      };
    }
  }

  /**
   * Actualiza registros que coincidan con los filtros aplicados
   * @param {object} values
   * @returns {Promise<{ data: any | null, error: SupabaseError | null }>}
   */
  async update(values) {
    const configError = validateSupabaseConfig();
    if (configError) {
      console.error(`[Supabase] UPDATE ${this.table} cancelado:`, configError);
      return { data: null, error: new SupabaseError(configError, 0) };
    }

    try {
      const fullUrl = this._buildUrl();
      const response = await fetch(fullUrl, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new SupabaseError(
          errorData.message || `Error al actualizar: ${response.status}`,
          response.status,
          errorData
        );
      }

      const data = await response.json();
      return { data, error: null };
    } catch (err) {
      const supaErr = err instanceof SupabaseError ? err : new SupabaseError(err.message, 0, err);
      console.error(`[Supabase] Error en UPDATE ${this.table}:`, supaErr);
      return {
        data: null,
        error: supaErr,
      };
    }
  }

  /**
   * Elimina registros que coincidan con los filtros aplicados
   * @returns {Promise<{ data: any | null, error: SupabaseError | null }>}
   */
  async delete() {
    const configError = validateSupabaseConfig();
    if (configError) {
      console.error(`[Supabase] DELETE ${this.table} cancelado:`, configError);
      return { data: null, error: new SupabaseError(configError, 0) };
    }

    try {
      const fullUrl = this._buildUrl();
      const response = await fetch(fullUrl, {
        method: 'DELETE',
        headers: getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new SupabaseError(
          errorData.message || `Error al eliminar: ${response.status}`,
          response.status,
          errorData
        );
      }

      const data = response.status === 204 ? null : await response.json().catch(() => null);
      return { data, error: null };
    } catch (err) {
      const supaErr = err instanceof SupabaseError ? err : new SupabaseError(err.message, 0, err);
      console.error(`[Supabase] Error en DELETE ${this.table}:`, supaErr);
      return {
        data: null,
        error: supaErr,
      };
    }
  }
}

/**
 * Cliente de Autenticación de Supabase (/auth/v1)
 */
const auth = {
  /**
   * Inicia sesión con correo y contraseña
   * @param {{ email: string, password: string }} credentials
   */
  async signInWithPassword({ email, password }) {
    const configError = validateSupabaseConfig();
    if (configError) {
      console.error('[Supabase Auth] signInWithPassword cancelado:', configError);
      return { data: null, error: new SupabaseError(configError, 0) };
    }

    try {
      const response = await fetch(`${config.SUPABASE_URL}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: {
          apikey: config.SUPABASE_ANON_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new SupabaseError(
          data.error_description || data.msg || data.message || 'Error de credenciales',
          response.status,
          data
        );
      }

      if (typeof window !== 'undefined' && data.access_token) {
        window.sessionStorage.setItem(config.STORAGE_KEYS.AUTH_TOKEN, data.access_token);
        if (data.user) {
          window.sessionStorage.setItem(config.STORAGE_KEYS.USER_DATA, JSON.stringify(data.user));
        }
      }

      return { data, error: null };
    } catch (err) {
      const supaErr = err instanceof SupabaseError ? err : new SupabaseError(err.message, 0, err);
      console.error('[Supabase Auth] Error en signInWithPassword:', supaErr);
      return {
        data: null,
        error: supaErr,
      };
    }
  },

  /**
   * Registra un nuevo usuario en Supabase Auth
   * @param {{ email: string, password: string, data?: object }} payload
   */
  async signUp({ email, password, data = {} }) {
    const configError = validateSupabaseConfig();
    if (configError) {
      console.error('[Supabase Auth] signUp cancelado:', configError);
      return { data: null, error: new SupabaseError(configError, 0) };
    }

    try {
      const response = await fetch(`${config.SUPABASE_URL}/auth/v1/signup`, {
        method: 'POST',
        headers: {
          apikey: config.SUPABASE_ANON_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, data }),
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new SupabaseError(
          resData.msg || resData.message || 'Error en el registro',
          response.status,
          resData
        );
      }

      return { data: resData, error: null };
    } catch (err) {
      const supaErr = err instanceof SupabaseError ? err : new SupabaseError(err.message, 0, err);
      console.error('[Supabase Auth] Error en signUp:', supaErr);
      return {
        data: null,
        error: supaErr,
      };
    }
  },

  /**
   * Cierra sesión del usuario actual
   */
  async signOut() {
    try {
      const token =
        typeof window !== 'undefined'
          ? window.sessionStorage.getItem(config.STORAGE_KEYS.AUTH_TOKEN)
          : null;

      if (token && !validateSupabaseConfig()) {
        await fetch(`${config.SUPABASE_URL}/auth/v1/logout`, {
          method: 'POST',
          headers: getHeaders(token),
        }).catch((err) => {
          console.error('[Supabase Auth] Error en signOut remoto:', err);
        });
      }

      if (typeof window !== 'undefined') {
        window.sessionStorage.removeItem(config.STORAGE_KEYS.AUTH_TOKEN);
        window.sessionStorage.removeItem(config.STORAGE_KEYS.USER_DATA);
        window.localStorage.removeItem(config.STORAGE_KEYS.AUTH_TOKEN);
        window.localStorage.removeItem(config.STORAGE_KEYS.USER_DATA);
      }

      return { error: null };
    } catch (err) {
      console.error('[Supabase Auth] Error en signOut:', err);
      return { error: new SupabaseError(err.message, 0, err) };
    }
  },

  /**
   * Obtiene la sesión o datos del usuario autenticado
   */
  async getUser() {
    const configError = validateSupabaseConfig();
    if (configError) {
      return { data: { user: null }, error: new SupabaseError(configError, 0) };
    }

    try {
      const token =
        typeof window !== 'undefined'
          ? window.sessionStorage.getItem(config.STORAGE_KEYS.AUTH_TOKEN) ||
            window.localStorage.getItem(config.STORAGE_KEYS.AUTH_TOKEN)
          : null;

      if (!token) return { data: { user: null }, error: null };

      const response = await fetch(`${config.SUPABASE_URL}/auth/v1/user`, {
        method: 'GET',
        headers: getHeaders(token),
      });

      if (!response.ok) {
        return { data: { user: null }, error: null };
      }

      const user = await response.json();
      return { data: { user }, error: null };
    } catch (err) {
      console.error('[Supabase Auth] Error en getUser:', err);
      return { data: { user: null }, error: new SupabaseError(err.message, 0, err) };
    }
  },
};

/**
 * Cliente principal exportado
 */
export const supabase = {
  /**
   * Inicia una consulta sobre una tabla
   * @param {string} table
   */
  from(table) {
    return new QueryBuilder(table);
  },

  /** Módulo de autenticación */
  auth,

  /**
   * Comprueba si el proyecto de Supabase está accesible usando el endpoint público `/auth/v1/health`
   * (compatible con claves `sb_publishable_...` y `anon` JWT sin requerir `service_role`).
   * @returns {Promise<{ online: boolean, latency: number, status?: number, error?: string }>}
   */
  async checkHealth() {
    const configError = validateSupabaseConfig();
    if (configError) {
      console.error('[Supabase] checkHealth cancelado:', configError);
      return {
        online: false,
        latency: 0,
        error: configError,
      };
    }

    const start = performance.now();
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    const healthUrl = `${config.SUPABASE_URL}/auth/v1/health`;

    try {
      const response = await fetch(healthUrl, {
        method: 'GET',
        headers: {
          apikey: config.SUPABASE_ANON_KEY,
          Accept: 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timer);
      const latency = Math.round(performance.now() - start);

      if (!response.ok) {
        const detail = await response.text().catch(() => response.statusText);
        const message = `HTTP ${response.status}: ${detail || response.statusText}`;
        console.error(`[Supabase] checkHealth falló en ${healthUrl}:`, message);
        return {
          online: false,
          latency,
          status: response.status,
          error: message,
        };
      }

      return {
        online: true,
        latency,
        status: response.status,
      };
    } catch (err) {
      clearTimeout(timer);
      const latency = Math.round(performance.now() - start);
      const message =
        err.name === 'AbortError'
          ? `Timeout (5000ms) al conectar con ${healthUrl}`
          : err.message || String(err);

      console.error(
        `[Supabase] Error de red/DNS/CORS al conectar con ${healthUrl}:`,
        err
      );
      return {
        online: false,
        latency,
        error: message,
      };
    }
  },
};
