/**
 * @fileoverview Configuración Centralizada de Endpoints y Variables de Entorno.
 * Define la URL base de la API REST (http://localhost:4000 solo en desarrollo local HTTP),
 * las credenciales públicas de Supabase (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY)
 * y las cabeceras predeterminadas (application/json) para la conexión del frontend.
 */

// Lectura estática compatible con Vite (Vite solo reemplaza referencias literales import.meta.env.VITE_*)
const viteEnv = {
  VITE_API_BASE_URL:
    typeof import.meta !== 'undefined' && import.meta.env
      ? import.meta.env.VITE_API_BASE_URL
      : undefined,
  VITE_SUPABASE_URL:
    typeof import.meta !== 'undefined' && import.meta.env
      ? import.meta.env.VITE_SUPABASE_URL
      : undefined,
  VITE_SUPABASE_ANON_KEY:
    typeof import.meta !== 'undefined' && import.meta.env
      ? import.meta.env.VITE_SUPABASE_ANON_KEY
      : undefined,
};

function isHttpsPage() {
  return typeof window !== 'undefined' && window.location?.protocol === 'https:';
}

function isLocalDevHost() {
  if (typeof window === 'undefined' || !window.location) return false;
  const { hostname, protocol } = window.location;
  return (
    protocol === 'http:' &&
    (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '[::1]')
  );
}

/**
 * Obtiene el valor de una variable de entorno con cascada de prioridad:
 * 1. Override manual en localStorage (para pruebas en vivo)
 * 2. Inyección global en window.__APP_CONFIG__ (env-config.js en Netlify/estático)
 * 3. Variable de Vite (import.meta.env.VITE_*)
 * 4. Valor por defecto especificado
 *
 * @param {string} key Nombre de la clave
 * @param {string} defaultValue Valor de respaldo
 * @returns {string}
 */
function getEnv(key, defaultValue = '') {
  if (typeof window !== 'undefined') {
    const override = window.localStorage.getItem(`lc_env_${key}`);
    if (override && override.trim()) return override.trim();

    const runtimeValue = window.__APP_CONFIG__?.[key];
    if (typeof runtimeValue === 'string' && runtimeValue.trim()) {
      return runtimeValue.trim();
    }
  }

  const viteValue = viteEnv[key];
  if (typeof viteValue === 'string' && viteValue.trim()) {
    return viteValue.trim();
  }

  return typeof defaultValue === 'string' ? defaultValue.trim() : '';
}

/**
 * Normaliza una URL de endpoint y bloquea contenido mixto (http:// desde https://).
 * @param {string} rawUrl
 * @param {string} varName
 * @returns {string}
 */
function sanitizeEndpointUrl(rawUrl, varName) {
  const url = String(rawUrl || '').trim().replace(/\/+$/, '');
  if (!url) return '';

  if (isHttpsPage() && /^http:\/\//i.test(url)) {
    console.error(
      `[Config] Contenido mixto bloqueado: ${varName} ("${url}") usa http:// desde una página HTTPS (${window.location.origin}). Configurá una URL https://.`
    );
    return '';
  }

  return url;
}

/**
 * Valida que la clave de Supabase configurada en el frontend sea pública (nunca service_role / sb_secret_).
 * @param {string} rawKey
 * @returns {string}
 */
function sanitizePublicSupabaseKey(rawKey) {
  const key = String(rawKey || '').trim();
  if (!key) return '';

  if (/^sb_secret_/i.test(key)) {
    console.error(
      '[Config] Clave privada bloqueada: VITE_SUPABASE_ANON_KEY no puede usar una clave sb_secret_ en el frontend.'
    );
    return '';
  }

  const parts = key.split('.');
  if (parts.length === 3 && typeof atob === 'function') {
    try {
      const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(atob(base64));
      if (payload?.role === 'service_role') {
        console.error(
          '[Config] Clave privada bloqueada: VITE_SUPABASE_ANON_KEY no puede usar una service_role key en el frontend.'
        );
        return '';
      }
    } catch {
      // No es un JWT JSON estándar
    }
  }

  return key;
}

const DEFAULT_API_BASE_URL = isLocalDevHost() ? 'http://localhost:4000' : '';

export const config = {
  // URL Base de la API REST (en HTTPS debe venir de VITE_API_BASE_URL; nunca http://localhost:4000)
  API_BASE_URL: sanitizeEndpointUrl(
    getEnv('VITE_API_BASE_URL', DEFAULT_API_BASE_URL),
    'VITE_API_BASE_URL'
  ),

  // Configuración Pública de Supabase
  SUPABASE_URL: sanitizeEndpointUrl(
    getEnv('VITE_SUPABASE_URL', 'https://pzkeymtcplpvwjzysziz.supabase.co'),
    'VITE_SUPABASE_URL'
  ),
  SUPABASE_ANON_KEY: sanitizePublicSupabaseKey(
    getEnv('VITE_SUPABASE_ANON_KEY', 'sb_publishable__iiLgQ9edVveaxZqJ33Ltg_jEzF8xQ0')
  ),

  // Formato estándar de datos
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },

  // Tiempo límite de petición en milisegundos (10 segundos)
  TIMEOUT_MS: 10000,

  // Claves de almacenamiento local para persistencia de sesión
  STORAGE_KEYS: {
    AUTH_TOKEN: 'lc_auth_token',
    USER_DATA: 'lc_auth_user',
    API_MODE: 'lc_api_mode', // 'hybrid' | 'backend' | 'supabase' | 'offline'
  },

  /**
   * Permite actualizar la URL base en tiempo de ejecución (útil para cambiar de localhost a producción)
   * @param {string} newUrl
   */
  setApiBaseUrl(newUrl) {
    if (!newUrl) {
      window.localStorage.removeItem('lc_env_VITE_API_BASE_URL');
      this.API_BASE_URL = sanitizeEndpointUrl(
        getEnv('VITE_API_BASE_URL', DEFAULT_API_BASE_URL),
        'VITE_API_BASE_URL'
      );
    } else {
      const sanitized = sanitizeEndpointUrl(newUrl, 'VITE_API_BASE_URL');
      if (!sanitized) return;
      window.localStorage.setItem('lc_env_VITE_API_BASE_URL', sanitized);
      this.API_BASE_URL = sanitized;
    }
  },
};
