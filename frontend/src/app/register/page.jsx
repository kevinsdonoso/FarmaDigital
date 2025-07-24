'use client';
/**
 * Página de registro segura para la aplicación.
 * - Valida y sanitiza todos los campos antes de enviar.
 * - Aplica rate limiting para prevenir spam y abuso.
 * - El diseño previene fugas de información y asegura la integridad de los datos.
 *
 * Seguridad:
 * - Todos los datos se validan y sanitizan antes de enviarse al backend.
 * - El formulario previene manipulación y abuso de datos.
 * - Los errores se muestran de forma segura y nunca exponen información sensible.
 */
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { registerUser } from '@/lib/api';
import { RegisterForm } from '@/components/auth/RegisterForm';

import { useSecureForm } from '@/hooks/useSecureForm';
import { checkRateLimit, sanitizeInput } from '@/lib/security';

export default function RegisterPage() {
  const router = useRouter();
  const { setLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Reglas de validación seguras
  const validationRules = {
    dni: { regex: /^\d{10}$/, // exactamente 10 dígitos
    message: 'El DNI debe tener exactamente 10 dígitos.'},
    nombre: { type: 'text', message: 'Nombre debe tener 2-50 caracteres, solo letras' },
    correo: { type: 'email', message: 'Correo electrónico no válido' },
    password: {
      regex: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/,
      message: 'La contraseña debe tener al menos 8 caracteres, incluyendo mayúsculas, números y símbolos.'
    },   
    confirmPassword: {
      type: 'password',
      message: 'Las contraseñas no coinciden'
    }
  }; 
  
  // Hook seguro para formularios
  const { formData,errors,handleChange,handleSubmit: secureSubmit,setErrors
  } = useSecureForm(
    {
      dni: '',
      nombre: '',
      correo: '',
      password: '',
      confirmPassword: ''
    },
    validationRules
  );

  /**
   * handleSubmit
   * Envía el formulario de registro de forma segura.
   * - Valida y sanitiza los datos antes de enviarlos.
   * - Aplica rate limiting para prevenir abuso.
   * - Muestra errores de forma segura.
  */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setErrors(prev => ({
        ...prev,
        confirmPassword: 'Las contraseñas no coinciden'
      }));
      return;
    }

    // Rate limiting para registro
    if (!checkRateLimit('register_attempt', 3, 60000)) {
      setErrors(prev => ({
        ...prev,
        submit: 'Demasiados intentos de registro. Espera 1 minuto.'
      }));
      return;
    }

    await secureSubmit(async (secureData) => {
      setIsSubmitting(true);
      setLoading(true);

      try {
        const result = await registerUser({
          dni: secureData.dni,
          nombre: secureData.nombre,
          correo: secureData.correo,
          password: secureData.password
        });
        if (result.success) {
          setErrors({ success: '¡Registro exitoso! Redirigiendo al login...' });

          setTimeout(() => {
            router.push('/login');
          }, 2000);
        } else {
          setErrors({ submit: sanitizeInput(result.message || 'Error en el registro') });
        }
      } catch (error) {
        setErrors({ submit: sanitizeInput(error.message || 'Error de conexión. Intenta nuevamente.') });
      } finally {
        setIsSubmitting(false);
        setLoading(false);
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg border border-gray-200 p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Crear Cuenta</h1>
          <p className="text-gray-600">Únete a FarmaDigital</p>
        </div>

        <RegisterForm
          formData={formData}
          errors={errors}
          onChange={handleChange}
          onSubmit={handleSubmit}
          loading={isSubmitting}
        />

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            ¿Ya tienes cuenta?{' '}
            <button
              onClick={() => router.push('/login')}
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              Inicia sesión aquí
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}