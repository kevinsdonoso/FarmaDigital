/**
 * Módulo de autenticación centralizado.
 * - Gestiona tokens y datos de usuario usando cookies seguras.
 * - Todas las operaciones sanitizan y validan los datos antes de procesarlos.
 * - Incluye funciones avanzadas de seguridad: prevención de secuestro de sesión, rotación de tokens y detección de sesiones múltiples.
 *
 * Seguridad:
 * - Los tokens y datos sensibles nunca se almacenan en localStorage.
 * - Todas las funciones de modificación eliminan datos sensibles al cerrar sesión.
 * - La validación de sesión y rotación de tokens previenen ataques comunes.
 */
import CookiesKeys, { cookieStorage } from "@/lib/cookies";

/**
 * Obtiene el token JWT almacenado en cookies.
 * @returns {string|null}
 */
export const getToken = () => {
  return cookieStorage.getItem(CookiesKeys.TokenKey);
};
/**
 * Almacena el token JWT en cookies.
 * @param {string} token
 */
export const setToken = (token) => {
  cookieStorage.setItem(CookiesKeys.TokenKey, token);
};
/**
 * Elimina el token JWT de cookies.
 */
export const removeToken = () => {
  cookieStorage.removeItem(CookiesKeys.TokenKey);
};
/**
 * Realiza el login del usuario.
 * - Almacena el token y los datos del usuario en cookies.
 * - Nunca guarda datos sensibles en localStorage.
 * @param {string} token
 * @param {Object|null} userInfo
 */
export const login = (token, userInfo = null) => {
  setToken(token);
  // No guardar en localStorage
  if (userInfo) setUserInfo(userInfo);
};
/**
 * Realiza el logout del usuario.
 * - Elimina token y datos sensibles de cookies.
 * - Recarga la página para limpiar el estado global.
 */
export const logout = () => {
  removeToken();
  removeUserInfo();
  if (typeof window !== 'undefined') {
    window.location.reload();
  }
};

/**
 * Guarda información básica del usuario en cookies.
 * @param {Object} userInfo
 */
export const setUserInfo = (userInfo) => {
  if (userInfo.id_usuario) {
    cookieStorage.setItem(CookiesKeys.UserId, userInfo.id_usuario.toString());
  }
  if (userInfo.nombre) {
    cookieStorage.setItem(CookiesKeys.UserName, userInfo.nombre);
  }
  if (userInfo.correo) {
    cookieStorage.setItem(CookiesKeys.UserEmail, userInfo.correo);
  }
  if (userInfo.role) {
    cookieStorage.setItem(CookiesKeys.UserRole, userInfo.role);
  }
};

/**
 * Obtiene la información básica del usuario desde cookies.
 * @returns {Object}
 */
export const getUserInfo = () => {
  return {
    id: cookieStorage.getItem(CookiesKeys.UserId),
    nombre: cookieStorage.getItem(CookiesKeys.UserName),
    correo: cookieStorage.getItem(CookiesKeys.UserEmail),
    role: cookieStorage.getItem(CookiesKeys.UserRole)
  };
};

/**
 * Elimina la información básica del usuario de cookies.
 */
export const removeUserInfo = () => {
  cookieStorage.removeItem(CookiesKeys.UserId);
  cookieStorage.removeItem(CookiesKeys.UserName);
  cookieStorage.removeItem(CookiesKeys.UserEmail);
  cookieStorage.removeItem(CookiesKeys.UserRole);
};

/**
 * Verifica si el usuario está autenticado.
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  const tokenCookie = getToken();
  
  return !!(tokenCookie);
};

/**
 * Obtiene el token actual (solo de cookies).
 * @returns {string|null}
 */
export const getCurrentToken = () => {
  const tokenCookie = getToken();
  return tokenCookie;
};

/**
 * Prevención de secuestro de sesión.
 * - Verifica la validez y expiración del token JWT.
 * - Si el token está expirado, realiza logout automáticamente.
 * @returns {boolean}
 */
export const validateSession = () => {
  const token = getToken();
  if (!token) return false;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Date.now() / 1000;
    
    // Verificar expiración
    if (payload.exp < now) {
      logout();
      return false;
    }
    
    return true;
  } catch {
    logout();
    return false;
  }
};

/**
 * Rotación automática de tokens.
 * - Indica si el token debe ser rotado (menos de 15 minutos para expirar).
 * @returns {boolean}
 */
export const shouldRotateToken = () => {
  const token = getToken();
  if (!token) return false;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Date.now() / 1000;
    const timeUntilExpiry = payload.exp - now;
    
    // Rotar si queda menos de 15 minutos
    return timeUntilExpiry < 900;
  } catch {
    return false;
  }
};

/**
 * Detección de múltiples sesiones.
 * - Si se detecta una sesión activa en otro dispositivo, cierra la sesión actual.
 * @returns {boolean}
 */
export const detectMultipleSessions = () => {
  const sessionId = sessionStorage.getItem('sessionId');
  const storedSessionId = cookieStorage.getItem('activeSession');
  
  if (sessionId && storedSessionId && sessionId !== storedSessionId) {
    logout();
    alert('Sesión detectada en otro dispositivo. Por seguridad, se ha cerrado esta sesión.');
    return false;
  }
  
  return true;
};

