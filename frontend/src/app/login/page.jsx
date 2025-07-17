'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Lock, Mail, Phone, AlertCircle, QrCode, Copy, Check } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { loginUser } from '../../../lib/api';

export default function LoginPage() {
  const router = useRouter();
  const { login, setLoading: setAuthLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    twoFactorCode: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState('login'); // 'login', 'qr-setup', '2fa-verify'
  const [qrCode, setQrCode] = useState('');
  const [copied, setCopied] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Limpiar error cuando el usuario escriba
    if (error) setError('');
  };

  const handleTwoFactorCodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6); // Solo números, máximo 6
    setFormData({
      ...formData,
      twoFactorCode: value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAuthLoading(true);
    setError('');

    try {
      const requestData = {
        username: formData.username,
        password: formData.password
      };

      // Solo agregar twoFactorCode si estamos en el paso de verificación
      if (step === '2fa-verify' && formData.twoFactorCode) {
        requestData.twoFactorCode = formData.twoFactorCode;
      }

      console.log('Enviando datos:', requestData); // Debug

      const result = await loginUser(requestData);

      console.log('Resultado del login:', result); // Debug

      if (result.requires2FA) {
        if (result.qrCode) {
          // Primera vez - mostrar QR dinámico para configurar
          console.log('QR recibido:', result.qrCode); // Debug
          setQrCode(result.qrCode);
          setStep('qr-setup');
          setError('Configura tu autenticación 2FA escaneando el código QR');
        } else {
          // Ya tiene 2FA configurado - solicitar código
          setStep('2fa-verify');
          setError('Ingresa el código de tu aplicación de autenticación');
        }
      } else if (result.success) {
        // Login exitoso
        localStorage.setItem('token', result.access_token);
        login(result.user_info);
        router.push('/dashboard');
      } else {
        setError(result.message || 'Error en el login');
      }
    } catch (err) {
      console.error('Error en login:', err); // Debug
      setError(err.message || 'Error de conexión con el servidor');
    } finally {
      setLoading(false);
      setAuthLoading(false);
    }
  };

  const handleQrSetupComplete = () => {
    // Después de escanear QR, ir al paso de verificación
    setStep('2fa-verify');
    setError('Ahora ingresa el código de 6 dígitos de tu aplicación');
  };

  const handleBackToCredentials = () => {
    setStep('login');
    setFormData({ username: '', password: '', twoFactorCode: '' });
    setQrCode('');
    setError('');
  };

  // Función para copiar el enlace QR
  const copyQrLink = async () => {
    try {
      await navigator.clipboard.writeText(qrCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  const renderLoginForm = () => (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {/* Username */}
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
          DNI o Correo electrónico
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            id="username"
            name="username"
            type="text"
            required
            value={formData.username}
            onChange={handleChange}
            className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            placeholder="DNI o correo@ejemplo.com"
          />
        </div>
      </div>

      {/* Password */}
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

      {/* Links */}
      <div className="flex items-center justify-between">
        <Link 
          href="/forgot-password"
          className="text-sm font-medium text-blue-600 hover:text-blue-500"
        >
          ¿Olvidaste tu contraseña?
        </Link>
      </div>

      {/* Submit Button */}
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

      {/* Register Link */}
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
  );

  const renderQrSetup = () => (
    <div className="space-y-4">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <QrCode className="h-6 w-6 text-blue-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Configurar Autenticación 2FA
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Escanea este código QR con tu aplicación de autenticación
        </p>
        
        {qrCode && (
          <>
            <div className="flex justify-center mb-4">
              <img 
                src={qrCode} 
                alt="Código QR para 2FA" 
                className="border-2 border-gray-300 rounded-lg"
                style={{ maxWidth: '200px', maxHeight: '200px' }}
              />
            </div>

            {/* Mostrar enlace QR para debug/manual */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-2">Enlace QR (para debug):</p>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={qrCode}
                  readOnly
                  className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded bg-white"
                />
                <button
                  type="button"
                  onClick={copyQrLink}
                  className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center space-x-1"
                >
                  {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  <span>{copied ? 'Copiado' : 'Copiar'}</span>
                </button>
              </div>
            </div>
          </>
        )}

        <div className="text-xs text-gray-500 mb-4">
          Usa Google Authenticator, Authy, o cualquier app de autenticación
        </div>
      </div>

      <button
        onClick={handleQrSetupComplete}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
      >
        Ya escaneé el código QR
      </button>

      <div className="text-center">
        <button
          type="button"
          onClick={handleBackToCredentials}
          className="text-sm font-medium text-blue-600 hover:text-blue-500"
        >
          ← Volver al login
        </button>
      </div>
    </div>
  );

  const render2FAVerification = () => (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="text-center mb-4">
        <div className="mx-auto h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <Phone className="h-6 w-6 text-green-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Verificación 2FA
        </h3>
        <p className="text-sm text-gray-600">
          Ingresa el código de 6 dígitos de tu aplicación
        </p>
      </div>

      <div>
        <label htmlFor="twoFactorCode" className="block text-sm font-medium text-gray-700 mb-1">
          Código de autenticación
        </label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            id="twoFactorCode"
            name="twoFactorCode"
            type="text"
            value={formData.twoFactorCode}
            onChange={handleTwoFactorCodeChange}
            maxLength={6}
            className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-center text-lg font-mono"
            placeholder="000000"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || formData.twoFactorCode.length !== 6}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Verificando...
          </div>
        ) : (
          'Verificar código'
        )}
      </button>

      <div className="text-center">
        <button
          type="button"
          onClick={handleBackToCredentials}
          className="text-sm font-medium text-blue-600 hover:text-blue-500"
        >
          ← Volver al login
        </button>
      </div>
    </form>
  );

  const getTitle = () => {
    switch (step) {
      case 'qr-setup': return 'Configurar 2FA';
      case '2fa-verify': return 'Verificación 2FA';
      default: return 'Iniciar Sesión';
    }
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
            {getTitle()}
          </p>
        </div>

        <div className="bg-white py-6 px-6 shadow rounded-lg">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md flex items-center">
              <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {step === 'login' && renderLoginForm()}
          {step === 'qr-setup' && renderQrSetup()}
          {step === '2fa-verify' && render2FAVerification()}
        </div>
      </div>
    </div>
  );
}