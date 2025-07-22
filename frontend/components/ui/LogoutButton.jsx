'use client';
import { useRouter } from 'next/navigation';
import { logout as authLogout } from '@/lib/auth';

export default function LogoutButton() {
  const router = useRouter();

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