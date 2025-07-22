'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { registerUser } from '@/lib/api';
import { RegisterForm } from '@/components/auth/RegisterForm';
// Seguridad añadida
import { useSecureForm } from '@/hooks/useSecureForm';
import { checkRateLimit } from '@/lib/security';

export default function RegisterPage() {
  const router = useRouter();
  const { setLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validationRules = {
    dni: { type: 'dni', message: 'DNI debe tener 8-10 dígitos' },
    nombre: { type: 'name', message: 'Nombre debe tener 2-50 caracteres, solo letras' },
    correo: { type: 'email', message: 'Correo electrónico no válido' },
    password: {
      type: 'password',
      message: 'Contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas, números y símbolos'
    },
    formType: 'register'
  };

  const {
    formData,
    errors,
    handleChange,
    handleSubmit: secureSubmit,
    setErrors
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setErrors(prev => ({
        ...prev,
        confirmPassword: 'Las contraseñas no coinciden'
      }));
      return;
    }

    if (!checkRateLimit('register_attempt', 3, 600000)) {
      setErrors(prev => ({
        ...prev,
        submit: 'Demasiados intentos de registro. Espera 10 minutos.'
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
          setErrors({ submit: result.message || 'Error en el registro' });
        }
      } catch (error) {
        setErrors({ submit: error.message || 'Error de conexión. Intenta nuevamente.' });
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
