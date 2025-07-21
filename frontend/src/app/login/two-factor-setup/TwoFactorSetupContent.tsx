'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/lib/api';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { Alert } from '@/components/ui/Alert';
import { login } from '@/lib/auth';
import Image from 'next/image';


export default function TwoFactorSetupContent() {
  const [code, setCode] = useState('');
  const [qrCode, setQrCode] = useState('');
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
    const { username, password, qr } = JSON.parse(pendingLogin);
    setUsername(username);
    setPassword(password);
    setQrCode(qr);
  }, [router]);

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
        sessionStorage.removeItem('pendingLogin');
        router.push('/dashboard');
      } else if (res.requires2FA) {
        setError('Código 2FA inválido. Verifica que el código sea correcto y que tu aplicación esté sincronizada.');
      } else if (res.success) {
        login(res.access_token, res.user_info);
        sessionStorage.removeItem('pendingLogin');
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
  // ...dentro del componente, antes del return...

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value.replace(/\D/g, '').slice(0, 6));
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Columna izquierda - Instrucciones y QR */}
          <div className="space-y-6 flex-1 flex flex-col justify-center">
            <div className="text-center mb-4">
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
              <div className="flex justify-center">
                <div className="bg-white p-4 rounded-lg border-2 border-gray-300 shadow-sm">
                  <Image 
                    src={qrCode} 
                    alt="QR 2FA" 
                    width={192} 
                    height={192} 
                    className="w-48 h-48"
                  />
                </div>
                <p className="text-xs text-gray-600 mt-2">Escanea con tu app de autenticación</p>
              </div>
            )}
          </div>

          {/* Columna derecha - Formulario */}
          <div className="space-y-6 flex-1 flex flex-col justify-center">
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Código de Verificación</h2>
            </div>
            <PasswordInput
              label="Código de Verificación"
              value={code}
              onChange={handleCodeChange}
              placeholder="000000"
              maxLength={6}
              required
            />
            {error && (
              <Alert type="error" className="text-sm">
                {error}
              </Alert>
            )}
            {/* Reemplaza el primer Button */}
            <div
              role="button"
              tabIndex={0}
              onClick={handleConfirm}
              className={`w-full h-14 text-lg font-semibold rounded-lg transition-all duration-200 flex items-center justify-center cursor-pointer ${
                loading || code.length !== 6
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
              style={{ pointerEvents: loading || code.length !== 6 ? 'none' : 'auto' }}
            >
              {loading ? 'Verificando...' : 'Confirmar Código'}
            </div>
            {/* Reemplaza el segundo Button */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => router.push('/login')}
              className="w-full h-10 flex items-center justify-center rounded-lg border border-blue-500 bg-white text-blue-500 hover:bg-blue-50 font-medium cursor-pointer transition-colors"
            >
              ← Volver al login
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}