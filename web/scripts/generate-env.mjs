/**
 * @fileoverview Genera `env-config.js` a partir de variables de entorno públicas (`VITE_*`)
 * durante el build en Netlify (sin requerir Vite ni dependencias de npm).
 *
 * Uso en Netlify (Build command):
 * - Si Base directory = App_-Web_Inventarios: `node scripts/generate-env.mjs`
 * - Si Base directory está vacío:             `node App_-Web_Inventarios/scripts/generate-env.mjs`
 */

import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const PUBLIC_KEYS = [
  'VITE_API_BASE_URL',
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
];

function isForbiddenSecretKey(value) {
  if (typeof value !== 'string') return false;
  const trimmed = value.trim();
  if (/^sb_secret_/i.test(trimmed)) return true;

  // Verificar si un JWT tiene role === 'service_role'
  const parts = trimmed.split('.');
  if (parts.length === 3) {
    try {
      const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
      if (payload?.role === 'service_role') return true;
    } catch {
      // No es un JWT JSON decodificable
    }
  }
  return false;
}

const publicConfig = {};

for (const key of PUBLIC_KEYS) {
  const raw = process.env[key];
  if (typeof raw !== 'string') continue;

  const value = raw.trim();
  if (!value) continue;

  if (key === 'VITE_SUPABASE_ANON_KEY' && isForbiddenSecretKey(value)) {
    console.error(
      `[generate-env] ERROR DE SEGURIDAD: ${key} contiene una clave service_role/sb_secret_. ` +
        'Nunca expongas claves privadas en el frontend.'
    );
    process.exit(1);
  }

  publicConfig[key] = key.endsWith('_URL') ? value.replace(/\/+$/, '') : value;
}

const targetPath = fileURLToPath(new URL('../env-config.js', import.meta.url));
const fileContent = [
  '// Archivo generado automáticamente por scripts/generate-env.mjs durante el build.',
  '// Solo contiene variables públicas VITE_* (nunca service_role).',
  `window.__APP_CONFIG__ = Object.assign({}, window.__APP_CONFIG__, ${JSON.stringify(publicConfig, null, 2)});`,
  '',
].join('\n');

writeFileSync(targetPath, fileContent, 'utf8');

console.log(
  '[generate-env] env-config.js generado con claves:',
  Object.keys(publicConfig).length > 0 ? Object.keys(publicConfig).join(', ') : '(ninguna variable VITE_* definida)'
);
