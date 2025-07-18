'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { loginUser } from '@/lib/api';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';

export default function TwoFactorPage() {
  const [code, setCode] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const usernameParam = searchParams.get('username');
    const passwordParam = searchParams.get('password');
    
    if (!usernameParam || !passwordParam) {
      router.push('/login');
      return;
    }
    
    setUsername(usernameParam);
    setPassword(passwordParam);
  }, [searchParams, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const requestData = {
        username,
        password,
        twoFactorCode: code,
      };
      
      console.log('🔐 Enviando datos para verificación 2FA (two-factor):', requestData);
      
      const res = await loginUser(requestData);
      
      console.log('📝 Respuesta COMPLETA del servidor (two-factor):', JSON.stringify(res, null, 2));

      // 🔥 NUEVA LÓGICA: Verificar si hay access_token (login exitoso)
      if (res.access_token) {
        console.log('✅ Login exitoso con 2FA - Token recibido');
        localStorage.setItem('token', res.access_token);
        localStorage.setItem('user', JSON.stringify(res.user_info));
        router.push('/dashboard');
      } else if (res.requires2FA === true) {
        console.log('❌ Código 2FA incorrecto o inválido');
        setError('Código 2FA inválido. Verifica que el código sea correcto y que tu aplicación esté sincronizada.');
      } else if (res.error) {
        console.log('❌ Error del servidor:', res.error);
        setError(res.error);
      } else if (res.success === true) {
        // Fallback por si acaso viene con success
        console.log('✅ Login exitoso con 2FA - Success flag');
        localStorage.setItem('token', res.access_token);
        localStorage.setItem('user', JSON.stringify(res.user_info));
        router.push('/dashboard');
      } else {
        console.log('❌ Error desconocido - respuesta completa:', res);
        setError('Código inválido');
      }
    } catch (err) {
      console.error('💥 Error en verificación 2FA:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error de conexión';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 w-full min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg border border-gray-200 p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Verificar Código 2FA</h1>
          <p className="text-gray-600">Ingresa el código de tu aplicación autenticadora</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <PasswordInput
            label="Código de Verificación"
            name="code"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="Ingresa tu código de 6 dígitos"
            className="text-center text-lg tracking-widest"
            maxLength={6}
            showToggle={false}
            required
          />

          {error && (
            <Alert type="error">
              {error}
            </Alert>
          )}

          <Button 
            type="submit"
            disabled={loading || code.length !== 6} 
            className="w-full h-12 text-base font-medium"
            loading={loading}
          >
            {loading ? 'Verificando...' : 'Verificar Código'}
          </Button>

          <Button 
            variant="outline"
            type="button"
            onClick={() => router.push('/login')} 
            className="w-full h-10"
          >
            ← Volver al login
          </Button>
        </form>

        {/* Debug info en desarrollo */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-6 p-3 bg-gray-100 rounded text-xs">
            <p><strong>Debug:</strong></p>
            <p>Usuario: {username}</p>
            <p>Código: {'•'.repeat(code.length)} ({code.length}/6)</p>
            <p>Longitud válida: {code.length === 6 ? '✅' : '❌'}</p>
          </div>
        )}
      </div>
    </div>
  );
}