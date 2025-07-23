'use client';
/**
 * Componente para verificación segura de código 2FA en el login.
 * - Valida y sanitiza todos los datos antes de procesarlos.
 * - Aplica rate limiting para prevenir abuso y ataques automatizados.
 * - El diseño previene fugas de información y asegura la integridad de los datos.
 *
 * Seguridad:
 * - Los datos temporales de login se validan y sanitizan antes de usarse.
 * - El código 2FA se sanitiza y valida antes de enviarse.
 * - El rate limiting previene intentos de fuerza bruta y spam.
 * - Los errores se muestran de forma segura y nunca exponen información sensible.
 */
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/lib/api';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { login } from '@/lib/auth';
import { getUserFromToken } from '@/lib/api';

import { sanitizeInput, checkRateLimit, validateUserInput } from '@/lib/security';

export default function TwoFactorContent() {
  const [code, setCode] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const router = useRouter();

  useEffect(() => {
    /**
     * Carga y valida los datos temporales de login desde sessionStorage.
     * - Verifica estructura, integridad y expiración.
     * - Sanitiza los datos antes de usarlos.
     */
    const validateAndLoadPendingLogin = () => {
      try {
        const pendingLogin = sessionStorage.getItem('pendingLogin');    
        if (!pendingLogin) {
          console.warn('No hay datos de login pendiente');
          router.push('/login');
          return;
        }
        const loginData = JSON.parse(pendingLogin);
        
        // Validar estructura
        if (!loginData.username || !loginData.password) {
          console.warn('Datos de login incompletos');
          sessionStorage.removeItem('pendingLogin');
          router.push('/login');
          return;
        }

        // Validar timestamp (máx 10 min)
        if (loginData.timestamp && (Date.now() - loginData.timestamp) > 600000) {
          console.warn('Sesión de 2FA expirada');
          sessionStorage.removeItem('pendingLogin');
          router.push('/login');
          return;
        }

        // Validar integridad simple
        const expectedHash = btoa(loginData.username + loginData.password + loginData.timestamp).slice(-16);
        if (loginData.tempHash !== expectedHash) {
          console.warn('Datos de sesión comprometidos');
          sessionStorage.removeItem('pendingLogin');
          router.push('/login');
          return;
        }
        
        // Sanitizar datos antes de usar
        setUsername(sanitizeInput(loginData.username));
        setPassword(loginData.password);
        
      } catch (error) {
        console.error('Error al cargar datos de login:', error);
        sessionStorage.removeItem('pendingLogin');
        router.push('/login'); 
      }
    };

    validateAndLoadPendingLogin();
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
    if (error && sanitizedCode.length > 0) {
      setError('');
    }
  };

  /**
   * handleSubmit
   * Envía el código 2FA de forma segura.
   * - Aplica rate limiting para intentos de verificación.
   * - Valida el código y limita los intentos.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!checkRateLimit('2fa_attempt', 5, 300000)) {
      setError('Demasiados intentos de verificación. Espera 5 minutos.');
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
        password: password,  
        twoFactorCode: sanitizeInput(code),
      };

      const res = await loginUser(requestData);

      if (res.access_token) {
        login(res.access_token, res.user_info);
        sessionStorage.removeItem('pendingLogin');
        
        const userData = await getUserFromToken();
        
        // redireccionar según el rol del usuario
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
    if (!checkRateLimit('back_to_login', 5, 30000)) {
      return;
    }

    sessionStorage.removeItem('pendingLogin');
    router.push('/login');
  };


  return (
    <div className="flex-1 w-full min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg border border-gray-200 p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Verificar Código 2FA</h1>
          <p className="text-gray-600">Ingresa el código de tu aplicación autenticadora</p>
          
          {attempts > 0 && (
            <div className="mt-2 text-sm text-orange-600">
              Intentos restantes: {3 - attempts}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <PasswordInput
            label="Código de Verificación"
            name="code"
            value={code}
            onChange={handleCodeChange}
            placeholder="Ingresa tu código de 6 dígitos"
            className="text-center text-lg tracking-widest"
            maxLength={6}
            showToggle={false}
            required
          />

          <div className="text-xs text-gray-500 text-center">
            {code.length}/6 dígitos
          </div>

          {error && (
            <Alert type="error">
              {error}
            </Alert>
          )}

          <Button 
            type="submit"
            disabled={loading || code.length !== 6 || attempts >= 3} 
            className="w-full h-12 text-base font-medium"
            loading={loading}
          >
            {loading ? 'Verificando...' : 'Verificar Código'}
          </Button>

          <Button 
            variant="outline"
            type="button"
            onClick={handleBackToLogin}
            className="w-full h-10"
            disabled={loading}
          >
            ← Volver al login
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            ¿Problemas con el código? Verifica que tu aplicación esté sincronizada.
          </p>
        </div>
      </div>
    </div>
  );
}