/**
 * @fileoverview Consola Corporativa Multi-Empresa (admin.html) de Logic Control.
 * Permite administrar organizaciones (Tenants), sucursales operativas, nómina de usuarios
 * por empresa, políticas de identidad federada Google Workspace (SSO) y bitácora de auditoría.
 */

import { renderKpiCard } from '../components/KpiCard.js';
import { escapeHtml, formatNumber } from '../core/formatters.js';
import { icon } from '../core/icons.js';
import { companiesApi, connectionManager } from '../services/apiRepository.js';
import {
  initialAdminGoogleAccounts,
  initialAuditLogs,
  initialCompanies,
  planQuotaLimits,
  roleCapabilitiesMatrix,
} from './adminData.js';

const STORAGE_KEYS = {
  COMPANIES: 'logic_control_admin_companies_v2',
  LEGACY_COMPANIES: 'logic_control_admin_companies_v1',
  AUDIT_LOGS: 'logic_control_admin_audit_v1',
  AUTH: 'logic_control_admin_auth_v1',
  THEME: 'stockia_theme',
  MAIN_APP_USERS: 'stockia_users',
  MAIN_APP_AUTH: 'stockia_auth',
};

const AVAILABLE_ROLES = roleCapabilitiesMatrix.map((r) => r.role);

function loadFromStorage(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn('Error guardando en localStorage:', err);
  }
}

function loadSessionAuth() {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEYS.AUTH);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveSessionAuth(session) {
  try {
    if (!session) {
      window.sessionStorage.removeItem(STORAGE_KEYS.AUTH);
    } else {
      window.sessionStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(session));
    }
  } catch (err) {
    console.warn('Error guardando sesión:', err);
  }
}

function buildInitials(name = '') {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'LC';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

/**
 * Normaliza empresas y usuarios provenientes de versiones previas en localStorage
 * para evitar campos indefinidos (`status`, `enabled`, `googleLinked`, `ssoPolicy`).
 */
function normalizeCompaniesData(rawCompanies) {
  const source =
    Array.isArray(rawCompanies) && rawCompanies.length > 0
      ? rawCompanies
      : JSON.parse(JSON.stringify(initialCompanies));

  return source.map((company, idx) => {
    const branches =
      Array.isArray(company.branches) && company.branches.length > 0
        ? company.branches
        : ['Casa Central'];

    const users = (Array.isArray(company.users) ? company.users : []).map((u, uIdx) => {
      const isEnabled =
        typeof u.enabled === 'boolean'
          ? u.enabled
          : u.status
          ? u.status === 'Activo'
          : true;
      const statusLabel = isEnabled ? 'Activo' : 'Inactivo';
      const isGoogle =
        typeof u.googleLinked === 'boolean'
          ? u.googleLinked
          : u.authProvider
          ? String(u.authProvider).toLowerCase().includes('google')
          : true;

      return {
        id: u.id || `USR-${idx + 1}0${uIdx + 1}`,
        name: u.name || 'Operador Corporativo',
        email: u.email || `operador${uIdx + 1}@${company.domain || 'empresa.com.ar'}`,
        role: AVAILABLE_ROLES.includes(u.role) ? u.role : AVAILABLE_ROLES[1],
        branch: branches.includes(u.branch) ? u.branch : branches[0],
        status: statusLabel,
        enabled: isEnabled,
        googleLinked: isGoogle,
        lastAccess: u.lastAccess || 'Reciente',
      };
    });

    return {
      id: company.id || `EMP-0${idx + 1}`,
      name: company.name || 'Empresa Registrada',
      cuit: company.cuit || '30-00000000-0',
      industry: company.industry || 'Comercio y Distribución',
      domain: String(company.domain || 'empresa.com.ar').replace(/^@/, '').toLowerCase(),
      city: company.city || 'Buenos Aires',
      address: company.address || 'Casa Central',
      phone: company.phone || '+54 11 5000-0000',
      plan: planQuotaLimits[company.plan] ? company.plan : 'Enterprise Multi-Sede',
      status: ['Activa', 'En implementación', 'Suspendida'].includes(company.status)
        ? company.status
        : 'Activa',
      createdAt: company.createdAt || '15 Ene 2025',
      domainVerified: company.domainVerified !== false,
      ssoPolicy: {
        enforceGoogleSso: company.ssoPolicy?.enforceGoogleSso ?? true,
        restrictToCorporateDomain: company.ssoPolicy?.restrictToCorporateDomain ?? false,
        allowBranchSwitching: company.ssoPolicy?.allowBranchSwitching ?? true,
      },
      branches,
      users,
    };
  });
}

const storedCompaniesRaw =
  loadFromStorage(STORAGE_KEYS.COMPANIES, null) ||
  loadFromStorage(STORAGE_KEYS.LEGACY_COMPANIES, null);

const initialNormalizedCompanies = normalizeCompaniesData(storedCompaniesRaw);
const storedAuditLogs = loadFromStorage(
  STORAGE_KEYS.AUDIT_LOGS,
  JSON.parse(JSON.stringify(initialAuditLogs))
);
const activeSession = loadSessionAuth();

const state = {
  isAuthenticated: Boolean(activeSession),
  currentUser: activeSession || {
    name: 'Jeremías Reinoso',
    email: 'jere.admin@logiccontrol.com.ar',
    role: 'Super Administrador Global',
    companyName: 'Consola Central · Logic Control',
    avatar: 'JR',
  },
  theme: window.localStorage.getItem(STORAGE_KEYS.THEME) || 'light',

  // Conectividad a Endpoints & Supabase
  apiConnection: {
    backendOnline: false,
    backendLatency: 0,
    supabaseOnline: false,
    supabaseLatency: 0,
    activeSource: 'local',
  },

  // Navegación principal: 'companies' | 'register-company' | 'google-directory' | 'audit-log'
  activeTab: 'companies',
  // Sub-pestaña dentro de la empresa seleccionada: 'users' | 'branches' | 'security'
  companySubTab: 'users',

  // Estado de Login
  loginEmail: 'jere.admin@logiccontrol.com.ar',
  loginPassword: '',
  loginError: '',
  showGooglePicker: false,
  customGoogleEmail: '',

  // Estado de Empresas y Usuarios
  companies: initialNormalizedCompanies,
  selectedCompanyId: initialNormalizedCompanies[0]?.id || 'EMP-01',
  companySearch: '',
  companyStatusFilter: 'ALL',

  userSearch: '',
  userRoleFilter: 'ALL',
  userBranchFilter: 'ALL',
  showAddUserForm: false,

  // Directorio Global SSO
  directorySearch: '',
  directoryAuthFilter: 'ALL',

  // Bitácora de Auditoría
  auditLogs: Array.isArray(storedAuditLogs) ? storedAuditLogs : initialAuditLogs,
  auditCategoryFilter: 'ALL',

  // Modales: 'company' | 'bulk-users' | null
  activeModal: null,
  editingCompanyId: null,
  bulkUsersText: '',

  // Notificación / Feedback
  feedback: null,
};

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  window.localStorage.setItem(STORAGE_KEYS.THEME, theme);
}

function setFeedback(type, message) {
  state.feedback = { type, message };
}

function appendAuditLog({ companyName, category, action, tone = 'info' }) {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
  const entry = {
    id: `AUD-${Date.now().toString().slice(-4)}`,
    timestamp: `Hoy · ${timeStr}`,
    actor: state.currentUser?.email || 'admin@logiccontrol.com.ar',
    companyName: companyName || 'Consola Global',
    category,
    action,
    tone,
  };
  state.auditLogs = [entry, ...state.auditLogs.slice(0, 49)];
  saveToStorage(STORAGE_KEYS.AUDIT_LOGS, state.auditLogs);
}

function syncCompaniesPersistence() {
  saveToStorage(STORAGE_KEYS.COMPANIES, state.companies);

  // Sincronizar en vivo los usuarios de Comercial Norte SRL con la App de Inventarios (index.html)
  const mainCompany =
    state.companies.find((c) => c.id === 'EMP-01' || c.id === 'EMP-001') ||
    state.companies.find((c) => c.name.toLowerCase().includes('comercial norte'));

  if (mainCompany && Array.isArray(mainCompany.users)) {
    const mappedForMainApp = mainCompany.users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      branch: u.branch,
      lastAccess: u.lastAccess || 'Reciente',
      enabled: u.enabled !== false && u.status === 'Activo',
    }));
    saveToStorage(STORAGE_KEYS.MAIN_APP_USERS, mappedForMainApp);
  }
}

function getAllGoogleAccounts() {
  const map = new Map();

  initialAdminGoogleAccounts.forEach((acc) => {
    map.set(acc.email.toLowerCase(), {
      name: acc.name,
      email: acc.email,
      role: acc.role,
      companyName: acc.companyName || 'Logic Control',
      initials: acc.initials || buildInitials(acc.name),
    });
  });

  state.companies.forEach((company) => {
    if (company.status === 'Suspendida') return;
    (company.users || []).forEach((user) => {
      if (user.status === 'Activo' && user.googleLinked !== false) {
        map.set(user.email.toLowerCase(), {
          name: user.name,
          email: user.email,
          role: user.role,
          companyName: company.name,
          initials: buildInitials(user.name),
        });
      }
    });
  });

  return Array.from(map.values());
}

function getSelectedCompany() {
  return (
    state.companies.find((c) => c.id === state.selectedCompanyId) ||
    state.companies[0] ||
    null
  );
}

function downloadCsvFile(filename, rows) {
  const csvContent = rows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/* ==========================================================================
   1. PANTALLA DE LOGIN (Mismo sistema visual de LoginView.js)
   ========================================================================== */
function renderAdminLoginView() {
  const googleAccounts = getAllGoogleAccounts();

  const googlePickerHtml = state.showGooglePicker
    ? `<div class="google-account-picker" role="region" aria-label="Selector de cuentas de Google Workspace">
        <div class="google-picker-head">
          <div>
            <strong>Seleccioná una cuenta autorizada</strong>
            <small>Google Workspace · Directorio Multi-Empresa (${googleAccounts.length} cuentas)</small>
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
                data-action="google-select-account"
                data-email="${escapeHtml(acc.email)}"
                data-name="${escapeHtml(acc.name)}"
                data-role="${escapeHtml(acc.role)}"
                data-company="${escapeHtml(acc.companyName)}"
              >
                <div class="google-account-avatar">${escapeHtml(acc.initials)}</div>
                <div class="google-account-info">
                  <strong>${escapeHtml(acc.name)}</strong>
                  <span>${escapeHtml(acc.email)}</span>
                  <small>${escapeHtml(acc.companyName)} · ${escapeHtml(acc.role)}</small>
                </div>
                ${icon('arrowUpRight', 15)}
              </button>`
            )
            .join('')}
        </div>
        <div class="google-custom-box">
          <label for="custom-google-email">Ingresar con otra cuenta corporativa o @gmail.com</label>
          <div class="google-custom-row">
            <input
              id="custom-google-email"
              class="input"
              type="email"
              placeholder="usuario@empresa.com.ar"
              value="${escapeHtml(state.customGoogleEmail)}"
            />
            <button
              type="button"
              class="btn btn-primary btn-sm"
              data-action="google-custom-login"
            >
              Continuar
            </button>
          </div>
        </div>
        <div class="google-picker-foot">
          ${icon('shieldCheck', 13)}
          <span>Identidad federada OAuth 2.0 · Google Workspace</span>
        </div>
      </div>`
    : '';

  const totalUsersCount = state.companies.reduce((acc, c) => acc + (c.users?.length || 0), 0);
  const totalBranchesCount = state.companies.reduce((acc, c) => acc + (c.branches?.length || 0), 0);

  return `<div class="login-screen">
    <section class="login-rail">
      <div class="login-brand">
        <div class="brand-mark">
          <i></i><i></i><i></i>
        </div>
        <div class="brand-copy">
          <strong>Logic Control</strong>
          <small>Consola Corporativa · v2.4</small>
        </div>
      </div>

      <div class="login-product">
        <div class="login-overline">
          ${icon('shieldCheck', 14)}
          Gobierno Multi-Empresa y Google Workspace SSO
        </div>
        <h1>Administración centralizada de organizaciones, sedes y accesos.</h1>
        <p>
          Gestioná el padrón de empresas clientes, habilitá sucursales operativas,
          asigná roles por depósito y auditá las cuentas vinculadas con Google Workspace.
        </p>

        <div class="login-metrics-strip">
          <div>
            <strong class="tabular">${formatNumber(state.companies.length)} empresas</strong>
            <span>Organizaciones activas</span>
          </div>
          <div>
            <strong class="tabular">${formatNumber(totalUsersCount)} usuarios</strong>
            <span>Habilitados con SSO</span>
          </div>
          <div>
            <strong class="tabular">${formatNumber(totalBranchesCount)} sedes</strong>
            <span>Plantas y depósitos</span>
          </div>
        </div>

        <div class="login-illustration" aria-hidden="true">
          <div class="login-illustration-grid"></div>
          <div class="login-box box-a"><i></i><i></i></div>
          <div class="login-box box-b"><i></i><i></i></div>
          <div class="login-box box-c"><i></i><i></i></div>
          <div class="illustration-label label-a">
            <span class="live-dot"></span>
            Directorio OAuth 2.0 sincronizado
          </div>
          <div class="illustration-label label-b">
            ${icon('building2', 12)}
            Control Multi-Tenant en vivo
          </div>
        </div>
      </div>

      <div class="login-rail-footer">
        Consola conectada en tiempo real con el
        <a href="./index.html" style="color: var(--blue); font-weight: 700; text-decoration: none;">
          Sistema Operativo de Inventarios →
        </a>
      </div>
    </section>

    <main class="login-main">
      <div class="login-top-bar">
        <button
          type="button"
          class="login-theme-toggle"
          data-action="toggle-theme"
        >
          ${icon(state.theme === 'dark' ? 'sun' : 'moon', 14)}
          <span>${state.theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}</span>
        </button>
      </div>

      <form class="login-card login-form" id="admin-login-form" novalidate>
        <div class="login-heading">
          <div class="login-lock">${icon('shieldCheck', 18)}</div>
          <h2>Consola Administrativa</h2>
          <p>Autenticate con tu cuenta de Google Workspace o con tus credenciales de administrador.</p>
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
              <small>Seleccionar cuenta corporativa autorizada</small>
            </span>
            <span class="google-badge">OAuth 2.0</span>
          </button>

          ${googlePickerHtml}
        </div>

        <div class="login-divider"><span></span>o ingresá con correo administrativo<span></span></div>

        <label class="login-field" for="admin-login-email">
          Correo corporativo
          <div>
            ${icon('mail', 15)}
            <input
              id="admin-login-email"
              name="email"
              type="email"
              value="${escapeHtml(state.loginEmail)}"
              placeholder="admin@logiccontrol.com.ar"
              autocomplete="username"
              required
            />
          </div>
        </label>

        <label class="login-field" for="admin-login-password">
          Contraseña administrativa
          <div>
            ${icon('lockKeyhole', 15)}
            <input
              id="admin-login-password"
              name="password"
              type="password"
              value="${escapeHtml(state.loginPassword)}"
              placeholder="Ingresá tu clave (mín. 4 caracteres)"
              autocomplete="current-password"
              required
            />
          </div>
        </label>

        ${state.loginError ? `<div class="login-error" role="alert">${escapeHtml(state.loginError)}</div>` : ''}

        <div class="login-options">
          <label>
            <input type="checkbox" name="remember" checked />
            Mantener sesión activa
          </label>
          <a href="./index.html" class="text-button">Ir a App Inventarios</a>
        </div>

        <button type="submit" class="button button-primary login-submit">
          Ingresar a la Consola Central
          ${icon('arrowRight', 16)}
        </button>

        <div class="login-demo-note">
          <span>${icon('lockKeyhole', 13)} TLS 1.3</span>
          <span>·</span>
          <span>${icon('fingerprint', 13)} Sincronizado con Comercial Norte SRL</span>
        </div>
      </form>
    </main>
  </div>`;
}

/* ==========================================================================
   2. SIDEBAR Y HEADER DEL PANEL ADMINISTRATIVO (Alineados con Sidebar.js y Header.js)
   ========================================================================== */
function renderAdminSidebar() {
  const totalCompanies = state.companies.length;
  const totalUsers = state.companies.reduce((acc, c) => acc + (c.users?.length || 0), 0);
  const googleUsers = state.companies.reduce(
    (acc, c) => acc + (c.users ? c.users.filter((u) => u.googleLinked !== false).length : 0),
    0
  );

  const navItems = [
    {
      id: 'companies',
      label: 'Empresas y Usuarios',
      iconName: 'building2',
      badge: `${totalCompanies} emp.`,
      badgeTone: 'accent',
    },
    {
      id: 'register-company',
      label: 'Registrar Empresa',
      iconName: 'plus',
    },
    {
      id: 'google-directory',
      label: 'Directorio Google SSO',
      iconName: 'users',
      badge: String(googleUsers),
      badgeTone: 'neutral',
    },
    {
      id: 'audit-log',
      label: 'Bitácora de Auditoría',
      iconName: 'history',
      badge: String(state.auditLogs.length),
      badgeTone: 'neutral',
    },
  ];

  const navHtml = navItems
    .map((item) => {
      const active = state.activeTab === item.id;
      return `<button
        type="button"
        class="nav-item ${active ? 'active' : ''}"
        data-action="switch-tab"
        data-tab="${item.id}"
        aria-current="${active ? 'page' : 'false'}"
        title="${escapeHtml(item.label)}"
      >
        ${icon(item.iconName, 18)}
        <span>${escapeHtml(item.label)}</span>
        ${
          item.badge
            ? `<span class="nav-badge ${item.badgeTone ? `tone-${item.badgeTone}` : ''}">${escapeHtml(item.badge)}</span>`
            : ''
        }
      </button>`;
    })
    .join('');

  return `<aside class="sidebar" aria-label="Navegación administrativa">
    <div class="sidebar-brand">
      <div class="brand-mark" aria-hidden="true">LC</div>
      <div class="brand-text">
        <div class="brand-name">Logic Control</div>
        <div class="brand-sub">Consola Multi-Empresa</div>
      </div>
    </div>

    <div class="sidebar-quick-stats">
      <div class="quick-stat-pill">
        <span class="quick-stat-dot"></span>
        <span>${totalCompanies} empresas</span>
      </div>
      <div class="quick-stat-pill">
        <span class="quick-stat-dot"></span>
        <span>${totalUsers} operadores</span>
      </div>
    </div>

    <nav class="sidebar-nav">
      <div class="nav-group-label">Gobierno Corporativo</div>
      ${navHtml}

      <div class="nav-group-label">Plataforma</div>
      <a
        href="./index.html"
        class="nav-item"
        style="text-decoration: none;"
        title="Abrir Sistema de Inventarios"
      >
        ${icon('boxes', 18)}
        <span>Ir a App Inventarios</span>
        ${icon('externalLink', 14)}
      </a>
    </nav>

    <div class="sidebar-footer">
      <div class="user-card">
        <div class="user-avatar" aria-hidden="true">${escapeHtml(state.currentUser.avatar || buildInitials(state.currentUser.name))}</div>
        <div class="user-info">
          <div class="user-name">${escapeHtml(state.currentUser.name)}</div>
          <div class="user-role">
            ${icon('shieldCheck', 12)}
            ${escapeHtml(state.currentUser.role)}
          </div>
        </div>
        <button
          type="button"
          class="icon-btn"
          title="Cerrar sesión administrativa"
          aria-label="Cerrar sesión administrativa"
          data-action="logout"
        >
          ${icon('logOut', 16)}
        </button>
      </div>
    </div>
  </aside>`;
}

function renderAdminTopbar() {
  const tabTitles = {
    companies: 'Empresas y Usuarios por Organización',
    'register-company': 'Alta de Nueva Empresa (Tenant)',
    'google-directory': 'Directorio Global Google Workspace SSO',
    'audit-log': 'Bitácora de Auditoría y Seguridad',
  };

  const selectedCompany = getSelectedCompany();

  const conn = state.apiConnection || { backendOnline: false, supabaseOnline: false };
  let statusClass = 'status-local';
  let statusText = 'Modo Local';
  let statusTitle = 'Operando localmente. Clic para verificar conexión con Backend :4000 y Supabase';

  if (conn.backendOnline) {
    statusClass = 'status-backend';
    statusText = `API :4000 · ${conn.backendLatency || 12}ms`;
    statusTitle = `Conectado a http://localhost:4000 (${conn.backendLatency}ms)`;
  } else if (conn.supabaseOnline) {
    statusClass = 'status-supabase';
    statusText = `Supabase Cloud · ${conn.supabaseLatency || 45}ms`;
    statusTitle = `Conectado a Supabase PostgreSQL (${conn.supabaseLatency}ms)`;
  }

  return `<header class="topbar">
    <div class="breadcrumbs">
      <span class="admin-console-pill">
        <span class="pulse-dot"></span>
        <span>Admin Console</span>
      </span>
      <span class="breadcrumb-sep">/</span>
      <span class="breadcrumb-current">${escapeHtml(tabTitles[state.activeTab] || 'Empresas')}</span>
      ${
        state.activeTab === 'companies' && selectedCompany
          ? `<span class="breadcrumb-sep">·</span>
             <span class="badge badge-info badge-no-dot">${escapeHtml(selectedCompany.name)}</span>`
          : ''
      }
    </div>

    <div class="topbar-actions">
      <!-- Indicador de Endpoints en Admin Console -->
      <button
        type="button"
        class="api-status-pill ${statusClass}"
        data-action="check-endpoints"
        title="${escapeHtml(statusTitle)}"
        aria-label="Estado de conexión del sistema"
      >
        <span class="api-status-dot"></span>
        <span class="api-status-label">${escapeHtml(statusText)}</span>
      </button>

      <button
        type="button"
        class="icon-btn"
        aria-label="Cambiar entre modo claro y oscuro"
        title="${state.theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}"
        data-action="toggle-theme"
      >
        ${icon(state.theme === 'dark' ? 'sun' : 'moon', 18)}
      </button>

      <a
        href="./index.html"
        class="btn btn-secondary"
        style="text-decoration: none;"
        title="Abrir aplicación principal de inventarios"
      >
        ${icon('boxes', 15)}
        <span>Abrir Inventarios</span>
      </a>

      <button
        type="button"
        class="btn btn-primary"
        data-action="open-company-modal"
      >
        ${icon('plus', 15)}
        <span>Nueva empresa</span>
      </button>

      <div class="topbar-user-pill">
        <div class="topbar-user-avatar">${escapeHtml(state.currentUser.avatar || buildInitials(state.currentUser.name))}</div>
        <div class="topbar-user-meta">
          <strong>${escapeHtml(state.currentUser.name)}</strong>
          <span>${escapeHtml(state.currentUser.email)}</span>
        </div>
      </div>
    </div>
  </header>`;
}

function renderFeedbackBanner() {
  if (!state.feedback) return '';
  const tone = state.feedback.type || 'info';
  return `<div class="admin-feedback-banner tone-${escapeHtml(tone)}" role="status">
    <div class="admin-feedback-copy">
      ${icon(tone === 'danger' ? 'triangleAlert' : 'checkCircle2', 17)}
      <div>
        <strong>${tone === 'danger' ? 'Atención:' : 'Actualización aplicada:'}</strong>
        <span>${escapeHtml(state.feedback.message)}</span>
      </div>
    </div>
    <button
      type="button"
      class="icon-btn"
      data-action="dismiss-feedback"
      aria-label="Cerrar notificación"
    >
      ${icon('x', 15)}
    </button>
  </div>`;
}

function renderKpiSummary() {
  const totalCompanies = state.companies.length;
  const activeCompanies = state.companies.filter((c) => c.status === 'Activa').length;
  const totalUsers = state.companies.reduce((acc, c) => acc + (c.users ? c.users.length : 0), 0);
  const activeUsers = state.companies.reduce(
    (acc, c) => acc + (c.users ? c.users.filter((u) => u.status === 'Activo').length : 0),
    0
  );
  const googleUsers = state.companies.reduce(
    (acc, c) => acc + (c.users ? c.users.filter((u) => u.googleLinked !== false).length : 0),
    0
  );
  const ssoAdoptionPct = totalUsers > 0 ? Math.round((googleUsers / totalUsers) * 100) : 100;
  const totalBranches = state.companies.reduce(
    (acc, c) => acc + (c.branches ? c.branches.length : 0),
    0
  );

  return `<div class="kpi-grid">
    ${renderKpiCard({
      label: 'Empresas registradas (Tenants)',
      value: `${formatNumber(totalCompanies)} organizaciones`,
      delta: `${formatNumber(activeCompanies)} activas`,
      deltaTone: 'up',
      footnote: 'entornos corporativos aislados',
      iconHtml: icon('building2', 18),
      tone: 'blue',
    })}
    ${renderKpiCard({
      label: 'Nómina total de operadores',
      value: `${formatNumber(totalUsers)} usuarios`,
      delta: `${formatNumber(activeUsers)} habilitados`,
      deltaTone: 'up',
      footnote: 'con permisos asignados por sede',
      iconHtml: icon('users', 18),
      tone: 'green',
    })}
    ${renderKpiCard({
      label: 'Cuentas Google Workspace SSO',
      value: `${formatNumber(googleUsers)} vinculadas`,
      delta: `${ssoAdoptionPct}% adopción`,
      deltaTone: 'up',
      footnote: 'autenticación federada OAuth 2.0',
      iconHtml: icon('googleLogo', 18),
      tone: 'blue',
    })}
    ${renderKpiCard({
      label: 'Sedes y plantas operativas',
      value: `${formatNumber(totalBranches)} sucursales`,
      delta: 'Multi-Depósito',
      deltaTone: 'up',
      footnote: 'sincronizadas con catálogo central',
      iconHtml: icon('boxes', 18),
      tone: 'amber',
    })}
  </div>`;
}

/* ==========================================================================
   3. VISTA PRINCIPAL: MASTER-DETAIL DE EMPRESAS Y SUS USUARIOS
   ========================================================================== */
function renderCompaniesMasterDetailView() {
  const searchQuery = state.companySearch.trim().toLowerCase();
  const filteredCompanies = state.companies.filter((company) => {
    const matchesSearch =
      !searchQuery ||
      company.name.toLowerCase().includes(searchQuery) ||
      company.cuit.toLowerCase().includes(searchQuery) ||
      company.domain.toLowerCase().includes(searchQuery) ||
      company.industry.toLowerCase().includes(searchQuery);
    const matchesStatus =
      state.companyStatusFilter === 'ALL' || company.status === state.companyStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const selectedCompany = getSelectedCompany();

  return `<div class="admin-master-detail">
    <!-- Columna Izquierda: Directorio de Empresas -->
    <aside class="panel tenant-directory-panel" aria-label="Directorio de empresas registradas">
      <div class="panel-header">
        <div>
          <div class="panel-title">Directorio Corporativo</div>
          <div class="panel-subtitle">Seleccioná una organización para gestionar su personal</div>
        </div>
        <button
          type="button"
          class="btn btn-primary btn-sm"
          data-action="open-company-modal"
        >
          ${icon('plus', 14)}
          <span>Alta</span>
        </button>
      </div>

      <div class="tenant-directory-search">
        <div class="tenant-search-input-wrap">
          ${icon('search', 15)}
          <input
            type="search"
            id="company-search-input"
            placeholder="Buscar por razón social, CUIT o dominio..."
            value="${escapeHtml(state.companySearch)}"
          />
        </div>
        <div class="tenant-status-pills" role="tablist" aria-label="Filtrar empresas por estado">
          ${[
            { key: 'ALL', label: `Todas (${state.companies.length})` },
            {
              key: 'Activa',
              label: `Activas (${state.companies.filter((c) => c.status === 'Activa').length})`,
            },
            {
              key: 'Suspendida',
              label: `Suspendidas (${state.companies.filter((c) => c.status === 'Suspendida').length})`,
            },
          ]
            .map(
              (f) => `<button
                type="button"
                class="tenant-filter-chip ${state.companyStatusFilter === f.key ? 'active' : ''}"
                data-action="set-company-status-filter"
                data-status="${f.key}"
              >
                ${escapeHtml(f.label)}
              </button>`
            )
            .join('')}
        </div>
      </div>

      <div class="tenant-cards-list">
        ${
          filteredCompanies.length > 0
            ? filteredCompanies
                .map((company) => {
                  const isSelected = selectedCompany && selectedCompany.id === company.id;
                  const totalUsers = company.users ? company.users.length : 0;
                  const activeUsers = company.users
                    ? company.users.filter((u) => u.status === 'Activo').length
                    : 0;
                  const badgeTone =
                    company.status === 'Activa'
                      ? 'badge-success'
                      : company.status === 'Suspendida'
                      ? 'badge-danger'
                      : 'badge-warning';

                  return `<button
                    type="button"
                    class="tenant-card-item ${isSelected ? 'is-selected' : ''}"
                    data-action="select-company"
                    data-company-id="${escapeHtml(company.id)}"
                  >
                    <div class="tenant-card-top">
                      <div class="tenant-card-identity">
                        <div class="tenant-avatar">${escapeHtml(buildInitials(company.name))}</div>
                        <div class="tenant-card-heading">
                          <strong>${escapeHtml(company.name)}</strong>
                          <span>CUIT ${escapeHtml(company.cuit)} · @${escapeHtml(company.domain)}</span>
                        </div>
                      </div>
                      <span class="badge ${badgeTone}">${escapeHtml(company.status)}</span>
                    </div>

                    <div class="tenant-card-foot">
                      <span>${escapeHtml(company.branches?.length || 1)} sedes · ${escapeHtml(company.plan)}</span>
                      <span class="tenant-card-metrics tabular">
                        ${activeUsers}/${totalUsers} <small>activos</small>
                      </span>
                    </div>
                  </button>`;
                })
                .join('')
            : `<div class="empty-state">
                <div class="empty-title">Sin coincidencias</div>
                <p class="empty-desc">No se encontraron empresas con ese filtro.</p>
              </div>`
        }
      </div>
    </aside>

    <!-- Columna Derecha: Consola de la Empresa Seleccionada -->
    <div class="tenant-workspace-col">
      ${
        selectedCompany
          ? renderSelectedCompanyWorkspace(selectedCompany)
          : `<div class="panel empty-state">
              <div class="empty-title">Seleccioná o registrá una empresa</div>
              <p class="empty-desc">Elegí una organización del panel izquierdo para gestionar sus usuarios, sucursales y políticas de Google Workspace.</p>
            </div>`
      }
    </div>
  </div>`;
}

function renderSelectedCompanyWorkspace(company) {
  const users = Array.isArray(company.users) ? company.users : [];
  const branches =
    Array.isArray(company.branches) && company.branches.length > 0
      ? company.branches
      : ['Casa Central'];
  const activeUsersCount = users.filter((u) => u.status === 'Activo').length;
  const googleUsersCount = users.filter((u) => u.googleLinked !== false).length;

  const quota = planQuotaLimits[company.plan] || planQuotaLimits['Enterprise Multi-Sede'];
  const userQuotaPct = Math.min(100, Math.round((users.length / quota.maxUsers) * 100));
  const branchQuotaPct = Math.min(100, Math.round((branches.length / quota.maxBranches) * 100));
  const googleAdoptionPct =
    users.length > 0 ? Math.round((googleUsersCount / users.length) * 100) : 100;

  const statusBadgeClass =
    company.status === 'Activa'
      ? 'badge-success'
      : company.status === 'Suspendida'
      ? 'badge-danger'
      : 'badge-warning';

  return `
    <!-- Cabecera Ejecutiva de la Organización -->
    <section class="panel tenant-hero-panel">
      <div class="tenant-hero-top">
        <div class="tenant-hero-identity">
          <div class="tenant-hero-avatar">${escapeHtml(buildInitials(company.name))}</div>
          <div>
            <div class="tenant-hero-title-row">
              <h2>${escapeHtml(company.name)}</h2>
              <span class="badge ${statusBadgeClass}">${escapeHtml(company.status)}</span>
              <span class="badge badge-info badge-no-dot">${escapeHtml(company.plan)}</span>
              ${
                company.id === 'EMP-01'
                  ? `<span class="badge badge-success badge-no-dot" title="Los cambios de personal en esta empresa impactan en vivo en index.html">Sincronizada con App Principal</span>`
                  : ''
              }
            </div>
            <div class="tenant-hero-meta-row">
              <span class="tenant-hero-meta-item">
                <strong>ID:</strong> <span class="mono-code">${escapeHtml(company.id)}</span>
              </span>
              <span class="tenant-hero-meta-item">
                <strong>CUIT:</strong> <span class="mono-code">${escapeHtml(company.cuit)}</span>
              </span>
              <span class="tenant-hero-meta-item">
                <strong>Dominio Workspace:</strong> <span class="mono-code">@${escapeHtml(company.domain)}</span>
              </span>
              <span class="tenant-hero-meta-item">
                <strong>Ubicación:</strong> ${escapeHtml(company.city)}
              </span>
            </div>
          </div>
        </div>

        <div class="tenant-hero-actions">
          <button
            type="button"
            class="btn btn-secondary btn-sm"
            data-action="impersonate-company"
            data-company-id="${escapeHtml(company.id)}"
            title="Iniciar sesión en el Sistema de Inventarios operando en esta empresa"
          >
            ${icon('externalLink', 14)}
            <span>Abrir en Inventarios</span>
          </button>
          <button
            type="button"
            class="btn btn-secondary btn-sm"
            data-action="edit-company"
            data-company-id="${escapeHtml(company.id)}"
          >
            ${icon('settings', 14)}
            <span>Editar datos</span>
          </button>
          <button
            type="button"
            class="btn btn-sm ${company.status === 'Activa' ? 'btn-danger-outline' : 'btn-success-outline'}"
            data-action="toggle-company-status"
            data-company-id="${escapeHtml(company.id)}"
          >
            <span>${company.status === 'Activa' ? 'Suspender acceso' : 'Reactivar empresa'}</span>
          </button>
          <button
            type="button"
            class="icon-btn danger"
            data-action="delete-company"
            data-company-id="${escapeHtml(company.id)}"
            title="Eliminar empresa del padrón"
            aria-label="Eliminar empresa"
          >
            ${icon('trash2', 15)}
          </button>
        </div>
      </div>

      <!-- Indicadores y Cuotas de la Organización -->
      <div class="tenant-vitals-grid">
        <div class="tenant-vital-card">
          <div class="tenant-vital-label">
            <span>Rubro y Contacto</span>
          </div>
          <div class="tenant-vital-value" title="${escapeHtml(company.industry)}">${escapeHtml(company.industry)}</div>
          <div class="tenant-vital-sub">${escapeHtml(company.phone)} · ${escapeHtml(company.address)}</div>
        </div>

        <div class="tenant-vital-card">
          <div class="tenant-vital-label">
            <span>Licencias de Usuario</span>
            <span class="tabular">${users.length} / ${quota.maxUsers}</span>
          </div>
          <div class="tenant-vital-value tabular">${activeUsersCount} operadores activos</div>
          <div class="quota-mini-track">
            <div class="quota-mini-fill ${userQuotaPct > 85 ? 'tone-amber' : ''}" style="width: ${userQuotaPct}%;"></div>
          </div>
        </div>

        <div class="tenant-vital-card">
          <div class="tenant-vital-label">
            <span>Sedes Operativas</span>
            <span class="tabular">${branches.length} / ${quota.maxBranches}</span>
          </div>
          <div class="tenant-vital-value tabular">${branches.length} plantas habilitadas</div>
          <div class="quota-mini-track">
            <div class="quota-mini-fill tone-green" style="width: ${branchQuotaPct}%;"></div>
          </div>
        </div>

        <div class="tenant-vital-card">
          <div class="tenant-vital-label">
            <span>Federación Google SSO</span>
            <span class="tabular">${googleAdoptionPct}%</span>
          </div>
          <div class="tenant-vital-value tabular">${googleUsersCount} de ${users.length} con Google</div>
          <div class="quota-mini-track">
            <div class="quota-mini-fill" style="width: ${googleAdoptionPct}%;"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Sub-navegación de la Empresa Seleccionada -->
    <div class="workspace-subnav-bar">
      <div class="workspace-subtabs" role="tablist" aria-label="Secciones de la empresa">
        <button
          type="button"
          class="workspace-subtab-btn ${state.companySubTab === 'users' ? 'active' : ''}"
          data-action="set-company-subtab"
          data-subtab="users"
        >
          ${icon('users', 15)}
          <span>Nómina de Usuarios</span>
          <span class="workspace-subtab-count tabular">${users.length}</span>
        </button>

        <button
          type="button"
          class="workspace-subtab-btn ${state.companySubTab === 'branches' ? 'active' : ''}"
          data-action="set-company-subtab"
          data-subtab="branches"
        >
          ${icon('building2', 15)}
          <span>Sedes y Sucursales</span>
          <span class="workspace-subtab-count tabular">${branches.length}</span>
        </button>

        <button
          type="button"
          class="workspace-subtab-btn ${state.companySubTab === 'security' ? 'active' : ''}"
          data-action="set-company-subtab"
          data-subtab="security"
        >
          ${icon('shieldCheck', 15)}
          <span>Políticas Google SSO y Permisos</span>
        </button>
      </div>

      <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
        <button
          type="button"
          class="btn btn-secondary btn-sm"
          data-action="open-bulk-users-modal"
          data-company-id="${escapeHtml(company.id)}"
        >
          ${icon('upload', 14)}
          <span>Alta masiva por lote</span>
        </button>
        <button
          type="button"
          class="btn btn-secondary btn-sm"
          data-action="export-company-users-csv"
          data-company-id="${escapeHtml(company.id)}"
        >
          ${icon('download', 14)}
          <span>Exportar CSV</span>
        </button>
        <button
          type="button"
          class="btn btn-primary btn-sm"
          data-action="toggle-add-user-drawer"
        >
          ${icon('userPlus', 14)}
          <span>${state.showAddUserForm ? 'Ocultar formulario' : 'Agregar usuario'}</span>
        </button>
      </div>
    </div>

    ${
      state.companySubTab === 'users'
        ? renderCompanyUsersSubView(company, users, branches)
        : state.companySubTab === 'branches'
        ? renderCompanyBranchesSubView(company, users, branches)
        : renderCompanySecuritySubView(company)
    }
  `;
}

function renderCompanyUsersSubView(company, users, branches) {
  const userQuery = state.userSearch.trim().toLowerCase();
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      !userQuery ||
      u.name.toLowerCase().includes(userQuery) ||
      u.email.toLowerCase().includes(userQuery) ||
      (u.branch && u.branch.toLowerCase().includes(userQuery));
    const matchesRole = state.userRoleFilter === 'ALL' || u.role === state.userRoleFilter;
    const matchesBranch = state.userBranchFilter === 'ALL' || u.branch === state.userBranchFilter;
    return matchesSearch && matchesRole && matchesBranch;
  });

  const addUserDrawerHtml = state.showAddUserForm
    ? `<form class="user-provision-drawer" id="add-company-user-form" data-company-id="${escapeHtml(company.id)}">
        <div class="user-provision-head">
          <div>
            <strong>Dar de alta nuevo operador en ${escapeHtml(company.name)}</strong>
            <small>
              ${
                company.ssoPolicy?.restrictToCorporateDomain
                  ? `Política activa: solo se admiten correos corporativos @${escapeHtml(company.domain)}`
                  : `Admite cuentas corporativas @${escapeHtml(company.domain)} o cuentas Google externas (@gmail.com)`
              }
            </small>
          </div>
          <span class="badge badge-info badge-no-dot">Aprovisionamiento inmediato</span>
        </div>

        <div class="form-grid-4">
          <div class="field">
            <label for="new-user-name">Nombre y Apellido *</label>
            <input
              id="new-user-name"
              class="input"
              type="text"
              name="name"
              placeholder="Ej. Valentina Gómez"
              required
            />
          </div>

          <div class="field">
            <label for="new-user-email">Correo Google / Corporativo *</label>
            <input
              id="new-user-email"
              class="input"
              type="email"
              name="email"
              placeholder="vgomez@${escapeHtml(company.domain)}"
              required
            />
          </div>

          <div class="field">
            <label for="new-user-role">Rol operativo</label>
            <select id="new-user-role" class="select" name="role">
              ${AVAILABLE_ROLES.map(
                (role) => `<option value="${escapeHtml(role)}">${escapeHtml(role)}</option>`
              ).join('')}
            </select>
          </div>

          <div class="field">
            <label for="new-user-branch">Sede asignada</label>
            <select id="new-user-branch" class="select" name="branch">
              ${branches
                .map((b) => `<option value="${escapeHtml(b)}">${escapeHtml(b)}</option>`)
                .join('')}
            </select>
          </div>
        </div>

        <div class="sso-toggle-banner">
          <div class="sso-toggle-info">
            ${icon('googleLogo', 18)}
            <div>
              <strong>Vincular con Google Workspace SSO (OAuth 2.0)</strong>
              <span>Habilita el acceso directo con un clic desde el selector de cuentas de Google en el login.</span>
            </div>
          </div>
          <label class="checkbox-inline">
            <input
              type="checkbox"
              name="googleLinked"
              checked
              ${company.ssoPolicy?.enforceGoogleSso ? 'disabled' : ''}
            />
            <span>${company.ssoPolicy?.enforceGoogleSso ? 'Obligatorio por política de empresa' : 'Cuenta Google vinculada'}</span>
          </label>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 8px;">
          <button
            type="button"
            class="btn btn-secondary btn-sm"
            data-action="toggle-add-user-drawer"
          >
            Cancelar
          </button>
          <button type="submit" class="btn btn-primary btn-sm">
            ${icon('check', 14)}
            <span>Habilitar usuario en ${escapeHtml(company.name)}</span>
          </button>
        </div>
      </form>`
    : '';

  return `<section class="panel">
    <div class="panel-header">
      <div>
        <div class="panel-title">Nómina de Usuarios — ${escapeHtml(company.name)}</div>
        <div class="panel-subtitle">
          Mostrando ${filteredUsers.length} de ${users.length} operadores registrados · Cambiá el rol o la sede directamente en cada fila
        </div>
      </div>
      ${
        state.userBranchFilter !== 'ALL' || state.userRoleFilter !== 'ALL' || state.userSearch
          ? `<button
              type="button"
              class="btn btn-ghost btn-sm"
              data-action="reset-user-filters"
            >
              Limpiar filtros
            </button>`
          : ''
      }
    </div>

    ${addUserDrawerHtml}

    <div class="toolbar">
      <div class="toolbar-left">
        <div class="table-search">
          ${icon('search', 15)}
          <input
            type="search"
            id="company-user-search"
            placeholder="Filtrar por nombre, correo o sede..."
            value="${escapeHtml(state.userSearch)}"
          />
        </div>

        <select
          id="company-user-branch-filter"
          class="select"
          aria-label="Filtrar usuarios por sede"
        >
          <option value="ALL" ${state.userBranchFilter === 'ALL' ? 'selected' : ''}>Todas las sedes (${branches.length})</option>
          ${branches
            .map(
              (b) =>
                `<option value="${escapeHtml(b)}" ${state.userBranchFilter === b ? 'selected' : ''}>Sede: ${escapeHtml(b)}</option>`
            )
            .join('')}
        </select>

        <select
          id="company-user-role-filter"
          class="select"
          aria-label="Filtrar usuarios por rol"
        >
          <option value="ALL" ${state.userRoleFilter === 'ALL' ? 'selected' : ''}>Todos los roles</option>
          ${AVAILABLE_ROLES.map(
            (role) =>
              `<option value="${escapeHtml(role)}" ${state.userRoleFilter === role ? 'selected' : ''}>${escapeHtml(role)}</option>`
          ).join('')}
        </select>
      </div>

      <div class="toolbar-right">
        <span style="font-size: 12px; color: var(--text-secondary);">
          Dominio corporativo: <strong class="mono-code">@${escapeHtml(company.domain)}</strong>
        </span>
      </div>
    </div>

    <div class="table-scroll">
      <table class="data-table">
        <thead>
          <tr>
            <th>Operador</th>
            <th>Rol Operativo</th>
            <th>Sede Asignada</th>
            <th>Autenticación</th>
            <th>Estado</th>
            <th style="text-align: right;">Acciones</th>
          </tr>
        </thead>
        <tbody>
          ${
            filteredUsers.length > 0
              ? filteredUsers
                  .map((user) => {
                    const isActive = user.status === 'Activo';
                    return `<tr>
                      <td>
                        <div class="user-cell-identity">
                          <span class="user-mini-avatar ${isActive ? '' : 'is-inactive'}">
                            ${escapeHtml(buildInitials(user.name))}
                          </span>
                          <div class="user-cell-copy">
                            <strong>${escapeHtml(user.name)}</strong>
                            <small>${escapeHtml(user.email)} · ${escapeHtml(user.lastAccess || 'Reciente')}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <select
                          class="table-select-compact"
                          data-action="change-user-role"
                          data-company-id="${escapeHtml(company.id)}"
                          data-user-id="${escapeHtml(user.id)}"
                          aria-label="Cambiar rol de ${escapeHtml(user.name)}"
                        >
                          ${AVAILABLE_ROLES.map(
                            (role) =>
                              `<option value="${escapeHtml(role)}" ${user.role === role ? 'selected' : ''}>${escapeHtml(role)}</option>`
                          ).join('')}
                        </select>
                      </td>
                      <td>
                        <select
                          class="table-select-compact"
                          data-action="change-user-branch"
                          data-company-id="${escapeHtml(company.id)}"
                          data-user-id="${escapeHtml(user.id)}"
                          aria-label="Cambiar sede de ${escapeHtml(user.name)}"
                        >
                          ${branches
                            .map(
                              (branch) =>
                                `<option value="${escapeHtml(branch)}" ${user.branch === branch ? 'selected' : ''}>${escapeHtml(branch)}</option>`
                            )
                            .join('')}
                        </select>
                      </td>
                      <td>
                        <button
                          type="button"
                          class="auth-method-pill ${user.googleLinked !== false ? 'is-google' : 'is-password'}"
                          data-action="toggle-user-google"
                          data-company-id="${escapeHtml(company.id)}"
                          data-user-id="${escapeHtml(user.id)}"
                          title="Clic para alternar vinculación con Google Workspace SSO"
                        >
                          ${user.googleLinked !== false ? icon('googleLogo', 13) : icon('keyRound', 13)}
                          <span>${user.googleLinked !== false ? 'Google SSO' : 'Clave interna'}</span>
                        </button>
                      </td>
                      <td>
                        <span class="badge ${isActive ? 'badge-success' : 'badge-danger'}">
                          ${isActive ? 'Habilitado' : 'Inhabilitado'}
                        </span>
                      </td>
                      <td style="text-align: right;">
                        <div class="row-actions-group">
                          <button
                            type="button"
                            class="btn btn-secondary btn-sm"
                            data-action="impersonate-user"
                            data-company-id="${escapeHtml(company.id)}"
                            data-user-id="${escapeHtml(user.id)}"
                            title="Abrir el Sistema de Inventarios con la sesión de este operador"
                            ${isActive ? '' : 'disabled'}
                          >
                            ${icon('externalLink', 13)}
                            <span>Simular</span>
                          </button>
                          <button
                            type="button"
                            class="btn btn-sm ${isActive ? 'btn-danger-outline' : 'btn-success-outline'}"
                            data-action="toggle-user-status"
                            data-company-id="${escapeHtml(company.id)}"
                            data-user-id="${escapeHtml(user.id)}"
                          >
                            ${isActive ? 'Inhabilitar' : 'Habilitar'}
                          </button>
                          <button
                            type="button"
                            class="icon-btn danger"
                            data-action="delete-user"
                            data-company-id="${escapeHtml(company.id)}"
                            data-user-id="${escapeHtml(user.id)}"
                            title="Eliminar usuario de la empresa"
                            aria-label="Eliminar usuario"
                          >
                            ${icon('trash2', 15)}
                          </button>
                        </div>
                      </td>
                    </tr>`;
                  })
                  .join('')
              : `<tr>
                  <td colspan="6">
                    <div class="empty-state">
                      <div class="empty-title">Sin usuarios en este filtro</div>
                      <p class="empty-desc">Probá limpiando los filtros o agregá un nuevo operador a ${escapeHtml(company.name)}.</p>
                    </div>
                  </td>
                </tr>`
          }
        </tbody>
      </table>
    </div>
  </section>`;
}

function renderCompanyBranchesSubView(company, users, branches) {
  return `<section class="panel">
    <div class="panel-header">
      <div>
        <div class="panel-title">Sedes y Sucursales Operativas — ${escapeHtml(company.name)}</div>
        <div class="panel-subtitle">
          Administrá las plantas, depósitos y mostradores donde operan los usuarios de esta organización
        </div>
      </div>

      <form
        id="add-branch-form"
        data-company-id="${escapeHtml(company.id)}"
        style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;"
      >
        <input
          type="text"
          name="branchName"
          class="input"
          style="width: 230px; min-height: 34px;"
          placeholder="Nueva sede (ej. Depósito Oeste)"
          required
        />
        <button type="submit" class="btn btn-primary btn-sm">
          ${icon('plus', 14)}
          <span>Agregar sede</span>
        </button>
      </form>
    </div>

    <div class="panel-body">
      <div class="branches-management-grid">
        ${branches
          .map((branch, idx) => {
            const assignedUsers = users.filter((u) => u.branch === branch);
            const activeInBranch = assignedUsers.filter((u) => u.status === 'Activo').length;
            return `<article class="branch-admin-card">
              <div>
                <div class="branch-admin-card-head">
                  <div>
                    <strong>${escapeHtml(branch)}</strong>
                    <small>${escapeHtml(company.city)} · Planta #0${idx + 1}</small>
                  </div>
                  <span class="badge badge-success">Operativa</span>
                </div>

                <div style="margin-top: 12px; display: flex; align-items: baseline; justify-content: space-between;">
                  <span style="font-size: 12px; color: var(--text-secondary);">Personal asignado</span>
                  <strong class="tabular" style="font-size: 14px;">${assignedUsers.length} operadores (${activeInBranch} activos)</strong>
                </div>
              </div>

              <div class="branch-admin-card-foot">
                <button
                  type="button"
                  class="text-button"
                  data-action="filter-users-by-branch"
                  data-branch="${escapeHtml(branch)}"
                >
                  <span>Ver operadores de esta sede</span>
                  ${icon('arrowRight', 13)}
                </button>
                ${
                  branches.length > 1
                    ? `<button
                        type="button"
                        class="icon-btn danger"
                        data-action="remove-branch"
                        data-company-id="${escapeHtml(company.id)}"
                        data-branch="${escapeHtml(branch)}"
                        title="Eliminar sede"
                      >
                        ${icon('trash2', 14)}
                      </button>`
                    : ''
                }
              </div>
            </article>`;
          })
          .join('')}
      </div>
    </div>
  </section>`;
}

function renderCompanySecuritySubView(company) {
  const policy = company.ssoPolicy || {
    enforceGoogleSso: true,
    restrictToCorporateDomain: false,
    allowBranchSwitching: true,
  };

  return `<div class="dashboard-split">
    <section class="panel">
      <div class="panel-header">
        <div>
          <div class="panel-title">Políticas de Identidad y Google Workspace SSO</div>
          <div class="panel-subtitle">Reglas de autenticación y dominio para ${escapeHtml(company.name)}</div>
        </div>
        <button
          type="button"
          class="btn btn-secondary btn-sm"
          data-action="verify-company-domain"
          data-company-id="${escapeHtml(company.id)}"
        >
          ${icon('checkCircle2', 14)}
          <span>Verificar DNS @${escapeHtml(company.domain)}</span>
        </button>
      </div>

      <div class="panel-body">
        <div class="security-policy-list">
          <div class="security-policy-item">
            <div>
              <strong>Forzar inicio de sesión con Google Workspace (OAuth 2.0)</strong>
              <p>Exige que todo nuevo usuario dado de alta en ${escapeHtml(company.name)} ingrese mediante federación de Google.</p>
            </div>
            <button
              type="button"
              class="switch ${policy.enforceGoogleSso ? 'switch-on' : ''}"
              data-action="toggle-sso-policy"
              data-company-id="${escapeHtml(company.id)}"
              data-policy-key="enforceGoogleSso"
              aria-pressed="${Boolean(policy.enforceGoogleSso)}"
            >
              <i></i>
            </button>
          </div>

          <div class="security-policy-item">
            <div>
              <strong>Restringir altas exclusivamente al dominio @${escapeHtml(company.domain)}</strong>
              <p>Bloquea el registro de correos externos (@gmail.com u otros dominios) dentro de esta empresa.</p>
            </div>
            <button
              type="button"
              class="switch ${policy.restrictToCorporateDomain ? 'switch-on' : ''}"
              data-action="toggle-sso-policy"
              data-company-id="${escapeHtml(company.id)}"
              data-policy-key="restrictToCorporateDomain"
              aria-pressed="${Boolean(policy.restrictToCorporateDomain)}"
            >
              <i></i>
            </button>
          </div>

          <div class="security-policy-item">
            <div>
              <strong>Permitir inspección multi-sede a supervisores</strong>
              <p>Habilita el selector superior de sucursales para consultar existencias entre depósitos de la organización.</p>
            </div>
            <button
              type="button"
              class="switch ${policy.allowBranchSwitching ? 'switch-on' : ''}"
              data-action="toggle-sso-policy"
              data-company-id="${escapeHtml(company.id)}"
              data-policy-key="allowBranchSwitching"
              aria-pressed="${Boolean(policy.allowBranchSwitching)}"
            >
              <i></i>
            </button>
          </div>
        </div>
      </div>
    </section>

    <section class="panel">
      <div class="panel-header">
        <div>
          <div class="panel-title">Matriz de Capacidades por Rol (RBAC)</div>
          <div class="panel-subtitle">Alcance operativo de cada perfil asignable a los usuarios</div>
        </div>
      </div>
      <div class="panel-body">
        <div class="rbac-cards-grid">
          ${roleCapabilitiesMatrix
            .map(
              (item) => `<div class="rbac-role-card">
                <div class="rbac-role-head">
                  <strong>${escapeHtml(item.role)}</strong>
                  <span class="mono-code" style="color: var(--text-tertiary);">${escapeHtml(item.code)}</span>
                </div>
                <p>${escapeHtml(item.summary)}</p>
                <div class="rbac-perm-pills">
                  ${item.permissions
                    .map((perm) => `<span class="rbac-perm-pill">${escapeHtml(perm)}</span>`)
                    .join('')}
                </div>
              </div>`
            )
            .join('')}
        </div>
      </div>
    </section>
  </div>`;
}

/* ==========================================================================
   4. PESTAÑA DEDICADA: REGISTRAR NUEVA EMPRESA
   ========================================================================== */
function renderRegisterCompanyTab() {
  return `<div class="register-company-layout">
    <section class="panel">
      <div class="panel-header">
        <div>
          <div class="panel-title">Registrar Nueva Organización (Tenant)</div>
          <div class="panel-subtitle">
            Configurá la razón social, el dominio de Google Workspace, las sucursales iniciales y su primer administrador
          </div>
        </div>
        <span class="badge badge-info badge-no-dot">Alta Multi-Sede</span>
      </div>

      <div class="panel-body">
        <form id="full-register-company-form" style="display: grid; gap: 18px;">
          <div class="form-grid">
            <div class="field">
              <label for="reg-name">Razón Social / Nombre de la Empresa *</label>
              <input
                id="reg-name"
                class="input"
                type="text"
                name="name"
                placeholder="Ej. Logística Austral S.A."
                required
              />
            </div>

            <div class="field">
              <label for="reg-cuit">CUIT / Identificación Tributaria *</label>
              <input
                id="reg-cuit"
                class="input"
                type="text"
                name="cuit"
                placeholder="Ej. 30-71558899-3"
                required
              />
            </div>

            <div class="field">
              <label for="reg-industry">Rubro / Actividad Principal *</label>
              <input
                id="reg-industry"
                class="input"
                type="text"
                name="industry"
                placeholder="Ej. Distribución Mayorista e Importación"
                required
              />
            </div>

            <div class="field">
              <label for="reg-domain">Dominio Corporativo (Google Workspace) *</label>
              <input
                id="reg-domain"
                class="input"
                type="text"
                name="domain"
                placeholder="Ej. logisticaaustral.com.ar"
                required
              />
            </div>

            <div class="field">
              <label for="reg-city">Ciudad / Provincia</label>
              <input
                id="reg-city"
                class="input"
                type="text"
                name="city"
                value="Buenos Aires, CABA"
              />
            </div>

            <div class="field">
              <label for="reg-address">Dirección Fiscal / Casa Central</label>
              <input
                id="reg-address"
                class="input"
                type="text"
                name="address"
                placeholder="Ej. Av. Paseo Colón 1450"
              />
            </div>

            <div class="field">
              <label for="reg-phone">Teléfono Corporativo</label>
              <input
                id="reg-phone"
                class="input"
                type="text"
                name="phone"
                placeholder="Ej. +54 11 5263-9000"
              />
            </div>

            <div class="field">
              <label for="reg-plan">Plan de Suscripción</label>
              <select id="reg-plan" class="select" name="plan">
                <option value="Enterprise Multi-Sede">Enterprise Multi-Sede (hasta 25 usuarios / 10 sedes)</option>
                <option value="Corporativo Pro">Corporativo Pro (hasta 12 usuarios / 5 sedes)</option>
                <option value="Corporate Start">Corporate Start (hasta 5 usuarios / 2 sedes)</option>
              </select>
            </div>
          </div>

          <div class="field">
            <label for="reg-branches">Sedes / Sucursales Iniciales (separadas por coma)</label>
            <input
              id="reg-branches"
              class="input"
              type="text"
              name="branches"
              value="Casa Central, Depósito Principal, Sucursal Norte"
            />
          </div>

          <div style="padding-top: 14px; border-top: 1px solid var(--border); display: grid; gap: 14px;">
            <div>
              <div class="panel-title">Primer Usuario Administrador (Google Workspace SSO)</div>
              <div class="panel-subtitle">Opcional: se creará automáticamente con rol de Administrador de Empresa en la sede principal</div>
            </div>

            <div class="form-grid">
              <div class="field">
                <label for="reg-admin-name">Nombre y Apellido del Administrador</label>
                <input
                  id="reg-admin-name"
                  class="input"
                  type="text"
                  name="adminName"
                  placeholder="Ej. Martín Echeverría"
                />
              </div>

              <div class="field">
                <label for="reg-admin-email">Correo Corporativo de Google</label>
                <input
                  id="reg-admin-email"
                  class="input"
                  type="email"
                  name="adminEmail"
                  placeholder="Ej. mecheverria@logisticaaustral.com.ar"
                />
              </div>
            </div>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 10px; padding-top: 6px;">
            <button
              type="button"
              class="btn btn-secondary"
              data-action="switch-tab"
              data-tab="companies"
            >
              Cancelar
            </button>
            <button type="submit" class="btn btn-primary">
              ${icon('check', 15)}
              <span>Registrar Empresa y Abrir Nómina</span>
            </button>
          </div>
        </form>
      </div>
    </section>

    <aside class="panel">
      <div class="panel-header">
        <div>
          <div class="panel-title">Arquitectura Multi-Tenant</div>
          <div class="panel-subtitle">Flujo de aprovisionamiento corporativo</div>
        </div>
      </div>
      <div class="panel-body">
        <div class="onboarding-steps-list">
          <div class="onboarding-step-card">
            <div class="onboarding-step-num">1</div>
            <div>
              <strong>Aislamiento de Organización y Sedes</strong>
              <p>Cada empresa cuenta con su propio padrón de sucursales operativas, CUIT y políticas de dominio.</p>
            </div>
          </div>
          <div class="onboarding-step-card">
            <div class="onboarding-step-num">2</div>
            <div>
              <strong>Asignación Granular de Operadores</strong>
              <p>Agregá usuarios individualmente o en lote asignándoles su depósito de trabajo y nivel de permiso.</p>
            </div>
          </div>
          <div class="onboarding-step-card">
            <div class="onboarding-step-num">3</div>
            <div>
              <strong>Federación Inmediata con Google SSO</strong>
              <p>Los usuarios con cuenta Google activa aparecen al instante en el selector OAuth 2.0 de inicio de sesión.</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  </div>`;
}

/* ==========================================================================
   5. PESTAÑA DEDICADA: DIRECTORIO GLOBAL DE CUENTAS GOOGLE SSO
   ========================================================================== */
function renderGoogleDirectoryTab() {
  const allRows = [];
  state.companies.forEach((company) => {
    (company.users || []).forEach((user) => {
      allRows.push({
        companyId: company.id,
        companyName: company.name,
        companyDomain: company.domain,
        companyStatus: company.status,
        ...user,
      });
    });
  });

  const q = state.directorySearch.trim().toLowerCase();
  const filteredRows = allRows.filter((row) => {
    const matchesSearch =
      !q ||
      row.name.toLowerCase().includes(q) ||
      row.email.toLowerCase().includes(q) ||
      row.companyName.toLowerCase().includes(q) ||
      row.role.toLowerCase().includes(q);
    const matchesAuth =
      state.directoryAuthFilter === 'ALL' ||
      (state.directoryAuthFilter === 'GOOGLE' && row.googleLinked !== false) ||
      (state.directoryAuthFilter === 'PASSWORD' && row.googleLinked === false);
    return matchesSearch && matchesAuth;
  });

  return `<section class="panel">
    <div class="panel-header">
      <div>
        <div class="panel-title">Directorio Global de Identidades (${filteredRows.length} de ${allRows.length})</div>
        <div class="panel-subtitle">
          Padrón consolidado de operadores en todas las empresas registradas y su estado de federación con Google Workspace
        </div>
      </div>
      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        <button
          type="button"
          class="btn btn-secondary btn-sm"
          data-action="export-global-directory-csv"
        >
          ${icon('download', 14)}
          <span>Exportar padrón CSV</span>
        </button>
        <button
          type="button"
          class="btn btn-primary btn-sm"
          data-action="switch-tab"
          data-tab="companies"
        >
          <span>Gestionar por empresa</span>
        </button>
      </div>
    </div>

    <div class="toolbar">
      <div class="toolbar-left">
        <div class="table-search">
          ${icon('search', 15)}
          <input
            type="search"
            id="directory-search-input"
            placeholder="Buscar usuario, correo o empresa..."
            value="${escapeHtml(state.directorySearch)}"
          />
        </div>

        <select
          id="directory-auth-filter"
          class="select"
          aria-label="Filtrar por método de autenticación"
        >
          <option value="ALL" ${state.directoryAuthFilter === 'ALL' ? 'selected' : ''}>Todos los métodos</option>
          <option value="GOOGLE" ${state.directoryAuthFilter === 'GOOGLE' ? 'selected' : ''}>Google Workspace SSO</option>
          <option value="PASSWORD" ${state.directoryAuthFilter === 'PASSWORD' ? 'selected' : ''}>Clave corporativa interna</option>
        </select>
      </div>
    </div>

    <div class="table-scroll">
      <table class="data-table">
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Organización (Tenant)</th>
            <th>Sede Asignada</th>
            <th>Rol Operativo</th>
            <th>Método de Acceso</th>
            <th>Estado</th>
            <th style="text-align: right;">Acciones</th>
          </tr>
        </thead>
        <tbody>
          ${
            filteredRows.length > 0
              ? filteredRows
                  .map(
                    (row) => `<tr>
                      <td>
                        <div class="user-cell-identity">
                          <span class="user-mini-avatar ${row.status === 'Activo' ? '' : 'is-inactive'}">
                            ${escapeHtml(buildInitials(row.name))}
                          </span>
                          <div class="user-cell-copy">
                            <strong>${escapeHtml(row.name)}</strong>
                            <small>${escapeHtml(row.email)}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <strong>${escapeHtml(row.companyName)}</strong>
                      </td>
                      <td>
                        <span class="branch-table-tag">${escapeHtml(row.branch || 'Casa Central')}</span>
                      </td>
                      <td>${escapeHtml(row.role)}</td>
                      <td>
                        <span class="auth-method-pill ${row.googleLinked !== false ? 'is-google' : 'is-password'}">
                          ${row.googleLinked !== false ? icon('googleLogo', 13) : icon('keyRound', 13)}
                          <span>${row.googleLinked !== false ? 'Google Workspace' : 'Clave interna'}</span>
                        </span>
                      </td>
                      <td>
                        <span class="badge ${row.status === 'Activo' ? 'badge-success' : 'badge-danger'}">
                          ${row.status === 'Activo' ? 'Habilitado' : 'Inhabilitado'}
                        </span>
                      </td>
                      <td style="text-align: right;">
                        <div class="row-actions-group">
                          <button
                            type="button"
                            class="btn btn-secondary btn-sm"
                            data-action="jump-to-company"
                            data-company-id="${escapeHtml(row.companyId)}"
                          >
                            <span>Abrir en empresa</span>
                          </button>
                        </div>
                      </td>
                    </tr>`
                  )
                  .join('')
              : `<tr>
                  <td colspan="7">
                    <div class="empty-state">
                      <div class="empty-title">Sin coincidencias</div>
                      <p class="empty-desc">No hay cuentas que coincidan con el criterio de búsqueda.</p>
                    </div>
                  </td>
                </tr>`
          }
        </tbody>
      </table>
    </div>
  </section>`;
}

/* ==========================================================================
   6. PESTAÑA DEDICADA: BITÁCORA DE AUDITORÍA ADMINISTRATIVA
   ========================================================================== */
function renderAuditLogTab() {
  const filteredLogs = state.auditLogs.filter(
    (log) => state.auditCategoryFilter === 'ALL' || log.category === state.auditCategoryFilter
  );

  return `<section class="panel">
    <div class="panel-header">
      <div>
        <div class="panel-title">Bitácora de Auditoría y Eventos de Seguridad (${filteredLogs.length})</div>
        <div class="panel-subtitle">
          Registro inmutable de altas corporativas, cambios de permisos, vinculaciones OAuth 2.0 y suspensiones
        </div>
      </div>
      <div style="display: flex; gap: 8px;">
        <button
          type="button"
          class="btn btn-secondary btn-sm"
          data-action="export-audit-csv"
        >
          ${icon('download', 14)}
          <span>Exportar bitácora CSV</span>
        </button>
      </div>
    </div>

    <div class="toolbar">
      <div class="toolbar-left">
        ${['ALL', 'Tenant', 'Acceso', 'SSO', 'Sedes']
          .map(
            (cat) => `<button
              type="button"
              class="tenant-filter-chip ${state.auditCategoryFilter === cat ? 'active' : ''}"
              data-action="set-audit-category"
              data-category="${cat}"
            >
              ${cat === 'ALL' ? 'Todos los eventos' : `Categoría: ${cat}`}
            </button>`
          )
          .join('')}
      </div>
    </div>

    <div class="table-scroll">
      <table class="data-table">
        <thead>
          <tr>
            <th>Código</th>
            <th>Fecha y Hora</th>
            <th>Categoría</th>
            <th>Organización</th>
            <th>Evento Auditado</th>
            <th>Administrador</th>
          </tr>
        </thead>
        <tbody>
          ${filteredLogs
            .map((log) => {
              const badgeClass =
                log.tone === 'success'
                  ? 'badge-success'
                  : log.tone === 'warning'
                  ? 'badge-warning'
                  : log.tone === 'danger'
                  ? 'badge-danger'
                  : 'badge-info';
              return `<tr>
                <td><span class="mono-code">${escapeHtml(log.id)}</span></td>
                <td style="white-space: nowrap;">${escapeHtml(log.timestamp)}</td>
                <td><span class="badge ${badgeClass} badge-no-dot">${escapeHtml(log.category)}</span></td>
                <td><strong>${escapeHtml(log.companyName)}</strong></td>
                <td>${escapeHtml(log.action)}</td>
                <td><span class="mono-code">${escapeHtml(log.actor)}</span></td>
              </tr>`;
            })
            .join('')}
        </tbody>
      </table>
    </div>
  </section>`;
}

/* ==========================================================================
   7. MODALES: CREAR/EDITAR EMPRESA Y ALTA MASIVA DE USUARIOS POR LOTE
   ========================================================================== */
function renderActiveModal() {
  if (state.activeModal === 'company') {
    const editingCompany = state.editingCompanyId
      ? state.companies.find((c) => c.id === state.editingCompanyId)
      : null;

    return `<div class="admin-modal-backdrop" data-action="close-modal-backdrop">
      <div class="admin-modal-card" role="dialog" aria-modal="true" aria-label="${editingCompany ? 'Editar empresa' : 'Registrar empresa'}">
        <div class="admin-modal-header">
          <div>
            <div class="panel-title">${editingCompany ? `Editar ${escapeHtml(editingCompany.name)}` : 'Registrar Nueva Empresa'}</div>
            <div class="panel-subtitle">Datos fiscales, dominio corporativo Google Workspace y sucursales</div>
          </div>
          <button type="button" class="icon-btn" data-action="close-modal" aria-label="Cerrar modal">
            ${icon('x', 16)}
          </button>
        </div>

        <form id="modal-company-form">
          <div class="admin-modal-body">
            <div class="form-grid">
              <div class="field">
                <label>Razón Social / Nombre *</label>
                <input
                  class="input"
                  type="text"
                  name="name"
                  value="${escapeHtml(editingCompany ? editingCompany.name : '')}"
                  placeholder="Ej. Grupo Industrial del Plata S.A."
                  required
                />
              </div>

              <div class="field">
                <label>CUIT / Identificación Fiscal *</label>
                <input
                  class="input"
                  type="text"
                  name="cuit"
                  value="${escapeHtml(editingCompany ? editingCompany.cuit : '')}"
                  placeholder="Ej. 30-71239876-4"
                  required
                />
              </div>

              <div class="field">
                <label>Rubro / Actividad *</label>
                <input
                  class="input"
                  type="text"
                  name="industry"
                  value="${escapeHtml(editingCompany ? editingCompany.industry : '')}"
                  placeholder="Ej. Ferretería y Suministros"
                  required
                />
              </div>

              <div class="field">
                <label>Dominio Google Workspace *</label>
                <input
                  class="input"
                  type="text"
                  name="domain"
                  value="${escapeHtml(editingCompany ? editingCompany.domain : '')}"
                  placeholder="Ej. grupoindustrial.com.ar"
                  required
                />
              </div>

              <div class="field">
                <label>Ciudad / Ubicación</label>
                <input
                  class="input"
                  type="text"
                  name="city"
                  value="${escapeHtml(editingCompany ? editingCompany.city : 'Buenos Aires, CABA')}"
                />
              </div>

              <div class="field">
                <label>Dirección Fiscal</label>
                <input
                  class="input"
                  type="text"
                  name="address"
                  value="${escapeHtml(editingCompany ? editingCompany.address : '')}"
                  placeholder="Ej. Av. Libertador 4900"
                />
              </div>

              <div class="field">
                <label>Teléfono Corporativo</label>
                <input
                  class="input"
                  type="text"
                  name="phone"
                  value="${escapeHtml(editingCompany ? editingCompany.phone : '')}"
                  placeholder="Ej. +54 11 4800-1200"
                />
              </div>

              <div class="field">
                <label>Plan de Suscripción</label>
                <select class="select" name="plan">
                  <option value="Enterprise Multi-Sede" ${editingCompany?.plan === 'Enterprise Multi-Sede' ? 'selected' : ''}>Enterprise Multi-Sede</option>
                  <option value="Corporativo Pro" ${editingCompany?.plan === 'Corporativo Pro' ? 'selected' : ''}>Corporativo Pro</option>
                  <option value="Corporate Start" ${editingCompany?.plan === 'Corporate Start' ? 'selected' : ''}>Corporate Start</option>
                </select>
              </div>
            </div>

            <div class="field">
              <label>Sedes / Sucursales operativas (separadas por coma)</label>
              <input
                class="input"
                type="text"
                name="branches"
                value="${escapeHtml(
                  editingCompany && Array.isArray(editingCompany.branches)
                    ? editingCompany.branches.join(', ')
                    : 'Casa Central, Depósito Principal'
                )}"
              />
            </div>
          </div>

          <div class="admin-modal-footer">
            <button type="button" class="btn btn-secondary" data-action="close-modal">
              Cancelar
            </button>
            <button type="submit" class="btn btn-primary">
              ${icon('save', 15)}
              <span>${editingCompany ? 'Guardar cambios' : 'Registrar empresa'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>`;
  }

  if (state.activeModal === 'bulk-users') {
    const company = getSelectedCompany();
    if (!company) return '';
    const defaultBranch = company.branches?.[0] || 'Casa Central';

    return `<div class="admin-modal-backdrop" data-action="close-modal-backdrop">
      <div class="admin-modal-card" role="dialog" aria-modal="true" aria-label="Alta masiva de usuarios">
        <div class="admin-modal-header">
          <div>
            <div class="panel-title">Alta Masiva de Usuarios — ${escapeHtml(company.name)}</div>
            <div class="panel-subtitle">
              Ingresá un usuario por línea en formato <span class="mono-code">Nombre Apellido, correo@dominio, Rol, Sede</span> (o solo nombre y correo)
            </div>
          </div>
          <button type="button" class="icon-btn" data-action="close-modal" aria-label="Cerrar modal">
            ${icon('x', 16)}
          </button>
        </div>

        <form id="bulk-users-form" data-company-id="${escapeHtml(company.id)}">
          <div class="admin-modal-body">
            <div class="field">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <label for="bulk-users-textarea">Listado de operadores a habilitar</label>
                <button
                  type="button"
                  class="text-button"
                  data-action="fill-sample-bulk-users"
                  data-domain="${escapeHtml(company.domain)}"
                  data-branch="${escapeHtml(defaultBranch)}"
                >
                  Cargar ejemplo de prueba
                </button>
              </div>
              <textarea
                id="bulk-users-textarea"
                class="textarea-input"
                name="bulkLines"
                placeholder="Camila Ortiz, cortiz@${escapeHtml(company.domain)}, Supervisor Logístico, ${escapeHtml(defaultBranch)}&#10;Nicolás Vega, nvega@${escapeHtml(company.domain)}, Operador de Depósito, ${escapeHtml(defaultBranch)}"
                required
              >${escapeHtml(state.bulkUsersText)}</textarea>
            </div>

            <div class="sso-toggle-banner">
              <div class="sso-toggle-info">
                ${icon('googleLogo', 18)}
                <div>
                  <strong>Federación automática con Google Workspace</strong>
                  <span>Todas las cuentas importadas quedarán habilitadas para iniciar sesión con Google OAuth 2.0.</span>
                </div>
              </div>
            </div>
          </div>

          <div class="admin-modal-footer">
            <button type="button" class="btn btn-secondary" data-action="close-modal">
              Cancelar
            </button>
            <button type="submit" class="btn btn-primary">
              ${icon('upload', 15)}
              <span>Procesar e incorporar usuarios</span>
            </button>
          </div>
        </form>
      </div>
    </div>`;
  }

  return '';
}

/* ==========================================================================
   8. SHELL PRINCIPAL Y CICLO DE RENDERIZADO CON PRESERVACIÓN DE FOCO
   ========================================================================== */
function renderAdminShell() {
  const pageHeadings = {
    companies: {
      title: 'Gestión de Empresas y Usuarios Google Workspace',
      subtitle:
        'Administrá las organizaciones registradas, asigná operadores por sucursal y goberná el acceso federado con Google.',
    },
    'register-company': {
      title: 'Alta de Nueva Organización en Logic Control',
      subtitle:
        'Configurá el entorno multi-sede de una nueva empresa y vinculá su dominio corporativo con Google Workspace.',
    },
    'google-directory': {
      title: 'Directorio Global de Cuentas Google SSO',
      subtitle:
        'Vista transversal de todas las identidades operativas habilitadas en las empresas del grupo.',
    },
    'audit-log': {
      title: 'Bitácora de Auditoría y Trazabilidad Administrativa',
      subtitle:
        'Historial cronológico de cambios de permisos, altas de empresas, sedes y políticas de seguridad.',
    },
  };

  const currentHeading = pageHeadings[state.activeTab] || pageHeadings.companies;

  return `<div class="app-shell">
    ${renderAdminSidebar()}

    <div class="main-area">
      ${renderAdminTopbar()}

      <main class="content-scroll">
        <div class="page">
          <div class="page-header">
            <div>
              <h1 class="page-title">${escapeHtml(currentHeading.title)}</h1>
              <p class="page-subtitle">${escapeHtml(currentHeading.subtitle)}</p>
            </div>
            <div class="page-actions">
              <button
                type="button"
                class="btn btn-secondary"
                data-action="switch-tab"
                data-tab="${state.activeTab === 'audit-log' ? 'companies' : 'audit-log'}"
              >
                ${icon('history', 15)}
                <span>${state.activeTab === 'audit-log' ? 'Volver a Empresas' : 'Ver Auditoría'}</span>
              </button>
              <button
                type="button"
                class="btn btn-primary"
                data-action="open-company-modal"
              >
                ${icon('plus', 15)}
                <span>Registrar empresa</span>
              </button>
            </div>
          </div>

          ${renderFeedbackBanner()}
          ${renderKpiSummary()}

          ${
            state.activeTab === 'companies'
              ? renderCompaniesMasterDetailView()
              : state.activeTab === 'register-company'
              ? renderRegisterCompanyTab()
              : state.activeTab === 'google-directory'
              ? renderGoogleDirectoryTab()
              : renderAuditLogTab()
          }
        </div>
      </main>
    </div>

    ${renderActiveModal()}
  </div>`;
}

const rootElement = document.querySelector('#admin-root');

function render() {
  applyTheme(state.theme);
  if (!rootElement) return;

  const activeEl = document.activeElement;
  const focusState =
    activeEl && activeEl.id
      ? {
          id: activeEl.id,
          start: typeof activeEl.selectionStart === 'number' ? activeEl.selectionStart : null,
          end: typeof activeEl.selectionEnd === 'number' ? activeEl.selectionEnd : null,
        }
      : null;

  rootElement.innerHTML = state.isAuthenticated
    ? renderAdminShell()
    : renderAdminLoginView();

  if (focusState && focusState.id) {
    const nextEl = document.getElementById(focusState.id);
    if (nextEl && typeof nextEl.focus === 'function') {
      nextEl.focus();
      if (
        focusState.start !== null &&
        typeof nextEl.setSelectionRange === 'function' &&
        nextEl.type !== 'email' &&
        nextEl.type !== 'number'
      ) {
        try {
          nextEl.setSelectionRange(focusState.start, focusState.end);
        } catch {
          // Ignorar en inputs que no admiten selección
        }
      }
    }
  }
}

/* ==========================================================================
   9. MANEJADORES DE EVENTOS E INTERACCIONES
   ========================================================================== */
function loginWithGoogleAccount({ name, email, role, companyName }) {
  const session = {
    name: name || email.split('@')[0],
    email,
    role: role || 'Administrador de Empresa',
    companyName: companyName || 'Logic Control',
    avatar: buildInitials(name || email),
    authMethod: 'google',
  };
  state.isAuthenticated = true;
  state.currentUser = session;
  state.showGooglePicker = false;
  state.loginError = '';
  saveSessionAuth(session);
  appendAuditLog({
    companyName: session.companyName,
    category: 'SSO',
    action: `Inicio de sesión administrativo mediante Google Workspace (${session.email})`,
    tone: 'info',
  });
  setFeedback(
    'success',
    `Sesión iniciada con Google Workspace como ${session.name} (${session.email}).`
  );
  render();
}

function handleClick(event) {
  const trigger = event.target.closest('[data-action]');
  if (!trigger) return;

  const { action } = trigger.dataset;

  if (action === 'toggle-google-picker') {
    state.showGooglePicker = !state.showGooglePicker;
    state.loginError = '';
    render();
    return;
  }

  if (action === 'google-select-account') {
    const { email, name, role, company } = trigger.dataset;
    loginWithGoogleAccount({
      email,
      name,
      role,
      companyName: company,
    });
    return;
  }

  if (action === 'google-custom-login') {
    const emailInput = document.querySelector('#custom-google-email');
    const email = (emailInput ? emailInput.value : state.customGoogleEmail).trim();
    if (!email || !email.includes('@')) {
      state.loginError = 'Ingresá un correo de Google válido (ej. usuario@empresa.com.ar).';
      render();
      return;
    }

    const existingAccount = getAllGoogleAccounts().find(
      (a) => a.email.toLowerCase() === email.toLowerCase()
    );
    if (existingAccount) {
      loginWithGoogleAccount(existingAccount);
      return;
    }

    const formattedName = email
      .split('@')[0]
      .replace(/[._-]+/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase());

    loginWithGoogleAccount({
      name: formattedName,
      email,
      role: 'Administrador Google SSO',
      companyName: 'Google Workspace',
    });
    return;
  }

  if (action === 'logout') {
    state.isAuthenticated = false;
    state.showGooglePicker = false;
    state.feedback = null;
    saveSessionAuth(null);
    render();
    return;
  }

  if (action === 'dismiss-feedback') {
    state.feedback = null;
    render();
    return;
  }

  if (action === 'set-theme') {
    const nextTheme = trigger.dataset.theme || 'light';
    state.theme = nextTheme;
    applyTheme(nextTheme);
    render();
    return;
  }

  if (action === 'toggle-theme') {
    const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
    state.theme = nextTheme;
    applyTheme(nextTheme);
    render();
    return;
  }

  if (action === 'check-endpoints') {
    showToast('Comprobando conexión con endpoints...');
    connectionManager.checkConnections().then((res) => {
      state.apiConnection = res;
      render();
      if (res.backendOnline) {
        showToast(`Conectado a Backend Local http://localhost:4000 (${res.backendLatency}ms)`);
      } else if (res.supabaseOnline) {
        showToast(`Conectado a Supabase Cloud (${res.supabaseLatency}ms)`);
      } else {
        showToast('Modo Local activo (endpoints externos offline)');
      }
    });
    return;
  }

  if (action === 'switch-tab') {
    state.activeTab = trigger.dataset.tab || 'companies';
    render();
    return;
  }

  if (action === 'set-company-subtab') {
    state.companySubTab = trigger.dataset.subtab || 'users';
    render();
    return;
  }

  if (action === 'set-company-status-filter') {
    state.companyStatusFilter = trigger.dataset.status || 'ALL';
    render();
    return;
  }

  if (action === 'select-company') {
    state.selectedCompanyId = trigger.dataset.companyId;
    state.userSearch = '';
    state.userRoleFilter = 'ALL';
    state.userBranchFilter = 'ALL';
    render();
    return;
  }

  if (action === 'jump-to-company') {
    state.selectedCompanyId = trigger.dataset.companyId;
    state.activeTab = 'companies';
    state.companySubTab = 'users';
    render();
    return;
  }

  if (action === 'toggle-add-user-drawer') {
    state.showAddUserForm = !state.showAddUserForm;
    state.companySubTab = 'users';
    render();
    return;
  }

  if (action === 'reset-user-filters') {
    state.userSearch = '';
    state.userRoleFilter = 'ALL';
    state.userBranchFilter = 'ALL';
    render();
    return;
  }

  if (action === 'filter-users-by-branch') {
    state.userBranchFilter = trigger.dataset.branch || 'ALL';
    state.companySubTab = 'users';
    render();
    return;
  }

  if (action === 'open-company-modal') {
    state.editingCompanyId = null;
    state.activeModal = 'company';
    render();
    return;
  }

  if (action === 'edit-company') {
    state.editingCompanyId = trigger.dataset.companyId;
    state.activeModal = 'company';
    render();
    return;
  }

  if (action === 'open-bulk-users-modal') {
    state.bulkUsersText = '';
    state.activeModal = 'bulk-users';
    render();
    return;
  }

  if (action === 'fill-sample-bulk-users') {
    const domain = trigger.dataset.domain || 'empresa.com.ar';
    const branch = trigger.dataset.branch || 'Casa Central';
    state.bulkUsersText = [
      `Camila Ortiz, cortiz@${domain}, Supervisor Logístico, ${branch}`,
      `Nicolás Vega, nvega@${domain}, Operador de Depósito, ${branch}`,
      `Julieta Paz, jpaz@${domain}, Auditor de Inventario, ${branch}`,
    ].join('\n');
    render();
    return;
  }

  if (action === 'close-modal') {
    state.activeModal = null;
    state.editingCompanyId = null;
    render();
    return;
  }

  if (action === 'close-modal-backdrop' && event.target === trigger) {
    state.activeModal = null;
    state.editingCompanyId = null;
    render();
    return;
  }

  if (action === 'toggle-company-status') {
    const company = state.companies.find((c) => c.id === trigger.dataset.companyId);
    if (!company) return;
    company.status = company.status === 'Activa' ? 'Suspendida' : 'Activa';
    syncCompaniesPersistence();
    appendAuditLog({
      companyName: company.name,
      category: 'Tenant',
      action: `Estado operativo cambiado a "${company.status}"`,
      tone: company.status === 'Activa' ? 'success' : 'warning',
    });
    setFeedback(
      company.status === 'Activa' ? 'success' : 'warning',
      `El estado de "${company.name}" se actualizó a ${company.status}.`
    );
    render();
    return;
  }

  if (action === 'delete-company') {
    const companyId = trigger.dataset.companyId;
    const company = state.companies.find((c) => c.id === companyId);
    if (!company) return;
    if (state.companies.length <= 1) {
      setFeedback('danger', 'Debe permanecer al menos una organización activa en la consola.');
      render();
      return;
    }
    state.companies = state.companies.filter((c) => c.id !== companyId);
    if (state.selectedCompanyId === companyId) {
      state.selectedCompanyId = state.companies[0]?.id || null;
    }
    syncCompaniesPersistence();
    appendAuditLog({
      companyName: company.name,
      category: 'Tenant',
      action: `Baja definitiva de la organización CUIT ${company.cuit}`,
      tone: 'danger',
    });
    setFeedback('danger', `La organización "${company.name}" fue eliminada del padrón.`);
    render();
    return;
  }

  if (action === 'toggle-user-status') {
    const { companyId, userId } = trigger.dataset;
    const company = state.companies.find((c) => c.id === companyId);
    const user = company?.users?.find((u) => u.id === userId);
    if (!user) return;
    const nextActive = user.status !== 'Activo';
    user.status = nextActive ? 'Activo' : 'Inactivo';
    user.enabled = nextActive;
    syncCompaniesPersistence();
    appendAuditLog({
      companyName: company.name,
      category: 'Acceso',
      action: `${nextActive ? 'Habilitación' : 'Inhabilitación'} de operador ${user.name} (${user.email})`,
      tone: nextActive ? 'success' : 'warning',
    });
    setFeedback(
      'success',
      `El operador ${user.name} (${company.name}) ahora está ${nextActive ? 'habilitado' : 'inhabilitado'}.`
    );
    render();
    return;
  }

  if (action === 'toggle-user-google') {
    const { companyId, userId } = trigger.dataset;
    const company = state.companies.find((c) => c.id === companyId);
    const user = company?.users?.find((u) => u.id === userId);
    if (!user) return;
    if (company.ssoPolicy?.enforceGoogleSso && user.googleLinked !== false) {
      setFeedback(
        'warning',
        `La política de ${company.name} exige mantener Google Workspace SSO activo. Desactivá primero la restricción en "Políticas Google SSO".`
      );
      render();
      return;
    }
    user.googleLinked = user.googleLinked === false;
    syncCompaniesPersistence();
    appendAuditLog({
      companyName: company.name,
      category: 'SSO',
      action: `${user.googleLinked ? 'Vinculación' : 'Desvinculación'} OAuth 2.0 para ${user.email}`,
      tone: 'info',
    });
    setFeedback(
      'success',
      user.googleLinked
        ? `La cuenta de ${user.name} quedó vinculada con Google Workspace SSO.`
        : `El usuario ${user.name} pasó a autenticación por clave interna.`
    );
    render();
    return;
  }

  if (action === 'delete-user') {
    const { companyId, userId } = trigger.dataset;
    const company = state.companies.find((c) => c.id === companyId);
    if (!company || !Array.isArray(company.users)) return;
    const targetUser = company.users.find((u) => u.id === userId);
    if (!targetUser) return;
    company.users = company.users.filter((u) => u.id !== userId);
    syncCompaniesPersistence();
    appendAuditLog({
      companyName: company.name,
      category: 'Acceso',
      action: `Baja de usuario ${targetUser.name} (${targetUser.email})`,
      tone: 'danger',
    });
    setFeedback('danger', `El operador ${targetUser.name} fue removido de ${company.name}.`);
    render();
    return;
  }

  if (action === 'remove-branch') {
    const { companyId, branch } = trigger.dataset;
    const company = state.companies.find((c) => c.id === companyId);
    if (!company || !Array.isArray(company.branches) || company.branches.length <= 1) return;
    company.branches = company.branches.filter((b) => b !== branch);
    const fallbackBranch = company.branches[0];
    (company.users || []).forEach((u) => {
      if (u.branch === branch) u.branch = fallbackBranch;
    });
    syncCompaniesPersistence();
    appendAuditLog({
      companyName: company.name,
      category: 'Sedes',
      action: `Cierre de sede "${branch}" y reubicación de personal en "${fallbackBranch}"`,
      tone: 'warning',
    });
    setFeedback(
      'success',
      `Sede "${branch}" eliminada. Los usuarios asignados fueron reubicados en "${fallbackBranch}".`
    );
    render();
    return;
  }

  if (action === 'toggle-sso-policy') {
    const { companyId, policyKey } = trigger.dataset;
    const company = state.companies.find((c) => c.id === companyId);
    if (!company || !policyKey) return;
    if (!company.ssoPolicy) {
      company.ssoPolicy = {
        enforceGoogleSso: true,
        restrictToCorporateDomain: false,
        allowBranchSwitching: true,
      };
    }
    company.ssoPolicy[policyKey] = !company.ssoPolicy[policyKey];
    if (policyKey === 'enforceGoogleSso' && company.ssoPolicy.enforceGoogleSso) {
      (company.users || []).forEach((u) => {
        u.googleLinked = true;
      });
    }
    syncCompaniesPersistence();
    appendAuditLog({
      companyName: company.name,
      category: 'SSO',
      action: `Política "${policyKey}" actualizada a ${company.ssoPolicy[policyKey] ? 'ACTIVA' : 'INACTIVA'}`,
      tone: 'info',
    });
    setFeedback('success', `Política de seguridad actualizada para ${company.name}.`);
    render();
    return;
  }

  if (action === 'verify-company-domain') {
    const company = state.companies.find((c) => c.id === trigger.dataset.companyId);
    if (!company) return;
    company.domainVerified = true;
    syncCompaniesPersistence();
    appendAuditLog({
      companyName: company.name,
      category: 'SSO',
      action: `Verificación exitosa de registros OAuth 2.0 y MX para @${company.domain}`,
      tone: 'success',
    });
    setFeedback(
      'success',
      `Dominio @${company.domain} verificado correctamente con Google Identity Services.`
    );
    render();
    return;
  }

  if (action === 'impersonate-company' || action === 'impersonate-user') {
    const { companyId, userId } = trigger.dataset;
    const company = state.companies.find((c) => c.id === companyId);
    if (!company) return;
    const targetUser = userId
      ? company.users?.find((u) => u.id === userId)
      : company.users?.find((u) => u.status === 'Activo') || company.users?.[0];

    window.sessionStorage.setItem(STORAGE_KEYS.MAIN_APP_AUTH, '1');
    syncCompaniesPersistence();
    appendAuditLog({
      companyName: company.name,
      category: 'Acceso',
      action: `Apertura de consola de inventario como ${targetUser ? targetUser.email : company.name}`,
      tone: 'info',
    });
    window.location.href = './index.html';
    return;
  }

  if (action === 'export-company-users-csv') {
    const company = state.companies.find((c) => c.id === trigger.dataset.companyId);
    if (!company) return;
    const header = 'ID,Nombre,Email,Empresa,CUIT,Sede,Rol,Google_SSO,Estado,Ultimo_Acceso';
    const rows = (company.users || []).map(
      (u) =>
        `"${u.id}","${u.name}","${u.email}","${company.name}","${company.cuit}","${u.branch}","${u.role}","${u.googleLinked !== false ? 'Si' : 'No'}","${u.status}","${u.lastAccess || ''}"`
    );
    downloadCsvFile(`nomina-${company.domain}.csv`, [header, ...rows]);
    setFeedback('success', `Nómina de ${company.name} exportada a CSV (${rows.length} registros).`);
    render();
    return;
  }

  if (action === 'export-global-directory-csv') {
    const header = 'Empresa,CUIT,Dominio,ID_Usuario,Nombre,Email,Sede,Rol,Google_SSO,Estado';
    const rows = [];
    state.companies.forEach((c) => {
      (c.users || []).forEach((u) => {
        rows.push(
          `"${c.name}","${c.cuit}","${c.domain}","${u.id}","${u.name}","${u.email}","${u.branch}","${u.role}","${u.googleLinked !== false ? 'Si' : 'No'}","${u.status}"`
        );
      });
    });
    downloadCsvFile('directorio-global-logic-control.csv', [header, ...rows]);
    setFeedback('success', `Directorio global exportado (${rows.length} usuarios).`);
    render();
    return;
  }

  if (action === 'export-audit-csv') {
    const header = 'ID,Fecha,Categoria,Empresa,Accion,Administrador';
    const rows = state.auditLogs.map(
      (l) =>
        `"${l.id}","${l.timestamp}","${l.category}","${l.companyName}","${l.action.replace(/"/g, '""')}","${l.actor}"`
    );
    downloadCsvFile('bitacora-auditoria-logic-control.csv', [header, ...rows]);
    setFeedback('success', `Bitácora de auditoría exportada (${rows.length} eventos).`);
    render();
    return;
  }

  if (action === 'set-audit-category') {
    state.auditCategoryFilter = trigger.dataset.category || 'ALL';
    render();
  }
}

function handleInput(event) {
  const { target } = event;

  if (target.id === 'company-search-input') {
    state.companySearch = target.value;
    render();
    return;
  }

  if (target.id === 'company-user-search') {
    state.userSearch = target.value;
    render();
    return;
  }

  if (target.id === 'directory-search-input') {
    state.directorySearch = target.value;
    render();
    return;
  }

  if (target.id === 'custom-google-email') {
    state.customGoogleEmail = target.value;
    return;
  }

  if (target.id === 'bulk-users-textarea') {
    state.bulkUsersText = target.value;
  }
}

function handleChange(event) {
  const { target } = event;

  if (target.id === 'company-user-role-filter') {
    state.userRoleFilter = target.value;
    render();
    return;
  }

  if (target.id === 'company-user-branch-filter') {
    state.userBranchFilter = target.value;
    render();
    return;
  }

  if (target.id === 'directory-auth-filter') {
    state.directoryAuthFilter = target.value;
    render();
    return;
  }

  if (target.dataset.action === 'change-user-role') {
    const { companyId, userId } = target.dataset;
    const company = state.companies.find((c) => c.id === companyId);
    const user = company?.users?.find((u) => u.id === userId);
    if (!user) return;
    user.role = target.value;
    syncCompaniesPersistence();
    appendAuditLog({
      companyName: company.name,
      category: 'Acceso',
      action: `Cambio de rol de ${user.name} a "${user.role}"`,
      tone: 'info',
    });
    setFeedback('success', `Rol de ${user.name} actualizado a "${user.role}".`);
    render();
    return;
  }

  if (target.dataset.action === 'change-user-branch') {
    const { companyId, userId } = target.dataset;
    const company = state.companies.find((c) => c.id === companyId);
    const user = company?.users?.find((u) => u.id === userId);
    if (!user) return;
    user.branch = target.value;
    syncCompaniesPersistence();
    appendAuditLog({
      companyName: company.name,
      category: 'Sedes',
      action: `Reasignación de ${user.name} a la sede "${user.branch}"`,
      tone: 'info',
    });
    setFeedback('success', `Sede de ${user.name} actualizada a "${user.branch}".`);
    render();
  }
}

function handleSubmit(event) {
  const form = event.target;

  // 1. Login Administrativo
  if (form.id === 'admin-login-form') {
    event.preventDefault();
    const formData = new FormData(form);
    const email = String(formData.get('email') || '').trim();
    const password = String(formData.get('password') || '').trim();

    state.loginEmail = email;
    state.loginPassword = password;

    if (!email || !email.includes('@') || password.length < 4) {
      state.loginError = 'Ingresá un correo corporativo válido y una clave de al menos 4 caracteres.';
      render();
      return;
    }

    const matchedAccount = getAllGoogleAccounts().find(
      (acc) => acc.email.toLowerCase() === email.toLowerCase()
    );

    loginWithGoogleAccount({
      name: matchedAccount ? matchedAccount.name : email.split('@')[0],
      email,
      role: matchedAccount ? matchedAccount.role : 'Super Administrador Global',
      companyName: matchedAccount ? matchedAccount.companyName : 'Consola Central · Logic Control',
    });
    return;
  }

  // 2. Alta Individual de Usuario en Empresa
  if (form.id === 'add-company-user-form') {
    event.preventDefault();
    const companyId = form.dataset.companyId;
    const company = state.companies.find((c) => c.id === companyId);
    if (!company) return;

    const formData = new FormData(form);
    const name = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim().toLowerCase();
    const role = String(formData.get('role') || AVAILABLE_ROLES[1]);
    const branch = String(formData.get('branch') || company.branches?.[0] || 'Casa Central');
    const googleLinked = company.ssoPolicy?.enforceGoogleSso
      ? true
      : formData.get('googleLinked') !== null;

    if (!name || !email || !email.includes('@')) {
      setFeedback('danger', 'Completá el nombre y un correo electrónico válido.');
      render();
      return;
    }

    if (
      company.ssoPolicy?.restrictToCorporateDomain &&
      !email.endsWith(`@${company.domain.toLowerCase()}`)
    ) {
      setFeedback(
        'danger',
        `La política de seguridad de ${company.name} solo admite correos con dominio @${company.domain}.`
      );
      render();
      return;
    }

    if (!Array.isArray(company.users)) {
      company.users = [];
    }

    if (company.users.some((u) => u.email.toLowerCase() === email)) {
      setFeedback('danger', `El correo ${email} ya pertenece a la nómina de ${company.name}.`);
      render();
      return;
    }

    const newUser = {
      id: `USR-${Date.now().toString().slice(-4)}`,
      name,
      email,
      role,
      branch,
      status: 'Activo',
      enabled: true,
      googleLinked,
      lastAccess: 'Recién habilitado',
    };

    company.users.unshift(newUser);
    state.showAddUserForm = false;
    syncCompaniesPersistence();
    appendAuditLog({
      companyName: company.name,
      category: 'Acceso',
      action: `Alta de operador ${name} (${email}) en sede ${branch} con rol ${role}`,
      tone: 'success',
    });
    setFeedback(
      'success',
      `Operador "${name}" (${email}) incorporado a ${company.name} en la sede ${branch}.`
    );
    render();
    return;
  }

  // 3. Alta Masiva de Usuarios por Lote
  if (form.id === 'bulk-users-form') {
    event.preventDefault();
    const companyId = form.dataset.companyId;
    const company = state.companies.find((c) => c.id === companyId);
    if (!company) return;

    const rawText = state.bulkUsersText.trim();
    if (!rawText) return;

    const lines = rawText
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);

    let addedCount = 0;
    const defaultBranch = company.branches?.[0] || 'Casa Central';

    lines.forEach((line, idx) => {
      const parts = line.split(',').map((p) => p.trim());
      let name = '';
      let email = '';
      let role = AVAILABLE_ROLES[2];
      let branch = defaultBranch;

      if (parts.length === 1 && parts[0].includes('@')) {
        email = parts[0].toLowerCase();
        name = email
          .split('@')[0]
          .replace(/[._-]+/g, ' ')
          .replace(/\b\w/g, (l) => l.toUpperCase());
      } else if (parts.length >= 2) {
        name = parts[0];
        email = parts[1].toLowerCase();
        if (parts[2] && AVAILABLE_ROLES.includes(parts[2])) role = parts[2];
        if (parts[3] && company.branches?.includes(parts[3])) branch = parts[3];
      }

      if (!name || !email || !email.includes('@')) return;
      if (company.users.some((u) => u.email.toLowerCase() === email)) return;

      company.users.unshift({
        id: `USR-${Date.now().toString().slice(-3)}${idx}`,
        name,
        email,
        role,
        branch,
        status: 'Activo',
        enabled: true,
        googleLinked: true,
        lastAccess: 'Importado por lote',
      });
      addedCount += 1;
    });

    state.activeModal = null;
    state.bulkUsersText = '';
    syncCompaniesPersistence();

    if (addedCount > 0) {
      appendAuditLog({
        companyName: company.name,
        category: 'Acceso',
        action: `Importación por lote de ${addedCount} operadores vinculados con Google SSO`,
        tone: 'success',
      });
      setFeedback(
        'success',
        `Se incorporaron ${addedCount} nuevos usuarios a ${company.name} correctamente.`
      );
    } else {
      setFeedback(
        'warning',
        'No se agregaron usuarios nuevos (verificá el formato o si los correos ya existían).'
      );
    }
    render();
    return;
  }

  // 4. Agregar Nueva Sede a la Empresa
  if (form.id === 'add-branch-form') {
    event.preventDefault();
    const companyId = form.dataset.companyId;
    const company = state.companies.find((c) => c.id === companyId);
    if (!company) return;

    const formData = new FormData(form);
    const branchName = String(formData.get('branchName') || '').trim();
    if (!branchName) return;

    if (!Array.isArray(company.branches)) {
      company.branches = [];
    }

    if (company.branches.includes(branchName)) {
      setFeedback('warning', `La sede "${branchName}" ya existe en ${company.name}.`);
      render();
      return;
    }

    company.branches.push(branchName);
    syncCompaniesPersistence();
    appendAuditLog({
      companyName: company.name,
      category: 'Sedes',
      action: `Apertura de nueva sede operativa "${branchName}"`,
      tone: 'success',
    });
    setFeedback('success', `Nueva sede "${branchName}" habilitada en ${company.name}.`);
    render();
    return;
  }

  // 5. Crear o Editar Empresa (Modal o Pestaña Dedicada)
  if (form.id === 'modal-company-form' || form.id === 'full-register-company-form') {
    event.preventDefault();
    const formData = new FormData(form);
    const name = String(formData.get('name') || '').trim();
    const cuit = String(formData.get('cuit') || '').trim();
    const industry = String(formData.get('industry') || '').trim();
    const domain = String(formData.get('domain') || '')
      .trim()
      .replace(/^@/, '')
      .toLowerCase();
    const city = String(formData.get('city') || 'Buenos Aires').trim();
    const address = String(formData.get('address') || '').trim();
    const phone = String(formData.get('phone') || '').trim();
    const plan = String(formData.get('plan') || 'Enterprise Multi-Sede');
    const branchesRaw = String(formData.get('branches') || 'Casa Central');
    const branches = branchesRaw
      .split(',')
      .map((b) => b.trim())
      .filter(Boolean);

    if (!name || !cuit || !domain) {
      setFeedback('danger', 'Completá la Razón Social, el CUIT y el dominio corporativo.');
      render();
      return;
    }

    if (form.id === 'modal-company-form' && state.editingCompanyId) {
      const target = state.companies.find((c) => c.id === state.editingCompanyId);
      if (target) {
        target.name = name;
        target.cuit = cuit;
        target.industry = industry;
        target.domain = domain;
        target.city = city;
        target.address = address;
        target.phone = phone;
        target.plan = plan;
        target.branches = branches.length > 0 ? branches : ['Casa Central'];
      }
      state.activeModal = null;
      state.editingCompanyId = null;
      syncCompaniesPersistence();
      appendAuditLog({
        companyName: name,
        category: 'Tenant',
        action: `Actualización de ficha societaria, plan (${plan}) y sucursales`,
        tone: 'info',
      });
      setFeedback('success', `Datos de la organización "${name}" actualizados.`);
      render();
      return;
    }

    const newCompanyId = `EMP-0${state.companies.length + 1}`;
    const initialUsers = [];

    const adminName = String(formData.get('adminName') || '').trim();
    const adminEmail = String(formData.get('adminEmail') || '').trim().toLowerCase();
    if (adminName && adminEmail && adminEmail.includes('@')) {
      initialUsers.push({
        id: `USR-${Date.now().toString().slice(-4)}`,
        name: adminName,
        email: adminEmail,
        role: 'Administrador de Empresa',
        branch: branches[0] || 'Casa Central',
        status: 'Activo',
        enabled: true,
        googleLinked: true,
        lastAccess: 'Administrador inicial',
      });
    }

    const newCompany = {
      id: newCompanyId,
      name,
      cuit,
      industry: industry || 'Comercio y Distribución',
      domain,
      city,
      address: address || 'Casa Central',
      phone: phone || 'Sin especificar',
      plan,
      status: 'Activa',
      createdAt: new Date().toLocaleDateString('es-AR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      domainVerified: true,
      ssoPolicy: {
        enforceGoogleSso: true,
        restrictToCorporateDomain: false,
        allowBranchSwitching: true,
      },
      branches: branches.length > 0 ? branches : ['Casa Central'],
      users: initialUsers,
    };

    state.companies.unshift(newCompany);
    state.selectedCompanyId = newCompany.id;
    state.activeTab = 'companies';
    state.companySubTab = 'users';
    state.activeModal = null;
    state.editingCompanyId = null;
    syncCompaniesPersistence();
    appendAuditLog({
      companyName: name,
      category: 'Tenant',
      action: `Alta de nueva organización CUIT ${cuit} con dominio @${domain} (${branches.length} sedes)`,
      tone: 'success',
    });
    setFeedback(
      'success',
      `Organización "${name}" registrada exitosamente. Ya podés administrar sus usuarios y sedes.`
    );
    render();
  }
}

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && (state.activeModal || state.showGooglePicker)) {
    state.activeModal = null;
    state.editingCompanyId = null;
    state.showGooglePicker = false;
    render();
  }
});

document.addEventListener('click', handleClick);
document.addEventListener('input', handleInput);
document.addEventListener('change', handleChange);
document.addEventListener('submit', handleSubmit);

syncCompaniesPersistence();
render();

// Suscribir estado de endpoints en Admin Console
connectionManager.subscribe((conn) => {
  state.apiConnection = conn;
  render();
});
connectionManager.checkConnections();
