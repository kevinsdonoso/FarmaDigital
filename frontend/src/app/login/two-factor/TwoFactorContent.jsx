'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/lib/api';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { login } from '@/lib/auth';
import { getUserFromToken } from '@/lib/api';

export default function TwoFactorContent() {
  const [code, setCode] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const pendingLogin = sessionStorage.getItem('pendingLogin');
    if (!pendingLogin) {
      router.push('/login');
      return;
    }
    const { username, password } = JSON.parse(pendingLogin);
    setUsername(username);
    setPassword(password);
  }, [router]);

  
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

      const res = await loginUser(requestData);

      if (res.access_token) {
        login(res.access_token, res.user_info);
        sessionStorage.removeItem('pendingLogin');
        const userData = await getUserFromToken();
        if (userData.idRol === 2) {
          router.push('/products');
        } else if (userData.idRol === 1) {
          router.push('/audit');
        } else if (userData.idRol === 3) {
          router.push('/dashboard');
        } else {
          router.push('/');
        }
        return;
      } else if (res.requires2FA === true) {
        setError('Código 2FA inválido. Verifica que el código sea correcto y que tu aplicación esté sincronizada.');
      } else if (res.error) {
        setError(res.error);
      } else {
        setError('Código inválido');
      }
    } catch (err) {
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
      </div>
    </div>
  );
}