'use client'
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../../hooks/useAuth';
import { TwoFactorForm } from '../../../../components/auth/TwoFactorForm';

export default function TwoFactorSetupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, setLoading } = useAuth();

  const [username, setUsername] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const usernameParam = searchParams.get('username');
    const qrParam = searchParams.get('qr');
    if (usernameParam) setUsername(usernameParam);
    if (qrParam) setQrCode(qrParam);
    if (!usernameParam || !qrParam) router.push('/login');
  }, [searchParams, router]);

  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setTwoFactorCode(value);
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!twoFactorCode.trim() || twoFactorCode.length !== 6) {
      setError('El código debe tener 6 dígitos');
      return;
    }
    setIsSubmitting(true);
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5245/api/Auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          password: '',
          twoFactorCode
        }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.access_token || data.token);
        login(data.user_info || data.user);
        router.push('/dashboard');
      } else {
        setError(data.error || data.message || 'Código 2FA inválido');
      }
    } catch (err) {
      setError('Error de conexión. Intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
      setLoading(false);
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
          <TwoFactorForm
            qrCode={qrCode}
            twoFactorCode={twoFactorCode}
            onChange={handleChange}
            onSubmit={handleSubmit}
            loading={isSubmitting}
            error={error}
          />
          <div className="text-center mt-4">
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
  );
}