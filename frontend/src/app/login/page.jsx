'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/lib/api';

export default function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await loginUser(form);
      
      console.log('✅ Respuesta del servidor:', res);

      // Error en credenciales
      if (res.error) {
        setError(res.error);
        return;
      }

      // ✅ ESTE CASO DEBERÍA FUNCIONAR AHORA
      if (res.requires2FA === true) {
        if (res.qrCode) {
          // Usuario nuevo: primera vez configurando 2FA
          console.log('🔄 Redirigiendo a two-factor-setup con QR');
          const params = new URLSearchParams({
            username: form.username,
            password: form.password,
            qr: res.qrCode
          });
          router.push(`/login/two-factor-setup?${params.toString()}`);
        } else {
          // Usuario recurrente: ya tiene 2FA configurado
          console.log('🔄 Redirigiendo a two-factor');
          const params = new URLSearchParams({
            username: form.username,
            password: form.password
          });
          router.push(`/login/two-factor?${params.toString()}`);
        }
        return;
      }

      // Login directo (no debería pasar)
      if (res.success) {
        localStorage.setItem('token', res.access_token);
        localStorage.setItem('user', JSON.stringify(res.user_info));
        router.push('/dashboard');
      }

    } catch (err) {
      setError(err.message || 'Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-semibold mb-4">Iniciar sesión</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="username"
          placeholder="DNI o usuario"
          value={form.username}
          onChange={handleChange}
          className="border p-2 w-full"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
          className="border p-2 w-full"
          required
        />
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded w-full">
          {loading ? 'Cargando...' : 'Iniciar sesión'}
        </button>
      </form>
    </div>
  );
}