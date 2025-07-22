"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from '@/lib/api';
import { useAuth } from '@/context/AuthProvider';
import { Input } from '@/components/ui/Input';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';

export default function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { login: contextLogin } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await loginUser(form);

      if (res.error) {
        setError(res.error);
        return;
      }

      // Requiere 2FA
      if (res.requires2FA === true) {
        sessionStorage.setItem('pendingLogin', JSON.stringify({
          username: form.username,
          password: form.password,
          qr: res.qrCode || null
        }));

        if (res.qrCode) {
          router.push('/login/two-factor-setup');
        } else {
          router.push('/login/two-factor');
        }
        return;
      }

      // Login exitoso
      if (res.success && res.access_token) {
        contextLogin(res.user_info);
        router.push('/dashboard');
      }

    } catch (err) {
      setError(err.message || 'Error de conexión');
    } finally {
      setLoading(false);
    }
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
            value={form.username}
            onChange={handleChange}
            placeholder="Ingresa tu DNI o usuario"
            required
          />

          <PasswordInput
            label="Contraseña"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Ingresa tu contraseña"
            required
          />

          {error && (
            <Alert type="error">
              {error}
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