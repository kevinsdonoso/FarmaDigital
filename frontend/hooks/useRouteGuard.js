import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserFromToken } from '@/lib/api';

export function useRouteGuard({ allowedRoles = [] }) {
  const router = useRouter();
  const [status, setStatus] = useState("loading"); 

  useEffect(() => {
    let isMounted = true;
    async function checkAccess() {
      try {
        const res = await getUserFromToken();
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