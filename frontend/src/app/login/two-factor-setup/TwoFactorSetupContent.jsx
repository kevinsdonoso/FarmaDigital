'use client';
/**
 * Componente para la configuración segura de 2FA en el login.
 * - Valida y sanitiza todos los datos antes de procesarlos.
 * - Aplica rate limiting para prevenir abuso y ataques automatizados.
 * - El diseño previene fugas de información y asegura la integridad de los datos.
 *
 * Seguridad:
 * - Los datos temporales de login se validan y sanitizan antes de usarse.
 * - El QR se valida como data URL o fuente segura.
 * - El código 2FA se sanitiza y valida antes de enviarse.
 * - El rate limiting previene intentos de fuerza bruta y spam.
 * - Los errores se muestran de forma segura y nunca exponen información sensible.
 */
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/lib/api';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { Alert } from '@/components/ui/Alert';
import { login } from '@/lib/auth';
import Image from 'next/image';
import { getUserFromToken } from '@/lib/api';

import { sanitizeInput, checkRateLimit, validateUserInput } from '@/lib/security';

export default function TwoFactorSetupContent() {
  const [code, setCode] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const validateAndLoadSetupData = () => {
      try {
        const pendingLogin = sessionStorage.getItem('pendingLogin');
        
        if (!pendingLogin) {
          console.warn('No hay datos de setup 2FA');
          router.push('/login');
          return;
        }
        const loginData = JSON.parse(pendingLogin);
        // Validar estructura del la respuesta
        if (!loginData.username || !loginData.qr || !loginData.password) {
          console.warn('Datos de setup incompletos');
          sessionStorage.removeItem('pendingLogin');
          router.push('/login');
          return;
        }

        // Validar timestamp
        if (loginData.timestamp && (Date.now() - loginData.timestamp) > 900000) {
          console.warn('Sesión de setup 2FA expirada');
          sessionStorage.removeItem('pendingLogin');
          router.push('/login');
          return;
        }

        // Validar hash temporal
        const expectedHash = btoa(loginData.username + loginData.password + loginData.timestamp).slice(-16);
        if (loginData.tempHash !== expectedHash) {
          console.warn('Datos de sesión comprometidos');
          sessionStorage.removeItem('pendingLogin');
          router.push('/login');
          return;
        }

        // sanitizar y establecer datos
        setUsername(sanitizeInput(loginData.username));
        setPassword(loginData.password); 
        
        // validar y sanitizar QR
        if (
          loginData.qr.startsWith('data:image/') ||
          loginData.qr.startsWith('http://api.qrserver.com') ||
          loginData.qr.startsWith('https://api.qrserver.com')
        ) {
          setQrCode(loginData.qr);
        } else {
          console.warn('QR code inválido');
          router.push('/login');
        }
        
      } catch (error) {
        console.error('Error al cargar datos de setup:', error);
        sessionStorage.removeItem('pendingLogin');
        router.push('/login');
      }
    };
    validateAndLoadSetupData();
  }, [router]);

  /**
   * handleCodeChange
   * Sanitiza y valida el código 2FA en tiempo real.
   * Aplica rate limiting para cambios rápidos.
   */
  const handleCodeChange = (e) => {
    const value = e.target.value;
    
    const sanitizedCode = sanitizeInput(value).replace(/\D/g, '').slice(0, 6);
    
    // Rate limiting para cambios de código
    if (!checkRateLimit('2fa_code_input', 20, 10000)) {
      return;
    }

    setCode(sanitizedCode);
    
    // Limpiar error cuando el usuario escribe
    if (error && sanitizedCode.length > 0) {
      setError('');
    }
  };

  /**
   * handleConfirm
   * Envía el código 2FA de forma segura.
   * - Aplica rate limiting para intentos de setup.
   * - Valida el código y limita los intentos.
   */
  const handleConfirm = async () => {
    if (!checkRateLimit('2fa_setup_attempt', 5, 300000)) {
      setError('Demasiados intentos de configuración. Espera 5 minutos.');
      return;
    }

    if (!validateUserInput(code, 'text', { minLength: 6, maxLength: 6 })) {
      setError('El código debe tener exactamente 6 dígitos');
      return;
    }

    if (attempts >= 3) {
      setError('Demasiados intentos fallidos. Vuelve a iniciar sesión.');
      sessionStorage.removeItem('pendingLogin');
      setTimeout(() => router.push('/login'), 2000);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const requestData = {
        username: username,
        password: password,         // CONTRASEÑA REQUERIDA
        twoFactorCode: sanitizeInput(code),
      };

      const res = await loginUser(requestData);

      if (res.access_token) {
        login(res.access_token, res.user_info);
        sessionStorage.removeItem('pendingLogin');
        
        const userData = await getUserFromToken();
        
        const roleRoutes = {
          1: '/audit',
          2: '/products', 
          3: '/dashboard'
        };
        
        const route = roleRoutes[userData.idRol] || '/dashboard';
        router.push(route);
        return;
        
      } else if (res.requires2FA === true) {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        setError(`Código 2FA inválido. Intento ${newAttempts}/3. Verifica que el código sea correcto.`);
        
      } else if (res.error) {
        setError(sanitizeInput(res.error));
        setAttempts(prev => prev + 1);
      } else {
        setError('Código inválido');
        setAttempts(prev => prev + 1);
      }
    } catch (err) {
      console.error('Error en verificación 2FA:', err);
      const errorMessage = sanitizeInput(err.message || 'Error de conexión');
      setError(errorMessage);
      setAttempts(prev => prev + 1);
    } finally {
      setLoading(false);
    }
  };

  /**
   * handleBackToLogin
   * Permite volver al login de forma segura y limpia los datos temporales.
   * Aplica rate limiting para prevenir abuso.
   */
  const handleBackToLogin = () => {
    if (!checkRateLimit('back_to_login_setup', 5, 30000)) {
      return;
    }

    sessionStorage.removeItem('pendingLogin');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg border border-gray-200 p-6">
            <button
              onClick={handleBackToLogin}
              disabled={loading}
              className="w-200 h-10 flex items-center justify-center rounded-lg border border-blue-500 bg-white text-blue-500 hover:bg-blue-50 font-medium cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Volver al login
            </button>
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
              <div className="flex flex-col items-center">
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
              
              {attempts > 0 && (
                <div className="text-sm text-orange-600">
                  Intentos restantes: {3 - attempts}
                </div>
              )}
            </div>
            
            <PasswordInput
              label="Código de Verificación"
              value={code}
              onChange={handleCodeChange}
              placeholder="000000"
              maxLength={6}
              className="text-center text-lg tracking-widest"
              showToggle={false}
              required
            />
            <div className="text-xs text-gray-500 text-center">
              {code.length}/6 dígitos
            </div>
            
            {error && (
              <Alert type="error" className="text-sm">
                {error}
              </Alert>
            )}
            <button
              onClick={handleConfirm}
              disabled={loading || code.length !== 6 || attempts >= 3}
              className={`w-full h-14 text-lg font-semibold rounded-lg transition-all duration-200 flex items-center justify-center ${
                loading || code.length !== 6 || attempts >= 3
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
              }`}
            >
              {loading ? 'Verificando...' : 'Confirmar Código'}
            </button>
            
          </div>
        </div>
      </div>
    </div>
  );
}