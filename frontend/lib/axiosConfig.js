/**
 * Configuración centralizada de Axios para la aplicación.
 * - Agrega automáticamente el token JWT a cada request.
 * - Cambia el Content-Type según el tipo de datos enviados.
 * - Maneja errores de autenticación de forma segura y centralizada.
 *
 * Seguridad:
 * - El token se obtiene solo de cookies seguras (nunca localStorage).
 * - Si el token expira o es inválido, se elimina y se redirige al login.
 * - Nunca expone datos sensibles en los headers si no hay token.
 */
import axios from 'axios';
import { getCurrentToken, logout } from '@/lib/auth';
import { BASE_URL } from '@/lib/config';

// Configurar la instancia base de Axios
const configureApiService = () => {
  // Configurar URL base
  axios.defaults.baseURL = BASE_URL;
  
  // Configurar headers por defecto
  axios.defaults.headers.common['Content-Type'] = 'application/json';
  axios.defaults.headers.common['Accept'] = 'application/json';

  /**
   * Interceptor para requests
   * - Agrega el token JWT en el header Authorization si existe.
   * - Cambia el Content-Type si el cuerpo es FormData.
   */
  axios.interceptors.request.use(
    (config) => {
      // Obtener el token actual
      const token = getCurrentToken();
      
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }

      // Si el cuerpo de la solicitud es un FormData, cambiar el Content-Type
      if (config.data instanceof FormData) {
        config.headers['Content-Type'] = 'multipart/form-data';
      }
      
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  /**
   * Interceptor para responses
   * - Maneja errores de autenticación (401/403) de forma segura.
   * - Elimina el token y redirige al login si la sesión expira o es inválida.
   */
  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      // Si el token expiró o no es válido (401 o 403)
      if (error.response?.status === 401 || error.response?.status === 403) {
        console.warn('Sesión expirada o sin autorización. Redirigiendo al login...');
        
        // Hacer logout y redirigir
        logout();
        
        // Redirigir al login si no estamos ya ahí
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
      
      return Promise.reject(error);
    }
  );
};

// Inicializar configuración
configureApiService();

export default configureApiService;
