/**
 * Hook de protección de rutas para la aplicación.
 * - Verifica si el usuario tiene acceso según los roles permitidos.
 * - Redirige de forma segura si el usuario no está autorizado.
 * - Previene fugas de información y acceso indebido.
 *
 * Seguridad:
 * - Utiliza la función centralizada getUserFromToken para obtener el usuario autenticado.
 * - Solo permite acceso si el rol está incluido en allowedRoles.
 * - Redirige a la página principal o login si no está autorizado.
 */
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserFromToken } from '@/lib/api';
/**
 * useRouteGuard
 * Hook para proteger rutas según roles permitidos.
 * @param {Object} params
 * @param {Array} params.allowedRoles - Array de roles permitidos (números)
 * @returns {string} status - "loading", "authorized" o "unauthorized"
 */
export function useRouteGuard({ allowedRoles = [] }) {
  const router = useRouter();
  const [status, setStatus] = useState("loading"); 

  useEffect(() => {
    let isMounted = true;
    /**
     * checkAccess
     * Verifica el acceso del usuario autenticado.
     * - Sanitiza y valida el rol antes de permitir acceso.
     * - Redirige si el usuario no cumple con los roles requeridos.
     */
    async function checkAccess() {
      try {
        const res = await getUserFromToken();
        // Obtiene el id de rol de forma segura
        const idRol = res.idRol || res.id_rol || res.roleId || res.rolId;
        if (allowedRoles.includes(Number(idRol))) {
          if (isMounted) setStatus("authorized");
        } else {
          if (isMounted) setStatus("unauthorized");
          router.replace("/");
        }
      } catch (err) {
        if (isMounted) setStatus("unauthorized");
        router.replace("/login");
      }
    }
    checkAccess();
    return () => { isMounted = false; };
  }, [router, allowedRoles]);

  return status;
}