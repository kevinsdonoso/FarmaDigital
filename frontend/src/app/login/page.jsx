'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Lock, Mail, Phone, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    correo: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otpModal, setOtpModal] = useState({
    isOpen: false,
    phone: '',
    code: '',
    timeLeft: 300,
    canResend: false
  });
  const [tempUserData, setTempUserData] = useState(null);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        if (data.user.mfa_activado) {
          setTempUserData(data);
          setOtpModal({
            ...otpModal,
            isOpen: true,
            phone: data.user.celular,
            timeLeft: 300
          });
          startCountdown();
        } else {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          redirectUser(data.user);
        }
      } else {
        setError(data.message || 'Error en el inicio de sesión');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const startCountdown = () => {
    const timer = setInterval(() => {
      setOtpModal(prev => {
        if (prev.timeLeft <= 1) {
          clearInterval(timer);
          return { ...prev, timeLeft: 0, canResend: true };
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: tempUserData.user.id_usuario,
          code: otpModal.code,
          phone: otpModal.phone
        })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', tempUserData.token);
        localStorage.setItem('user', JSON.stringify(tempUserData.user));
        setOtpModal({ ...otpModal, isOpen: false });
        redirectUser(tempUserData.user);
      } else {
        setError(data.message || 'Código OTP inválido');
      }
    } catch (err) {
      setError('Error al verificar el código');
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    try {
      await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: tempUserData.user.id_usuario,
          phone: otpModal.phone
        })
      });
      
      setOtpModal({
        ...otpModal,
        timeLeft: 300,
        canResend: false
      });
      startCountdown();
    } catch (err) {
      setError('Error al reenviar el código');
    }
  };

  const redirectUser = (user) => {
    switch (user.rol) {
      case 'vendedor':
        router.push('/products');
        break;
      case 'auditor':
        router.push('/audit');
        break;
      default:
        router.push('/dashboard');
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const maskPhone = (phone) => {
    if (!phone) return '';
    return phone.replace(/(\d{3})\d{3}(\d{4})/, '$1***$2');
  };


 return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="mx-auto h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center">
            <Lock className="h-5 w-5 text-white" />
          </div>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">
            FarmaDigital
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Iniciar Sesión
          </p>
        </div>

        <div className="bg-white py-6 px-6 shadow rounded-lg">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md flex items-center">
              <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="correo" className="block text-sm font-medium text-gray-700 mb-1">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  id="correo"
                  name="correo"
                  type="email"
                  required
                  value={formData.correo}
                  onChange={handleChange}
                  className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="correo@ejemplo.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-9 pr-10 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Contraseña"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Link 
                href="/forgot-password"
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Iniciando sesión...
                </div>
              ) : (
                'Iniciar Sesión'
              )}
            </button>

            <div className="text-center">
              <span className="text-sm text-gray-600">¿No tienes cuenta? </span>
              <Link 
                href="/register"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Regístrate
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Modal OTP igual que antes */}
      {otpModal.isOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="text-center space-y-4">
                <div className="mx-auto h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Phone className="h-6 w-6 text-green-600" />
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Código de Verificación
                  </h3>
                  <p className="text-sm text-gray-600">
                    Se ha enviado un código de 6 dígitos al número
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    {maskPhone(otpModal.phone)}
                  </p>
                </div>

                <form onSubmit={handleOtpSubmit} className="space-y-4">
                  <div>
                    <input
                      type="text"
                      value={otpModal.code}
                      onChange={(e) => setOtpModal({ ...otpModal, code: e.target.value })}
                      maxLength={6}
                      className="w-full px-3 py-2 text-center text-lg tracking-widest border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="000000"
                      required
                    />
                  </div>

                  <div className="text-sm text-gray-600">
                    {otpModal.timeLeft > 0 ? (
                      <span>Código válido por: {formatTime(otpModal.timeLeft)}</span>
                    ) : (
                      <span className="text-red-600">El código ha expirado</span>
                    )}
                  </div>

                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={resendOtp}
                      disabled={!otpModal.canResend}
                      className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      Reenviar código
                    </button>
                    <button
                      type="submit"
                      disabled={loading || otpModal.timeLeft === 0}
                      className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      {loading ? 'Verificando...' : 'Verificar'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}