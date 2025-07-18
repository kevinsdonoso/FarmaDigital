'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { loginUser } from '@/lib/api';

export default function TwoFactorSetupPage() {
  const [code, setCode] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const usernameParam = searchParams.get('username');
    const passwordParam = searchParams.get('password');
    const qrParam = searchParams.get('qr');
    
    if (!usernameParam || !passwordParam || !qrParam) {
      router.push('/login');
      return;
    }
    
    setUsername(usernameParam);
    setPassword(passwordParam);
    setQrCode(qrParam);
  }, [searchParams, router]);

  const handleConfirm = async () => {
    setLoading(true);
    setError('');

    try {
      // Debug: mostrar exactamente qué se está enviando
      const requestData = {
        username,
        password,
        twoFactorCode: code,
      };
      
      console.log('Enviando datos para verificación 2FA:', requestData);
      
      const res = await loginUser(requestData);
      
      console.log('Respuesta del servidor después de 2FA:', res);

      if (res.success) {
        console.log('Login exitoso con 2FA');
        localStorage.setItem('token', res.access_token);
        localStorage.setItem('user', JSON.stringify(res.user_info));
        router.push('/dashboard');
      } else if (res.requires2FA) {
        // Si sigue requiriendo 2FA, significa que el código es incorrecto
        console.log('Código 2FA incorrecto o inválido');
        setError('Código 2FA inválido. Verifica que el código sea correcto y que tu aplicación esté sincronizada.');
      } else {
        console.log('Error en respuesta:', res);
        setError(res.message || 'Error en la verificación 2FA');
      }
    } catch (err) {
      console.error('Error en verificación 2FA:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error de conexión';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-semibold mb-4">Configura tu 2FA</h1>
      
      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
        <h3 className="font-medium text-blue-900 mb-2">Instrucciones:</h3>
        <ol className="text-sm text-blue-800 space-y-1">
          <li>1. Descarga Google Authenticator o Authy</li>
          <li>2. Escanea el código QR</li>
          <li>3. Ingresa el código de 6 dígitos que aparece</li>
        </ol>
      </div>

      {qrCode && (
        <div className="text-center mb-4">
          <img src={qrCode} alt="QR 2FA" className="mb-2 w-[200px] h-[200px] mx-auto border" />
          <p className="text-xs text-gray-600">Escanea con tu app de autenticación</p>
        </div>
      )}

      <input
        type="text"
        placeholder="Código 2FA (6 dígitos)"
        value={code}
        onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
        className="border p-2 w-full mb-2 text-center text-lg font-mono"
        maxLength={6}
        required
      />

      {error && <div className="text-red-600 text-sm mb-2 p-2 bg-red-50 rounded">{error}</div>}

      {/* Debug info */}
      <div className="mb-4 p-2 bg-gray-100 rounded text-xs">
        <p><strong>Debug:</strong></p>
        <p>Usuario: {username}</p>
        <p>Código: {code} ({code.length}/6)</p>
      </div>

      <button 
        onClick={handleConfirm} 
        disabled={loading || code.length !== 6} 
        className="bg-green-600 text-white px-4 py-2 rounded w-full disabled:opacity-50 mb-2"
      >
        {loading ? 'Verificando...' : 'Confirmar Código'}
      </button>
      
      <button 
        onClick={() => router.push('/login')} 
        className="text-blue-600 hover:text-blue-800 w-full text-sm"
      >
        ← Volver al login
      </button>
    </div>
  );
}