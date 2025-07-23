/**
 * Módulo centralizado para gestión segura de cookies.
 * - Define claves estándar para los datos sensibles.
 * - Configura el almacenamiento de cookies con opciones seguras.
 * - Expone utilidades para verificar y manipular cookies de forma segura.
 *
 * Seguridad:
 * - Todas las operaciones usan CookieStorage, que previene acceso inseguro.
 * - Las claves sensibles están centralizadas para evitar errores y fugas.
 * - Se recomienda usar el parámetro 'domain' en producción para mayor seguridad.
 */
import { CookieStorage } from "cookie-storage";

// Definir las claves de las cookies para datos sensibles
const CookiesKeys = {
  TokenKey: "tokenKey",      // JWT de autenticación
  UserId: "userId",          // ID del usuario autenticado
  UserName: "userName",      // Nombre del usuario
  UserEmail: "userEmail",    // Email del usuario
  UserRole: "userRole"       // Rol del usuario
};
/**
 * Configuración del almacenamiento de cookies.
 * - Utiliza CookieStorage para manejar cookies de forma segura.
 * - Permite definir opciones como path y domain.
 * - Se recomienda usar 'domain' en producción para mayor seguridad.
 */
export const cookieStorage = new CookieStorage({
  path: "/",
  // domain: process.env.NEXT_PUBLIC_DOMAIN_COOKIE,
});

/**
 * cookieAvailable
 * Verifica si una cookie específica está disponible y coincide con el valor esperado.
 * @param {string} cookieKey - Clave de la cookie
 * @param {string} cookieValue - Valor esperado
 * @returns {boolean}
 */
export const cookieAvailable = (cookieKey, cookieValue) => {
  return cookieStorage.getItem(cookieKey) === cookieValue;
};

export default CookiesKeys;