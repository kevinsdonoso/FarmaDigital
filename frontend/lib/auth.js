import CookiesKeys, { cookieStorage } from "./cookies";

// Obtener token desde localStorage
export const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(CookiesKeys.TokenKey);
  }
  return null;
};

// Guardar token en localStorage
export const setToken = (token) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(CookiesKeys.TokenKey, token);
  }
};

// Eliminar token de localStorage
export const removeToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(CookiesKeys.TokenKey);
  }
};

// Obtener token desde cookies
export const getTokenCookie = () => {
  return cookieStorage.getItem(CookiesKeys.TokenKey);
};

// Guardar token en cookies
export const setTokenCookie = (token) => {
  cookieStorage.setItem(CookiesKeys.TokenKey, token);
};

// Eliminar token de cookies
export const removeTokenCookie = () => {
  cookieStorage.removeItem(CookiesKeys.TokenKey);
};

// Función principal para hacer login (guarda en ambos lugares)
export const login = (token, userInfo = null) => {
  setToken(token);
  setTokenCookie(token);
  
  if (userInfo) {
    setUserInfo(userInfo);
  }
};

// Función principal para hacer logout (elimina de ambos lugares)
export const logout = () => {
  removeToken();
  removeTokenCookie();
  removeUserInfo();
  
  // Recargar la página para limpiar el estado
  if (typeof window !== 'undefined') {
    window.location.reload();
  }
};

// Guardar información del usuario
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

// Obtener información del usuario
export const getUserInfo = () => {
  return {
    id: cookieStorage.getItem(CookiesKeys.UserId),
    nombre: cookieStorage.getItem(CookiesKeys.UserName),
    correo: cookieStorage.getItem(CookiesKeys.UserEmail),
    role: cookieStorage.getItem(CookiesKeys.UserRole)
  };
};

// Eliminar información del usuario
export const removeUserInfo = () => {
  cookieStorage.removeItem(CookiesKeys.UserId);
  cookieStorage.removeItem(CookiesKeys.UserName);
  cookieStorage.removeItem(CookiesKeys.UserEmail);
  cookieStorage.removeItem(CookiesKeys.UserRole);
};

// Verificar si el usuario está autenticado
export const isAuthenticated = () => {
  const tokenLocal = getToken();
  const tokenCookie = getTokenCookie();
  
  return !!(tokenLocal || tokenCookie);
};

// Obtener el token más reciente (prioriza localStorage sobre cookies)
export const getCurrentToken = () => {
  const tokenLocal = getToken();
  const tokenCookie = getTokenCookie();
  
  return tokenLocal || tokenCookie;
};
