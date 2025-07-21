'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image'; 
import { loginUser } from '@/lib/api';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { Alert } from '@/components/ui/Alert';
import { login } from '@/lib/auth';

export default function TwoFactorSetupContent() {
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
      const res = await loginUser({
        username,
        password,
        twoFactorCode: code,
      });

      if (res.access_token) {
        login(res.access_token, res.user_info);
        router.push('/dashboard');
      } else if (res.requires2FA) {
        setError('Código 2FA inválido. Verifica que el código sea correcto y que tu aplicación esté sincronizada.');
      } else if (res.success) {
        login(res.access_token, res.user_info);
        router.push('/dashboard');
      } else {
        setError(res.message || 'Error en la verificación 2FA');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error de conexión';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg border border-gray-200 p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Configura tu 2FA</h1>
          <p className="text-gray-600">Autenticación de dos factores</p>
        </div>

        <Alert type="info" className="mb-6">
          <div>
            <h3 className="font-medium text-blue-900 mb-2">Instrucciones:</h3>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Descarga Google Authenticator o Authy</li>
              <li>Escanea el código QR</li>
              <li>Ingresa el código de 6 dígitos que aparece</li>
            </ol>
          </div>
        </Alert>

        {qrCode && (
          <div className="text-center mb-6">
            <div className="bg-white p-4 rounded-lg border-2 border-gray-200 inline-block">
              {/* ✅ ARREGLADO: Usar Next.js Image en lugar de img */}
              <Image 
                src={qrCode} 
                alt="QR 2FA" 
                width={192}
                height={192}
                className="mx-auto"
                unoptimized // Para QR codes base64
              />
            </div>
            <p className="text-xs text-gray-600 mt-2">Escanea con tu app de autenticación</p>
          </div>
        )}

        <div className="space-y-6">
          <PasswordInput
            label="Código de Verificación"
            value={code}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setCode(e.target.value.replace(/\D/g, '').slice(0, 6))
            }
            placeholder="000000"
            maxLength={6}
            required
          />

          {error && <Alert type="error">{error}</Alert>}

          {/* ✅ BOTÓN ARREGLADO - usando button HTML */}
          <button
            onClick={handleConfirm}
            disabled={loading || code.length !== 6}
            className="w-full h-12 text-base font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Verificando...' : 'Confirmar Código'}
          </button>

          {/* ✅ BOTÓN ARREGLADO - usando button HTML */}
          <button
            onClick={() => router.push('/login')}
            className="w-full h-10 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            ← Volver al login
          </button>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <div className="mt-6 p-3 bg-gray-100 rounded text-xs">
            <p><strong>Debug:</strong></p>
            <p>Usuario: {username}</p>
            <p>Código: {code} ({code.length}/6)</p>
            <p>QR: {qrCode ? 'Disponible' : 'No disponible'}</p>
          </div>
        )}
      </div>
    </div>
  );
}