'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { loginUser } from '@/lib/api';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { Button } from '@/components/ui/Button'; 
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';
import { login } from '@/lib/auth';

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
              <img src={qrCode} alt="QR 2FA" className="w-48 h-48 mx-auto" />
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

          <Button
            onClick={handleConfirm}
            disabled={loading || code.length !== 6}
            className="w-full h-12 text-base font-medium"
          >
            {loading ? 'Verificando...' : 'Confirmar Código'}
          </Button>

          <Button
            variant="outline"
            onClick={() => router.push('/login')}
            className="w-full h-10"
          >
            ← Volver al login
          </Button>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <div className="mt-6 p-3 bg-gray-100 rounded text-xs">
            <p><strong>Debug:</strong></p>
            <p>Usuario: {username}</p>
            <p>Código: {code} ({code.length}/6)</p>
            <p>QR: {qrCode ? 'Disponible' : 'No disponible'}</p>
          </div>

        {/* Layout de dos columnas */}
        <div className="grid md:grid-cols-2 gap-8 mt-8">
          
          {/* Columna izquierda - Instrucciones y QR */}
          <div className="space-y-6">
            
            
            {/* QR Code */}
            {qrCode && (
              <div className="flex justify-center">
                <div className="bg-white p-4 rounded-lg border-2 border-gray-300 shadow-sm">
                  <img 
                    src={qrCode} 
                    alt="QR 2FA" 
                    className="w-48 h-48" 
                  />
                </div>
              </div>
            )}
          </div>

          {/* Columna derecha - Formulario */}
          <div className="space-y-6">
            
            {/* Título del formulario */}
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Código de Verificación</h2>
            </div>

            {/* Input del código */}
            <div className="text-center">
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                maxLength={6}
                className="text-center text-2xl tracking-[0.5rem] h-16 text-gray-900"
                style={{ letterSpacing: '0.5rem' }}
              />
              
              {/* Ojo para mostrar/ocultar */}
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-gray-400">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
            </div>

            {/* Error */}
            {error && (
              <Alert type="error" className="text-sm">
                {error}
              </Alert>
            )}

            {/* Botón Confirmar */}
            <Button 
              onClick={handleConfirm} 
              disabled={loading || code.length !== 6} 
              className={`w-full h-14 text-lg font-semibold rounded-lg transition-all duration-200 ${
                code.length === 6 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {loading ? 'Verificando...' : 'Confirmar Código'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
