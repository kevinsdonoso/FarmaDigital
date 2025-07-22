"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from '@/lib/api';
import { useAuth } from '@/context/AuthProvider';
import { Input } from '@/components/ui/Input';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
// ✨ SOLO IMPORTAR LO NECESARIO PARA LOGS ANÓNIMOS
import { logAnonymousAction, anonymousActions } from '@/lib/audit';
import { checkRateLimit } from '@/lib/security';

// ✨ Seguridad
import { useSecureForm } from '@/hooks/useSecureForm';
import { logUserAction, auditableActions } from '@/lib/audit';
import { checkRateLimit } from '@/lib/security';

export default function LoginPage() { 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { login: contextLogin } = useAuth();

  // ✨ Reglas de validación
  const validationRules = {
    username: {
      type: 'dni',
      message: 'DNI debe tener entre 8 y 10 dígitos'
    },
    password: {
      type: 'password',
      message: 'La contraseña debe tener al menos 8 caracteres'
    },
    formType: 'login'
  };

  // ✨ Hook seguro
  const {
    formData,
    errors,
    handleChange,
    handleSubmit: secureSubmit
  } = useSecureForm({ username: '', password: '' }, validationRules);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✨ Protección contra fuerza bruta
    if (!checkRateLimit('login_attempt', 5, 300000)) {
      setError('Demasiados intentos. Intenta en 5 minutos.');
      return;
    }

    await secureSubmit(async (secureData) => {
      setLoading(true);
      setError('');

      try {
        const res = await loginUser(secureData);

        if (res.error) {
          // ✨ Registro de intento fallido
          await logAnonymousAction(anonymousActions.FAILED_LOGIN, {
            username: secureData.username,
            reason: res.error
          });
          setError(res.error);
          return;
        }

        // ✨ Autenticación con 2FA
        if (res.requires2FA === true) {
          sessionStorage.setItem('pendingLogin', JSON.stringify({
            username: secureData.username,
            password: secureData.password,
            qr: res.qrCode || null
          }));

          router.push(res.qrCode ? '/login/two-factor-setup' : '/login/two-factor');
          return;
        }

        // ✅ Login exitoso
        if (res.success && res.access_token) {
          contextLogin(res.user_info);
          router.push('/dashboard');
        }

      } catch (err) {
        // ✨ Registro de error inesperado
        await logAnonymousAction(anonymousActions.FAILED_LOGIN, {
          username: secureData.username,
          error: err.message
        });
        setError(err.message || 'Error de conexión');
      } finally {
        setLoading(false);
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg border border-gray-200 p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Iniciar Sesión</h1>
          <p className="text-gray-600">Ingresa tus credenciales para acceder</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="DNI"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            placeholder="Ingresa tu DNI o usuario"
            required
          />
          {errors.username && <Alert type="error">{errors.username}</Alert>}

          <PasswordInput
            label="Contraseña"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Ingresa tu contraseña"
            required
          />
          {errors.password && <Alert type="error">{errors.password}</Alert>}

          {(error || errors.submit) && (
            <Alert type="error">
              {error || errors.submit}
            </Alert>
          )}

          <Button 
            type="submit" 
            loading={loading} 
            className="w-full h-12 text-base font-medium"
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            ¿No tienes cuenta?{' '}
            <button 
              onClick={() => router.push('/register')}
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              Regístrate aquí
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
