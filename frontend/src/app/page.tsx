// filepath: c:\Users\kelfi\OneDrive\Documentos\FarmaDigital\frontend\src\app\page.jsx
'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';

export default function HomePage() {
  const router = useRouter();
  const { state } = useAuth();

  useEffect(() => {
    // Verificar si hay un token almacenado
    const token = localStorage.getItem('token');
    
    if (token && state.isAuthenticated) {
      // Si hay token y está autenticado, ir al dashboard
      router.push('/dashboard');
    } else {
      // Si no hay token, ir al login
      router.push('/login');
    }
  }, [router, state.isAuthenticated]);

  // Mostrar loading mientras se determina la redirección
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">FarmaDigital</h1>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Cargando...</p>
      </div>
    </div>
  );
}