import CookiesKeys, { cookieStorage } from "@/lib/cookies";


export const getToken = () => {
  return cookieStorage.getItem(CookiesKeys.TokenKey);
};

export const setToken = (token) => {
  cookieStorage.setItem(CookiesKeys.TokenKey, token);
};

export const removeToken = () => {
  cookieStorage.removeItem(CookiesKeys.TokenKey);
};

export const login = (token, userInfo = null) => {
  setToken(token);
  // No guardar en localStorage
  if (userInfo) setUserInfo(userInfo);
};

export const logout = () => {
  removeToken();
  removeUserInfo();
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
  const tokenCookie = getToken();
  
  return !!(tokenCookie);
};

// Obtener el token más reciente (prioriza localStorage sobre cookies)
export const getCurrentToken = () => {
  const tokenCookie = getToken();
  return tokenCookie;
};


// #05 Prevención de secuestro de sesión
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

// #06 Rotación automática de tokens
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

// #07 Detección de múltiples sesiones
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

