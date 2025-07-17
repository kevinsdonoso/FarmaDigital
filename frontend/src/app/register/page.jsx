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

 
  // ...validateForm, handleChange igual...

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
        alert('¡Registro exitoso! logeate');
        router.push('/login');
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
    // Limpiar error específico cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Registrarse en FarmaDigital
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          O{' '}
          <button
            type="button"
            onClick={() => router.push('/login')}
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            inicia sesión si ya tienes cuenta
          </button>
        </p>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <RegisterForm
            formData={formData}
            errors={errors}
            onChange={handleChange}
            onSubmit={handleSubmit}
            loading={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
}