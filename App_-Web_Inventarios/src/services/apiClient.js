/**
 * @fileoverview Cliente HTTP de Alta Eficiencia para la API REST (http://localhost:4000).
 * Maneja serialización application/json, timeouts, inyección de tokens y errores de red.
 */

import { config } from '../core/config.js';

export class ApiError extends Error {
  /**
   * @param {string} message
   * @param {number} status
   * @param {any} [data]
   */
  constructor(message, status = 500, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Realiza una petición fetch con timeout y normalización de respuesta JSON.
 * @param {string} endpoint Ruta relativa (ej: '/api/products') o URL absoluta
 * @param {RequestInit & { timeout?: number }} [options]
 * @returns {Promise<any>}
 */
async function request(endpoint, options = {}) {
  const url = endpoint.startsWith('http')
    ? endpoint
    : `${config.API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  const timeoutMs = options.timeout || config.TIMEOUT_MS;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  const token =
    typeof window !== 'undefined'
      ? window.sessionStorage.getItem(config.STORAGE_KEYS.AUTH_TOKEN) ||
        window.localStorage.getItem(config.STORAGE_KEYS.AUTH_TOKEN)
      : null;

  const headers = {
    ...config.DEFAULT_HEADERS,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      signal: options.signal || controller.signal,
    });

    clearTimeout(timer);

    if (response.status === 204) {
      return null;
    }

    const contentType = response.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');
    const data = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      const errorMsg =
        (typeof data === 'object' && data !== null && (data.message || data.error)) ||
        `Error ${response.status}: ${response.statusText}`;
      throw new ApiError(errorMsg, response.status, data);
    }

    return data;
  } catch (err) {
    clearTimeout(timer);
    if (err.name === 'AbortError') {
      throw new ApiError(`Tiempo de espera agotado al conectar con ${url} (${timeoutMs}ms)`, 408);
    }
    if (err instanceof ApiError) {
      throw err;
    }
    // Error de red (servidor apagado, CORS, etc.)
    throw new ApiError(`No se pudo conectar con el servidor en ${config.API_BASE_URL}: ${err.message}`, 0, err);
  }
}

export const apiClient = {
  /**
   * Petición GET
   * @param {string} endpoint
   * @param {object} [params] Query string params
   * @param {RequestInit} [options]
   */
  get(endpoint, params = null, options = {}) {
    let url = endpoint;
    if (params && typeof params === 'object') {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') {
          searchParams.append(k, String(v));
        }
      });
      const queryStr = searchParams.toString();
      if (queryStr) {
        url += (url.includes('?') ? '&' : '?') + queryStr;
      }
    }
    return request(url, { ...options, method: 'GET' });
  },

  /**
   * Petición POST con body JSON
   * @param {string} endpoint
   * @param {any} body
   * @param {RequestInit} [options]
   */
  post(endpoint, body = {}, options = {}) {
    return request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  /**
   * Petición PUT con body JSON
   * @param {string} endpoint
   * @param {any} body
   * @param {RequestInit} [options]
   */
  put(endpoint, body = {}, options = {}) {
    return request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    });
  },

  /**
   * Petición PATCH con body JSON
   * @param {string} endpoint
   * @param {any} body
   * @param {RequestInit} [options]
   */
  patch(endpoint, body = {}, options = {}) {
    return request(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  },

  /**
   * Petición DELETE
   * @param {string} endpoint
   * @param {RequestInit} [options]
   */
  delete(endpoint, options = {}) {
    return request(endpoint, {
      ...options,
      method: 'DELETE',
    });
  },

  /**
   * Comprueba si el servidor local en http://localhost:4000 está activo.
   * @returns {Promise<{ online: boolean, latency: number, error?: string }>}
   */
  async checkHealth() {
    const start = performance.now();
    try {
      // Intentar rutas estándar de salud o ping
      await request('/api/health', { method: 'GET', timeout: 2500 }).catch(() =>
        request('/health', { method: 'GET', timeout: 2500 }).catch(() =>
          request('/', { method: 'GET', timeout: 2500 })
        )
      );
      return {
        online: true,
        latency: Math.round(performance.now() - start),
      };
    } catch (err) {
      return {
        online: false,
        latency: Math.round(performance.now() - start),
        error: err.message,
      };
    }
  },
};
