/**
 * @fileoverview Vista de Inicio de Sesión (LoginView).
 * Incluye autenticación por Google Workspace SSO con selector interactivo de cuentas
 * corporativas y login tradicional por credenciales.
 */

import { escapeHtml } from '../core/formatters.js';
import { icon } from '../core/icons.js';
import { googleAccounts } from '../data/mockData.js';

/**
 * Renderiza la pantalla completa de inicio de sesión.
 * @param {object} state Estado global.
 * @returns {string} HTML string
 */
export function renderLoginView(state) {
  const { email, password, remember, error, googlePickerOpen } = state.loginState;

  const googlePickerHtml = googlePickerOpen
    ? `<div class="google-account-picker" role="region" aria-label="Selector de cuentas de Google Workspace">
        <div class="google-picker-head">
          <div>
            <strong>Seleccioná una cuenta corporativa</strong>
            <small>Google Workspace</small>
          </div>
          <button
            type="button"
            class="small-icon"
            aria-label="Cerrar selector de cuentas"
            data-action="toggle-google-picker"
          >
            ${icon('x', 16)}
          </button>
        </div>
        <div class="google-picker-list">
          ${googleAccounts
            .map(
              (acc) => `<button
                type="button"
                class="google-account-item"
                data-action="google-login-account"
                data-account-name="${escapeHtml(acc.name)}"
                data-account-email="${escapeHtml(acc.email)}"
              >
                <div class="google-account-avatar">${escapeHtml(acc.initials)}</div>
                <div class="google-account-info">
                  <strong>${escapeHtml(acc.name)}</strong>
                  <span>${escapeHtml(acc.email)}</span>
                  <small>${escapeHtml(acc.role)}</small>
                </div>
              </button>`
            )
            .join('')}
        </div>
        <div class="google-picker-foot">${icon('shieldCheck', 13)} <span>Acceso corporativo</span></div>
      </div>`
    : '';

  return `<div class="login-screen">
    <section class="login-rail">
      <div class="login-brand">
        <div class="brand-mark">
          <i></i><i></i><i></i>
        </div>
        <div class="brand-copy">
          <strong>Logic Control</strong>
          <small>Gestión de Inventarios · v2.4</small>
        </div>
      </div>

      <div class="login-product">
        <div class="login-overline">
          ${icon('shieldCheck', 14)}
          Operación multi-sede en tiempo real
        </div>
        <h1>Control total de tu inventario, sin planillas dispersas.</h1>
        <p>
          Centralizá productos, lotes mayoristas, puntos de pedido críticos y
          movimientos entre depósitos desde una única consola operativa.
        </p>

        <div class="login-metrics-strip">
          <div>
            <strong>99,4%</strong>
            <span>Exactitud de conteo físico</span>
          </div>
          <div>
            <strong>-38%</strong>
            <span>Quiebres de stock mensuales</span>
          </div>
          <div>
            <strong>3 sedes</strong>
            <span>Sincronizadas en línea</span>
          </div>
        </div>
      </div>
    </section>

    <main class="login-main">
      <form class="login-card login-form" data-form="login" novalidate>
        <div class="login-heading">
          <div class="login-lock">${icon('lockKeyhole', 18)}</div>
          <h2>Iniciar sesión en Logic Control</h2>
          <p>Accedé con tu cuenta corporativa de Google Workspace o con tus credenciales de operador.</p>
        </div>

        <div class="google-auth-box">
          <button
            type="button"
            class="google-login"
            data-action="toggle-google-picker"
          >
            <span class="google-icon-wrap">${icon('googleLogo', 18)}</span>
            <span class="google-btn-copy">
              <strong>Continuar con Google Workspace</strong>
            </span>
            <span class="google-badge">SSO</span>
          </button>

          ${googlePickerHtml}
        </div>

        <div class="login-divider"><span></span>o ingresá con correo corporativo<span></span></div>

        <label class="login-field" for="login-email">
          Correo corporativo
          <div>
          <input
            id="login-email"
            type="email"
            value="${escapeHtml(email)}"
            placeholder="nombre@empresa.com.ar"
            data-login-input="email"
            required
          />
          </div>
        </label>

        <label class="login-field" for="login-password">
          Contraseña
          <div>
            <input
              id="login-password"
              type="password"
              value="${escapeHtml(password)}"
              data-login-input="password"
              required
            />
          </div>
        </label>

        ${error ? `<div class="login-error">${escapeHtml(error)}</div>` : ''}

        <div class="login-options">
          <label>
            <input
              type="checkbox"
              ${remember ? 'checked' : ''}
              data-login-checkbox="remember"
            />
            Mantener turno activo en este puesto
          </label>
          <button type="button" data-action="forgot-password-toast">¿Olvidaste tu clave?</button>
        </div>

        <button type="submit" class="button button-primary login-submit">
          Ingresar al panel operativo
          ${icon('arrowRight', 16)}
        </button>

        <div class="login-demo-note">
          <span>${icon('lockKeyhole', 13)} Conexión cifrada TLS 1.3</span>
          <span>·</span>
          <span>${icon('fingerprint', 13)} OAuth 2.0 / Google Workspace</span>
        </div>
      </form>
    </main>
  </div>`;
}
