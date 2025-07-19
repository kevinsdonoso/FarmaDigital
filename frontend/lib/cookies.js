import { CookieStorage } from "cookie-storage";

// Definir las claves de las cookies
const CookiesKeys = {
  TokenKey: "tokenKey",
  UserId: "userId", 
  UserName: "userName",
  UserEmail: "userEmail",
  UserRole: "userRole"
};

// Configurar el almacenamiento de cookies
export const cookieStorage = new CookieStorage({
  path: "/",
  // Puedes agregar domain si tienes un dominio específico
  // domain: process.env.NEXT_PUBLIC_DOMAIN_COOKIE,
});

// Función para verificar si una cookie está disponible
export const cookieAvailable = (cookieKey, cookieValue) => {
  return cookieStorage.getItem(cookieKey) === cookieValue;
};

export default CookiesKeys;
