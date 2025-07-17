'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../hooks/useAuth';
import { loginUser } from '../../../lib/api';
import { LoginForm } from '../../../components/auth/LoginForm';

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAuthLoading(true);
    setError('');

    try {
      const result = await loginUser({
        username: formData.username,
        password: formData.password
      });

      if (result.success) {
        localStorage.setItem('token', result.access_token);
        login(result.user_info);
        router.push('/dashboard');
      } else {
        setError(result.message || 'Error en el login');
      }
    } catch (err) {
      setError(err.message || 'Error de conexión con el servidor');
    } finally {
      setLoading(false);
      setAuthLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-sm">
        <div className="bg-white py-6 px-6 shadow rounded-lg">
          <LoginForm
            formData={formData}
            onChange={handleChange}
            onSubmit={handleSubmit}
            loading={loading}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            error={error}
          />
        </div>
      </div>
    </div>
  );
}