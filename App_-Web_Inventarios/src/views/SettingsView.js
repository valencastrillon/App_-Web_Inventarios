/**
 * @fileoverview Vista de Configuración del Sistema (SettingsView).
 * Incluye:
 * - Parámetros de la razón social y depósito principal
 * - Reglas automáticas de stock y alertas
 * - Control de Usuarios (Habilitar / Inhabilitar operadores y roles)
 * - Cambio de Contraseña y Seguridad de Cuenta (`AccountSecurityPanel`)
 */

import { renderAccountSecurityPanel } from '../components/AccountSecurityPanel.js';
import { escapeHtml } from '../core/formatters.js';
import { icon } from '../core/icons.js';

/**
 * Renderiza la vista de Configuración y Seguridad.
 * @param {object} state Estado global.
 * @returns {string} HTML string
 */
export function renderSettingsView(state) {
  const { settingsState: s } = state;

  const rules = [
    {
      key: 'emailAlerts',
      value: s.emailAlerts,
      title: 'Alertas inmediatas por correo electrónico',
      desc: 'Notificar al responsable de compras cuando un SKU perfora su stock mínimo.',
    },
    {
      key: 'dailyDigest',
      value: s.dailyDigest,
      title: 'Resumen ejecutivo diario (08:00 hs)',
      desc: 'Enviar reporte consolidado con variaciones de valorización y despachos.',
    },
    {
      key: 'blockNegativeStock',
      value: s.blockNegativeStock,
      title: 'Bloquear egresos con saldo insuficiente',
      desc: 'Impide confirmar remitos de salida que dejen existencias en negativo.',
    },
    {
      key: 'autoSku',
      value: s.autoSku,
      title: 'Generación asistida de códigos SKU',
      desc: 'Sugiere automáticamente el correlativo según el prefijo de categoría.',
    },
  ];

  return `<div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Configuración del sistema</h1>
        <p class="page-subtitle">
          Parámetros operativos del depósito, umbrales de alerta, control de usuarios y seguridad de cuenta.
        </p>
      </div>
      <div class="page-actions">
        <button
          type="button"
          class="btn btn-primary"
          data-action="save-settings"
        >
          ${icon('save', 15)}
          <span>Guardar preferencias</span>
        </button>
      </div>
    </div>

    <div class="dashboard-split">
      <section class="panel">
        <div class="panel-header">
          <div>
            <div class="panel-title">Datos de la empresa y depósito principal</div>
            <div class="panel-subtitle">Información impresa en remitos internos y órdenes de compra</div>
          </div>
        </div>
        <div class="panel-body">
          <div class="form-grid">
            <div class="field">
              <label for="cfg-company">Razón social</label>
              <input
                id="cfg-company"
                class="input"
                value="${escapeHtml(s.company)}"
                data-setting-input="company"
              />
            </div>
            <div class="field">
              <label for="cfg-cuit">CUIT</label>
              <input
                id="cfg-cuit"
                class="input"
                value="${escapeHtml(s.cuit)}"
                data-setting-input="cuit"
              />
            </div>
            <div class="field" style="grid-column: 1 / -1;">
              <label for="cfg-warehouse">Ubicación cabecera</label>
              <input
                id="cfg-warehouse"
                class="input"
                value="${escapeHtml(s.warehouse)}"
                data-setting-input="warehouse"
              />
            </div>
            <div class="field">
              <label for="cfg-currency">Moneda de valorización</label>
              <input
                id="cfg-currency"
                class="input"
                value="${escapeHtml(s.currency)}"
                data-setting-input="currency"
              />
            </div>
            <div class="field">
              <label for="cfg-threshold">Colchón de seguridad sugerido (%)</label>
              <input
                id="cfg-threshold"
                class="input"
                type="number"
                value="${escapeHtml(s.criticalThreshold)}"
                data-setting-input="criticalThreshold"
              />
            </div>
          </div>
        </div>
      </section>

      <section class="panel">
        <div class="panel-header">
          <div>
            <div class="panel-title">Reglas de control y notificaciones</div>
            <div class="panel-subtitle">Automatizaciones activas para el equipo de almacén</div>
          </div>
        </div>
        <div class="panel-body" style="display: flex; flex-direction: column; gap: 14px;">
          ${rules
            .map(
              (item) => `<label
                style="display: flex; justify-content: space-between; align-items: center; gap: 14px; padding-bottom: 12px; border-bottom: 1px solid var(--border); cursor: pointer;"
              >
                <div>
                  <div style="font-weight: 600; font-size: 13px;">${escapeHtml(item.title)}</div>
                  <div style="font-size: 12px; color: var(--text-secondary);">${escapeHtml(item.desc)}</div>
                </div>
                <input
                  type="checkbox"
                  ${item.value ? 'checked' : ''}
                  data-setting-checkbox="${item.key}"
                  style="width: 17px; height: 17px; accent-color: var(--accent);"
                />
              </label>`
            )
            .join('')}
        </div>
      </section>
    </div>

    ${renderAccountSecurityPanel(state)}
  </div>`;
}
