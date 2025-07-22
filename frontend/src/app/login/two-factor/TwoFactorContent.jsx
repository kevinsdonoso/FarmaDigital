'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/lib/api';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { login } from '@/lib/auth';
import { getUserFromToken } from '@/lib/api';

// ✨ IMPORTS DE SEGURIDAD
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
    // ✨ VALIDACIÓN SEGURA DE SESSION STORAGE
    const validateAndLoadPendingLogin = () => {
      try {
        const pendingLogin = sessionStorage.getItem('pendingLogin');
        
        if (!pendingLogin) {
          console.warn('No hay datos de login pendiente');
          router.push('/login');
          return;
        }

        const loginData = JSON.parse(pendingLogin);
        
        // ✨ VALIDAR ESTRUCTURA DE DATOS
        if (!loginData.username || !loginData.password) {
          console.warn('Datos de login incompletos');
          sessionStorage.removeItem('pendingLogin');
          router.push('/login');
          return;
        }

        // ✨ VALIDAR TIMESTAMP (MÁXIMO 10 MINUTOS)
        if (loginData.timestamp && (Date.now() - loginData.timestamp) > 600000) {
          console.warn('Sesión de 2FA expirada');
          sessionStorage.removeItem('pendingLogin');
          router.push('/login');
          return;
        }

        // ✨ VALIDAR INTEGRIDAD SIMPLE
        const expectedHash = btoa(loginData.username + loginData.password + loginData.timestamp).slice(-16);
        if (loginData.tempHash !== expectedHash) {
          console.warn('Datos de sesión comprometidos');
          sessionStorage.removeItem('pendingLogin');
          router.push('/login');
          return;
        }

        // ✨ SANITIZAR DATOS ANTES DE USAR
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

  // ✨ FUNCIÓN SEGURA PARA MANEJAR CAMBIO DE CÓDIGO
  const handleCodeChange = (e) => {
    const value = e.target.value;
    
    // ✨ SANITIZAR Y VALIDAR CÓDIGO 2FA
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

  // ✨ SUBMIT SEGURO
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✨ Rate limiting para intentos 2FA
    if (!checkRateLimit('2fa_attempt', 5, 300000)) {
      setError('Demasiados intentos de verificación. Espera 5 minutos.');
      return;
    }

    // ✨ Validar código antes de enviar
    if (!validateUserInput(code, 'text', { minLength: 6, maxLength: 6 })) {
      setError('El código debe tener exactamente 6 dígitos');
      return;
    }

    // ✨ Límite de intentos por sesión
    if (attempts >= 3) {
      setError('Demasiados intentos fallidos. Vuelve a iniciar sesión.');
      sessionStorage.removeItem('pendingLogin');
      setTimeout(() => router.push('/login'), 2000);
      return;
    }

    setLoading(true);
    setError('');

    try {
      // REQUEST COMPLETO COMO REQUIERE TU BACKEND
      const requestData = {
        username: username,
        password: password,         // CONTRASEÑA REQUERIDA
        twoFactorCode: sanitizeInput(code),
      };

      const res = await loginUser(requestData);

      if (res.access_token) {
        // ✅ LOGIN EXITOSO
        login(res.access_token, res.user_info);
        sessionStorage.removeItem('pendingLogin');
        
        const userData = await getUserFromToken();
        
        // ✨ REDIRECCIÓN SEGURA BASADA EN ROL
        const roleRoutes = {
          1: '/audit',
          2: '/products', 
          3: '/dashboard'
        };
        
        const route = roleRoutes[userData.idRol] || '/dashboard';
        router.push(route);
        return;
        
      } else if (res.requires2FA === true) {
        // ✨ INCREMENTAR CONTADOR DE INTENTOS
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

  // ✨ FUNCIÓN SEGURA PARA VOLVER AL LOGIN
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
          
          {/* ✨ MOSTRAR INTENTOS RESTANTES */}
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

          {/* ✨ CONTADOR DE CARACTERES */}
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

        {/* ✨ INFORMACIÓN DE AYUDA */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            ¿Problemas con el código? Verifica que tu aplicación esté sincronizada.
          </p>
        </div>
      </div>
    </div>
  );
}