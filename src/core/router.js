/**
 * @fileoverview Enrutador SPA client-side basado en History API.
 * Gestiona el cambio de secciones mediante History API.
 */

import { store } from './store.js';

/**
 * Sincroniza el parámetro `?screen=` en la barra de direcciones del navegador sin recargar.
 * @param {string} nextScreen
 */
function syncUrlScreen(nextScreen) {
  const url = new URL(window.location.href);
  url.searchParams.set('screen', nextScreen);
  window.history.pushState({}, '', url);
}

/**
 * Navega a una sección de la aplicación.
 * @param {string} nextScreen Identificador de la vista destino.
 */
export function navigate(nextScreen) {
  syncUrlScreen(nextScreen);
  store.setState({
    screen: nextScreen,
    branchMenuOpen: false,
  });
}

/**
 * Navega desde el menú lateral.
 * @param {string} nextScreen Identificador de la vista destino.
 */
export function navigateFromMenu(nextScreen) {
  syncUrlScreen(nextScreen);
  store.setState({
    screen: nextScreen,
    branchMenuOpen: false,
  });
}

/**
 * Inicializa el listener para los botones Atrás/Adelante del navegador (`popstate`).
 */
export function initRouter() {
  window.addEventListener('popstate', () => {
    const param = new URLSearchParams(window.location.search).get('screen');
    if (param) {
      store.setState({ screen: param });
    }
  });
}
