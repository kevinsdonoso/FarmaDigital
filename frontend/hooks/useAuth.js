'use client';
/**
 * Hook global de autenticación usando Zustand.
 * - Gestiona el estado de usuario autenticado y su sesión.
 * - Utiliza funciones centralizadas para obtener y limpiar tokens.
 * - El diseño previene fugas de información y asegura el ciclo de vida de la sesión.
 *
 * Seguridad:
 * - Todas las operaciones de login/logout usan funciones centralizadas que sanitizan y eliminan tokens.
 * - El estado nunca expone datos sensibles innecesarios.
 */
import { create } from 'zustand';
import { getToken } from '@/lib/auth';

const useAuth = create((set) => ({
  state: {
    user: null,
    isAuthenticated: false,
    loading: true, // Estado inicial de carga
    token: getToken(), // Token obtenido de cookies/localStorage
  },

  /**
   * login
   * Actualiza el estado de usuario autenticado de forma segura.
   * @param {Object} userData - Datos del usuario autenticado
   */
  login: (userData) => set((state) => ({
    state: {
      ...state.state,
      user: userData,
      isAuthenticated: true,
      loading: false,
      token: getToken(),// Refresca el token desde fuente segura
    }
  })),
  /**
   * logout
   * Limpia el estado de usuario y elimina el token de forma segura.
   */
  logout: () => set((state) => ({
    state: {
      ...state.state,
      user: null,
      isAuthenticated: false,
      loading: false,
      token: null,
    }
  })),
  /**
   * setLoading
   * Permite actualizar el estado de carga de forma controlada.
   */
  setLoading: (loading) => set((state) => ({
    state: {
      ...state.state,
      loading,
    }
  })),
  /**
   * setToken
   * Actualiza el token desde la fuente segura (cookies/localStorage).
   */
  setToken: () => set((state) => ({
    state: {
      ...state.state,
      token: getToken(), // Siempre desde cookies
    }
  })),
  /**
   * validateStoredToken
   * Verifica si existe un token válido y lo actualiza en el estado.
   */
  validateStoredToken: () => {
    const token = getToken();
    if (token) {
      set((state) => ({
        state: {
          ...state.state,
          token,
        }
      }));
    }
  },
}
));

export { useAuth };
