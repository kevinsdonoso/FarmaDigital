'use client';
/**
 * Botón seguro para cerrar sesión del usuario.
 * - Utiliza la función centralizada de logout para limpiar tokens y datos sensibles.
 * - Redirige al usuario a la pantalla de login tras cerrar sesión.
 * - El diseño es accesible y responsivo.
 */
import { useRouter } from 'next/navigation';
import { logout as authLogout } from '@/lib/auth';

export default function LogoutButton() {
  const router = useRouter();
  /**
   * handleLogout
   * Llama a la función de logout centralizada para limpiar la sesión de forma segura.
   * Redirige al usuario al login tras cerrar sesión.
   */
  const handleLogout = () => {
    authLogout(); 
    setUser(null);
    setIsLoggedIn(false);
    router.push('/login'); 
  }; 

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-semibold transition"
    >
      Cerrar sesión
    </button>
  ); 
}