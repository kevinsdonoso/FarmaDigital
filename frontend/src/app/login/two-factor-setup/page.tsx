'use client'
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../../hooks/useAuth';

// Definir tipos
interface Errors {
  code?: string;
  submit?: string;
}

export default function TwoFactorSetupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, setLoading } = useAuth();
  
  const [username, setUsername] = useState<string>('');
  const [qrCode, setQrCode] = useState<string>('');
  const [twoFactorCode, setTwoFactorCode] = useState<string>('');
  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    // Obtener parámetros de la URL
    const usernameParam = searchParams.get('username');
    const qrParam = searchParams.get('qr');
    
    if (usernameParam) setUsername(usernameParam);
    if (qrParam) setQrCode(qrParam);
    
    // Si no hay parámetros, redirigir al login
    if (!usernameParam || !qrParam) {
      router.push('/login');
    }
  }, [searchParams, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!twoFactorCode.trim()) {
      setErrors({ code: 'El código 2FA es requerido' });
      return;
    }

    if (twoFactorCode.length !== 6) {
      setErrors({ code: 'El código debe tener 6 dígitos' });
      return;
    }

    setIsSubmitting(true);
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5245/api/Auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: '', // No necesitamos password aquí para la verificación 2FA
          twoFactorCode: twoFactorCode
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Login exitoso, guardar token y redirigir
        localStorage.setItem('token', data.access_token || data.token);
        login(data.user_info || data.user);
        router.push('/dashboard');
      } else {
        setErrors({ code: data.error || data.message || 'Código 2FA inválido' });
      }
    } catch (error) {
      console.error('Error en verificación 2FA:', error);
      setErrors({ code: 'Error de conexión. Intenta nuevamente.' });
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6); // Solo números, máximo 6
    setTwoFactorCode(value);
    if (errors.code) {
      setErrors({ ...errors, code: '' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Configurar Autenticación 2FA
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Escanea el código QR con tu app de autenticación
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            {/* Código QR */}
            <div className="text-center">
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Paso 1: Escanea el código QR
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Usa Google Authenticator, Authy, o cualquier app de autenticación
                </p>
                {qrCode && (
                  <div className="flex justify-center">
                    <img 
                      src={qrCode} 
                      alt="Código QR para 2FA" 
                      className="border-2 border-gray-300 rounded-lg"
                      style={{ maxWidth: '200px', maxHeight: '200px' }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Formulario para código */}
            <form onSubmit={handleSubmit}>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Paso 2: Ingresa el código de verificación
                </h3>
                <label htmlFor="twoFactorCode" className="block text-sm font-medium text-gray-700">
                  Código de 6 dígitos
                </label>
                <div className="mt-1">
                  <input
                    id="twoFactorCode"
                    name="twoFactorCode"
                    type="text"
                    value={twoFactorCode}
                    onChange={handleCodeChange}
                    maxLength={6}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-center text-lg font-mono"
                    placeholder="000000"
                  />
                  {errors.code && <p className="mt-2 text-sm text-red-600">{errors.code}</p>}
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  disabled={isSubmitting || twoFactorCode.length !== 6}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isSubmitting ? 'Verificando...' : 'Verificar y Continuar'}
                </button>
              </div>
            </form>

            {/* Enlaces auxiliares */}
            <div className="text-center">
              <button
                onClick={() => router.push('/login')}
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                ← Volver al login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}