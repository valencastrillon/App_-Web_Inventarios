/**
 * @fileoverview Panel de Gestión de Usuarios (Habilitar/Inhabilitar operadores, alta y roles)
 * y Cambio de Contraseña Corporativa dentro de la vista de Configuración.
 */

import { escapeHtml } from '../core/formatters.js';
import { icon } from '../core/icons.js';
import { evaluatePasswordStrength } from '../services/authService.js';

/**
 * Renderiza el bloque de seguridad de cuentas y control de usuarios.
 * @param {object} state Estado global.
 * @returns {string} HTML string
 */
export function renderAccountSecurityPanel(state) {
  const { users, branches, settingsState: s } = state;
  const selectableBranches = branches.filter((b) => b.id !== 'all');
  const activeCount = users.filter((u) => u.enabled).length;
  const disabledCount = users.length - activeCount;

  const strength = evaluatePasswordStrength(s.newPassword);

  const addUserFormHtml = s.addingUser
    ? `<form class="user-add-inline" data-form="add-user">
        <div class="field">
          <label>Nombre y Apellido *</label>
          <input
            class="input"
            value="${escapeHtml(s.newUserName)}"
            placeholder="Ej. Sofía Alarcón"
            data-setting-input="newUserName"
            required
          />
        </div>
        <div class="field">
          <label>Correo corporativo *</label>
          <input
            class="input"
            type="email"
            value="${escapeHtml(s.newUserEmail)}"
            placeholder="salarcon@comercialnorte.com.ar"
            data-setting-input="newUserEmail"
            required
          />
        </div>
        <div class="field">
          <label>Rol asignado</label>
          <select class="select" data-setting-input="newUserRole">
            <option value="Jefe de Depósito" ${s.newUserRole === 'Jefe de Depósito' ? 'selected' : ''}>Jefe de Depósito</option>
            <option value="Supervisor Logístico" ${s.newUserRole === 'Supervisor Logístico' ? 'selected' : ''}>Supervisor Logístico</option>
            <option value="Encargada de Sucursal" ${s.newUserRole === 'Encargada de Sucursal' ? 'selected' : ''}>Encargada de Sucursal</option>
            <option value="Auditor de Inventario" ${s.newUserRole === 'Auditor de Inventario' ? 'selected' : ''}>Auditor de Inventario</option>
            <option value="Operador de Depósito" ${s.newUserRole === 'Operador de Depósito' ? 'selected' : ''}>Operador de Depósito</option>
          </select>
        </div>
        <div class="field">
          <label>Sede principal</label>
          <select class="select" data-setting-input="newUserBranch">
            ${selectableBranches
              .map(
                (b) =>
                  `<option value="${escapeHtml(b.name)}" ${
                    s.newUserBranch === b.name ? 'selected' : ''
                  }>${escapeHtml(b.name)}</option>`
              )
              .join('')}
          </select>
        </div>
        <div class="user-add-actions">
          <button type="button" class="btn btn-secondary btn-sm" data-action="cancel-add-user">
            Cancelar
          </button>
          <button type="submit" class="btn btn-primary btn-sm">
            ${icon('checkCircle2', 14)} Habilitar usuario
          </button>
        </div>
      </form>`
    : '';

  const usersRowsHtml = users
    .map((u) => {
      const initials = u.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2);

      return `<div class="user-perm-row ${u.enabled ? '' : 'is-disabled'}">
        <div class="user-perm-main">
          <div class="user-perm-avatar ${u.enabled ? 'active' : 'disabled'}">
            ${escapeHtml(initials)}
          </div>
          <div>
            <div class="user-perm-name">
              ${escapeHtml(u.name)}
              <span class="badge ${u.enabled ? 'badge-success' : 'badge-danger'}">
                <span class="badge-dot"></span>
                ${u.enabled ? 'Habilitado' : 'Inhabilitado'}
              </span>
            </div>
            <div class="user-perm-meta">
              ${escapeHtml(u.email)} · <strong>${escapeHtml(u.branch)}</strong> · Últ. acceso: ${escapeHtml(u.lastAccess)}
            </div>
          </div>
        </div>

        <div class="user-perm-controls">
          <select
            class="select select-compact"
            data-action="change-user-role"
            data-user-id="${escapeHtml(u.id)}"
            aria-label="Rol de ${escapeHtml(u.name)}"
            ${u.enabled ? '' : 'disabled'}
          >
            <option value="Jefe de Depósito" ${u.role === 'Jefe de Depósito' ? 'selected' : ''}>Jefe de Depósito</option>
            <option value="Supervisor Logístico" ${u.role === 'Supervisor Logístico' ? 'selected' : ''}>Supervisor Logístico</option>
            <option value="Encargada de Sucursal" ${u.role === 'Encargada de Sucursal' ? 'selected' : ''}>Encargada de Sucursal</option>
            <option value="Auditor de Inventario" ${u.role === 'Auditor de Inventario' ? 'selected' : ''}>Auditor de Inventario</option>
            <option value="Operadora de Recepción" ${u.role === 'Operadora de Recepción' ? 'selected' : ''}>Operadora de Recepción</option>
            <option value="Operador de Depósito" ${u.role === 'Operador de Depósito' ? 'selected' : ''}>Operador de Depósito</option>
          </select>

          <button
            type="button"
            class="btn btn-sm ${u.enabled ? 'btn-danger-outline' : 'btn-success-outline'}"
            data-action="toggle-user-enabled"
            data-user-id="${escapeHtml(u.id)}"
          >
            ${
              u.enabled
                ? `${icon('userRoundX', 14)} Inhabilitar`
                : `${icon('userRoundCheck', 14)} Habilitar`
            }
          </button>
        </div>
      </div>`;
    })
    .join('');

  const inputType = s.showPasswords ? 'text' : 'password';

  return `<div class="security-grid">
    <!-- Gestión de Usuarios: Habilitar / Inhabilitar -->
    <div class="panel">
      <div class="panel-header">
        <div>
          <div class="panel-title" style="display: flex; align-items: center; gap: 8px;">
            ${icon('userCog', 17)} Control de Usuarios y Permisos de Acceso
          </div>
          <div class="panel-subtitle">
            Habilitá o inhabilitá operadores por sucursal en tiempo real (${activeCount} habilitados · ${disabledCount} inhabilitados)
          </div>
        </div>
        <button
          type="button"
          class="btn btn-secondary btn-sm"
          data-action="toggle-add-user"
        >
          ${icon('userPlus', 14)} Nuevo usuario
        </button>
      </div>

      ${addUserFormHtml}

      <div class="user-permissions-list">${usersRowsHtml}</div>
    </div>

    <!-- Cambio de Contraseña y Seguridad de Cuenta -->
    <form class="panel" data-form="change-password">
      <div class="panel-header">
        <div>
          <div class="panel-title" style="display: flex; align-items: center; gap: 8px;">
            ${icon('keyRound', 17)} Cambiar Contraseña y Seguridad de Cuenta
          </div>
          <div class="panel-subtitle">
            Actualizá la clave de acceso de Lucas Gómez (lgomez@comercialnorte.com.ar)
          </div>
        </div>
        <button
          type="button"
          class="btn btn-ghost btn-sm"
          data-action="toggle-show-passwords"
        >
          ${s.showPasswords ? `${icon('eyeOff', 14)} Ocultar` : `${icon('eye', 14)} Mostrar`}
        </button>
      </div>

      <div class="panel-body" style="display: flex; flex-direction: column; gap: 14px;">
        <div class="field">
          <label for="cfg-current-pwd">Contraseña actual *</label>
          <input
            id="cfg-current-pwd"
            class="input"
            type="${inputType}"
            value="${escapeHtml(s.currentPassword)}"
            placeholder="Ingresá tu contraseña vigente"
            data-setting-input="currentPassword"
          />
        </div>

        <div class="form-grid">
          <div class="field">
            <label for="cfg-new-pwd">Nueva contraseña *</label>
            <input
              id="cfg-new-pwd"
              class="input"
              type="${inputType}"
              value="${escapeHtml(s.newPassword)}"
              placeholder="Mínimo 8 caracteres"
              data-setting-input="newPassword"
            />
          </div>
          <div class="field">
            <label for="cfg-confirm-pwd">Repetir nueva contraseña *</label>
            <input
              id="cfg-confirm-pwd"
              class="input"
              type="${inputType}"
              value="${escapeHtml(s.confirmPassword)}"
              placeholder="Confirmá la nueva clave"
              data-setting-input="confirmPassword"
            />
          </div>
        </div>

        <div class="password-strength-box">
          <div class="password-strength-top">
            <span>Nivel de seguridad de la clave</span>
            <strong style="color: ${strength.color};">${strength.label}</strong>
          </div>
          <div class="password-strength-bars">
            ${[1, 2, 3, 4]
              .map(
                (step) =>
                  `<span
                    class="strength-bar ${strength.score >= step ? 'filled' : ''}"
                    style="${strength.score >= step ? `background: ${strength.color};` : ''}"
                  ></span>`
              )
              .join('')}
          </div>
          <div class="password-policy-hint">
            ${icon('shieldCheck', 13)} Recomendado: combinar mayúsculas, números y símbolos especiales.
          </div>
        </div>

        ${
          s.passwordSavedMessage
            ? `<div class="password-saved-banner">
                ${icon('checkCircle2', 15)}
                <span>${escapeHtml(s.passwordSavedMessage)}</span>
              </div>`
            : ''
        }

        <div style="display: flex; justify-content: flex-end; gap: 10px; padding-top: 4px;">
          <button
            type="button"
            class="btn btn-secondary"
            data-action="clear-password-fields"
          >
            Limpiar campos
          </button>
          <button type="submit" class="btn btn-primary">
            ${icon('keyRound', 15)} Actualizar contraseña
          </button>
        </div>
      </div>
    </form>
  </div>`;
}
