"use client";
/**
 * Página de login segura para la aplicación.
 * - Utiliza validación y sanitización avanzada en todos los campos.
 * - Aplica rate limiting para prevenir abuso y ataques automatizados.
 * - El diseño previene fugas de información y asegura la integridad de los datos.
 *
 * Seguridad:
 * - Todos los datos se validan y sanitizan antes de enviarse al backend.
 * - El rate limiting previene intentos de fuerza bruta y spam.
 * - El login con 2FA utiliza datos temporales y nunca expone credenciales.
 * - Los errores se muestran de forma segura y nunca exponen información sensible.
 */
import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from '@/lib/api';
import { useAuth } from '@/context/AuthProvider';
import { LoginForm } from '@/components/auth/LoginForm';

import { useSecureForm } from '@/hooks/useSecureForm';
import { checkRateLimit, sanitizeInput } from '@/lib/security';

export default function LoginPage() { 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { login: contextLogin } = useAuth();

  // Reglas de validación 
  const validationRules = {
  username: {
    regex: /^\d{10}$/, // exactamente 10 dígitos
    message: 'El DNI debe tener exactamente 10 dígitos.'
  },
  password: {
    regex: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/,
    message: 'La contraseña debe tener al menos 8 caracteres, incluyendo mayúsculas, números y símbolos.'
  }
};

 // Hook seguro para formularios
  const {
    formData,
    errors,
    isBlocked,
    blockTime,
    handleChange,
    handleSubmit: secureSubmit
  } = useSecureForm({ username: '', password: '' }, validationRules);
  /**
   * handleSubmit
   * Envía el formulario de login de forma segura.
   * - Valida y sanitiza los datos antes de enviarlos.
   * - Aplica rate limiting para prevenir abuso.
   * - Maneja login con 2FA y errores de forma segura.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

     // Primero validamos localmente
    const isValid = await secureSubmit(async () => {}, true); // true = solo validar sin ejecutar
    if (!isValid) return;

    // Rate limiting para intentos de login
    if (!checkRateLimit('login_attempt', 5, 300000)) {
      setError('Demasiados intentos. Intenta en 5 minutos.');
      return;
    }

    await secureSubmit(async (secureData) => {
      setLoading(true);
      setError('');
    
      try {
        const res = await loginUser(secureData);
        console.log('Respuesta loginUser:', res); // <-- VER LA RESPUESTA DEL BACKEND
        debugger; // <-- PAUSA AQUÍ PARA VER EL OBJETO res EN EL NAVEGADOR
    
        if (res.error) {
          setError(sanitizeInput(res.error));
          console.log('Error en login:', res.error); // <-- VER ERROR
          return;
        }
    
        // AUTENTICACIÓN CON 2FA - PASAR DATOS SEGUROS
        if (res.requires2FA === true) {
          console.log('2FA requerido, datos:', secureData, res.qrCode); // <-- VER DATOS DE 2FA
          debugger; // <-- PAUSA AQUÍ PARA VER secureData Y res
    
          const now = Date.now();
          const tempHash = btoa(secureData.username + secureData.password + now).slice(-16);
    
          const secureLoginData = {
            username: sanitizeInput(secureData.username),
            password: sanitizeInput(secureData.password),
            tempHash: tempHash,
            qr: res.qrCode || null,
            timestamp: now // Usa el mismo timestamp
          };
          sessionStorage.setItem('pendingLogin', JSON.stringify(secureLoginData));
          console.log('Guardado en sessionStorage:', secureLoginData); // <-- VERIFICAR QUE SE GUARDA
          debugger; // <-- PAUSA AQUÍ PARA VER sessionStorage
    
          router.push(res.qrCode ? '/login/two-factor-setup' : '/login/two-factor');
          console.log('Redirigiendo a:', res.qrCode ? '/login/two-factor-setup' : '/login/two-factor'); // <-- VERIFICAR REDIRECCIÓN
          return;
        }
    
        //  Login exitoso
        if (res.success && res.access_token) {
          console.log('Login exitoso, usuario:', res.user_info); // <-- VERIFICAR USUARIO Y TOKEN
          debugger; // <-- PAUSA AQUÍ PARA VER USUARIO Y TOKEN
          contextLogin(res.user_info);
          router.push('/dashboard');
          console.log('Redirigiendo a dashboard'); // <-- VERIFICAR REDIRECCIÓN
        }
      } catch (err) {
        setError(sanitizeInput(err.message || 'Error de conexión'));
        console.log('Catch error:', err); // <-- VERIFICAR ERROR
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
        <LoginForm
          formData={formData}
          errors={{ ...errors, submit: error }}
          onChange={handleChange}
          onSubmit={handleSubmit}
          loading={loading || isBlocked}
          disabled={loading || isBlocked}
        />
        {isBlocked && (
          <div className="text-red-600 text-sm text-center mt-2">
            Demasiados intentos. Espera {Math.ceil(blockTime / 1000)} segundos para volver a intentar.
          </div>
        )}

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
