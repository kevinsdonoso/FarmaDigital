'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { loginUser } from '@/lib/api';

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

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await loginUser({
        username,
        password,
        twoFactorCode: code,
      });

      if (res.success) {
        localStorage.setItem('token', res.access_token);
        localStorage.setItem('user', JSON.stringify(res.user_info));
        router.push('/dashboard');
      } else {
        setError('Código inválido');
      }
    } catch (err) {
      setError(err.message || 'Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-semibold mb-4">Verificar Código 2FA</h1>
      <input
        type="text"
        placeholder="Código 2FA"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="border p-2 w-full mb-2"
        maxLength={6}
        required
      />
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <button 
        onClick={handleSubmit} 
        disabled={loading || code.length !== 6} 
        className="bg-green-600 text-white px-4 py-2 rounded w-full disabled:opacity-50"
      >
        {loading ? 'Verificando...' : 'Verificar'}
      </button>
      
      <button 
        onClick={() => router.push('/login')} 
        className="mt-2 text-blue-600 hover:text-blue-800 w-full"
      >
        ← Volver al login
      </button>
    </div>
  );
}