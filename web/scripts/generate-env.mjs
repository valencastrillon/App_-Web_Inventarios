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

const PUBLIC_KEY_SOURCES = [
  { target: 'VITE_API_BASE_URL', candidates: ['VITE_API_BASE_URL', 'API_BASE_URL'] },
  { target: 'VITE_SUPABASE_URL', candidates: ['VITE_SUPABASE_URL', 'SUPABASE_URL'] },
  { target: 'VITE_SUPABASE_ANON_KEY', candidates: ['VITE_SUPABASE_ANON_KEY', 'SUPABASE_ANON_KEY'] },
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

for (const { target, candidates } of PUBLIC_KEY_SOURCES) {
  let resolvedValue = '';
  for (const candidate of candidates) {
    const raw = process.env[candidate];
    if (typeof raw === 'string' && raw.trim()) {
      resolvedValue = raw.trim();
      break;
    }
  }

  if (!resolvedValue) continue;

  if (target === 'VITE_SUPABASE_ANON_KEY' && isForbiddenSecretKey(resolvedValue)) {
    console.error(
      `[generate-env] ERROR DE SEGURIDAD: ${target} contiene una clave service_role/sb_secret_. ` +
        'Nunca expongas claves privadas en el frontend.'
    );
    process.exit(1);
  }

  publicConfig[target] = target.endsWith('_URL')
    ? resolvedValue.replace(/\/+$/, '')
    : resolvedValue;
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
  '[generate-env] env-config.js generado:',
  JSON.stringify({
    VITE_API_BASE_URL: publicConfig.VITE_API_BASE_URL || '(no definida)',
    VITE_SUPABASE_URL: publicConfig.VITE_SUPABASE_URL || '(no definida)',
    VITE_SUPABASE_ANON_KEY: publicConfig.VITE_SUPABASE_ANON_KEY ? '(configurada)' : '(no definida)',
  })
);
