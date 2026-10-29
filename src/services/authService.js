/**
 * @fileoverview Capa de Servicios de Autenticación, Control de Acceso de Usuarios
 * (Habilitar / Inhabilitar cuentas, cambio de roles) y Seguridad de Contraseña.
 */

import { store } from '../core/store.js';

/**
 * Inicia sesión en la plataforma (por credenciales o mediante Google Workspace SSO).
 * @param {string} [toastMessage]
 */
export function loginSession(toastMessage = 'Sesión iniciada correctamente') {
  window.sessionStorage.setItem('stockia_auth', '1');
  store.setState({
    authenticated: true,
    loginState: {
      ...store.getState().loginState,
      googlePickerOpen: false,
      error: '',
    },
  });
  store.showToast(toastMessage);
}

/**
 * Cierra la sesión activa del operador y limpia el flag de sesión.
 */
export function logoutSession() {
  window.sessionStorage.removeItem('stockia_auth');
  store.setState({
    authenticated: false,
    mobileOpen: false,
    sidebarVisible: false,
    branchMenuOpen: false,
  });
  store.showToast('Sesión finalizada');
}

/**
 * Habilita o inhabilita el acceso de un usuario al sistema en tiempo real.
 * @param {string} userId
 */
export function toggleUserEnabled(userId) {
  const state = store.getState();
  const target = state.users.find((u) => u.id === userId);
  if (!target) return;

  const nextEnabled = !target.enabled;
  const nextUsers = state.users.map((u) =>
    u.id === userId ? { ...u, enabled: nextEnabled } : u
  );

  store.setState({ users: nextUsers });
  store.showToast(
    nextEnabled
      ? `Usuario ${target.name} habilitado para operar`
      : `Acceso de ${target.name} inhabilitado inmediatamente`
  );
}

/**
 * Actualiza el rol operativo de un usuario en la matriz de permisos.
 * @param {string} userId
 * @param {string} role
 */
export function updateUserRole(userId, role) {
  const state = store.getState();
  const target = state.users.find((u) => u.id === userId);
  if (!target) return;

  const nextUsers = state.users.map((u) => (u.id === userId ? { ...u, role } : u));
  store.setState({ users: nextUsers });
  store.showToast(`Rol de ${target.name} actualizado a "${role}"`);
}

/**
 * Crea y habilita un nuevo operador dentro de la nómina de usuarios.
 */
export function createNewUser() {
  const state = store.getState();
  const s = state.settingsState;

  if (!s.newUserName.trim() || !s.newUserEmail.trim()) {
    store.showToast('Completá nombre y correo corporativo para dar de alta al usuario');
    return;
  }

  const created = {
    id: `USR-0${state.users.length + 1}`,
    name: s.newUserName.trim(),
    email: s.newUserEmail.trim().toLowerCase(),
    role: s.newUserRole,
    branch: s.newUserBranch,
    lastAccess: 'Recién creado',
    enabled: true,
  };

  store.setState({
    users: [...state.users, created],
    settingsState: {
      ...s,
      newUserName: '',
      newUserEmail: '',
      addingUser: false,
    },
  });

  store.showToast(`Usuario ${created.name} habilitado en ${created.branch}`);
}

/**
 * Evalúa la fortaleza de una contraseña en una escala de 0 a 4.
 * @param {string} pwd
 * @returns {{ score: number, label: string, color: string }}
 */
export function evaluatePasswordStrength(pwd) {
  const score = [
    pwd.length >= 8,
    /[A-Z]/.test(pwd),
    /[0-9]/.test(pwd),
    /[^A-Za-z0-9]/.test(pwd),
  ].filter(Boolean).length;

  const labels = ['Sin definir', 'Débil', 'Aceptable', 'Segura', 'Muy fuerte'];
  const colors = [
    'var(--border-strong)',
    'var(--danger)',
    'var(--warning)',
    'var(--info)',
    'var(--success)',
  ];

  return {
    score,
    label: pwd ? labels[score] : 'Ingresá nueva clave',
    color: colors[score],
  };
}

/**
 * Valida y aplica el cambio de contraseña corporativa del operador.
 */
export function submitPasswordChange() {
  const state = store.getState();
  const s = state.settingsState;

  if (!s.currentPassword.trim()) {
    store.showToast('Ingresá tu contraseña actual para validar tu identidad');
    return;
  }
  if (s.newPassword.length < 8) {
    store.showToast('La nueva contraseña debe tener al menos 8 caracteres');
    return;
  }
  if (s.newPassword !== s.confirmPassword) {
    store.showToast('La confirmación no coincide con la nueva contraseña');
    return;
  }

  const nowStr = new Date().toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  store.setState({
    settingsState: {
      ...s,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      passwordSavedMessage: `Contraseña actualizada hoy a las ${nowStr} hs`,
    },
  });

  store.showToast('Contraseña corporativa actualizada con éxito');
}
