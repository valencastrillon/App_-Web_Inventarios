/**
 * @fileoverview Configuración Centralizada de Endpoints y Variables de Entorno.
 * Define la URL base de desarrollo (http://localhost:4000), las credenciales públicas de Supabase
 * y las cabeceras predeterminadas (application/json) para la conexión del frontend.
 */

// Intentar leer de import.meta.env si un bundler como Vite está presente
const metaEnv = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env : {};
const windowEnv = typeof window !== 'undefined' && window.__APP_CONFIG__ ? window.__APP_CONFIG__ : {};

/**
 * Obtiene el valor de una variable de entorno con cascada de prioridad:
 * 1. Override manual en localStorage (para pruebas en vivo)
 * 2. Inyección global en window.__APP_CONFIG__
 * 3. Variable de Vite (import.meta.env)
 * 4. Valor por defecto especificado
 *
 * @param {string} key Nombre de la clave
 * @param {string} defaultValue Valor de respaldo
 * @returns {string}
 */
function getEnv(key, defaultValue) {
  if (typeof window !== 'undefined') {
    const override = window.localStorage.getItem(`lc_env_${key}`);
    if (override) return override;
  }
  return windowEnv[key] || metaEnv[key] || defaultValue;
}

export const config = {
  // URL Base de la API REST local
  API_BASE_URL: getEnv('VITE_API_BASE_URL', 'http://localhost:4000').replace(/\/+$/, ''),

  // Configuración Pública de Supabase
  SUPABASE_URL: getEnv('VITE_SUPABASE_URL', 'https://pzkeymtcplpvwjzysziz.supabase.co').replace(/\/+$/, ''),
  SUPABASE_ANON_KEY: getEnv(
    'VITE_SUPABASE_ANON_KEY',
    'sb_publishable__iiLgQ9edVveaxZqJ33Ltg_jEzF8xQ0'
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
      this.API_BASE_URL = 'http://localhost:4000';
    } else {
      const sanitized = newUrl.trim().replace(/\/+$/, '');
      window.localStorage.setItem('lc_env_VITE_API_BASE_URL', sanitized);
      this.API_BASE_URL = sanitized;
    }
  },
};
