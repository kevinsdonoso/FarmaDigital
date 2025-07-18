'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../hooks/useAuth';
import { registerUser } from '../../../lib/api';
import { RegisterForm } from '../../../components/auth/RegisterForm';

export default function RegisterPage() {
  const router = useRouter();
  const { setLoading } = useAuth();
  const [formData, setFormData] = useState({
    dni: '',
    nombre: '',
    correo: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.dni.trim()) {
      newErrors.dni = 'El DNI es requerido';
    } else if (formData.dni.length < 8) {
      newErrors.dni = 'El DNI debe tener al menos 8 dígitos';
    }

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (!formData.correo.trim()) {
      newErrors.correo = 'El correo es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.correo)) {
      newErrors.correo = 'El correo no es válido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirmar contraseña es requerido';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setLoading(true);
    setErrors({});
    
    try {
      const result = await registerUser({
        dni: formData.dni,
        nombre: formData.nombre,
        correo: formData.correo,
        password: formData.password
      });
      
      if (result.success) {
        setErrors({ 
          success: '¡Registro exitoso! Redirigiendo al login...' 
        });
        
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
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg border border-gray-200 p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Crear Cuenta</h1>
          <p className="text-gray-600">Únete a FarmaDigital</p>
        </div>
        
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


        <RegisterForm
          formData={formData}
          errors={errors}
          onChange={handleChange}
          onSubmit={handleSubmit}
          loading={isSubmitting}
        />

        {/* Debug info en desarrollo */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-6 p-3 bg-gray-100 rounded text-xs">
            <p><strong>Debug:</strong></p>
            <p>DNI: {formData.dni}</p>
            <p>Nombre: {formData.nombre}</p>
            <p>Correo: {formData.correo}</p>
            <p>Contraseñas coinciden: {formData.password === formData.confirmPassword ? '✅' : '❌'}</p>
          </div>
        )}
      </div>
    </div>
  );
}