/**
 * @fileoverview Configuración pública inyectada en tiempo de build (Netlify / hosting estático).
 * En desarrollo local permanece vacío y config.js usa sus valores de respaldo locales.
 * En Netlify se sobrescribe ejecutando `node scripts/generate-env.mjs` con las variables VITE_*.
 * IMPORTANTE: Nunca incluir claves privadas (service_role / sb_secret_).
 */
window.__APP_CONFIG__ = window.__APP_CONFIG__ || {};
