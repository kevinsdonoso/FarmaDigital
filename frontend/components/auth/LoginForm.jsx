import React from 'react';
import { Input } from '../ui/Input';
import { PasswordInput } from '../ui/PasswordInput';
import { Button } from '../ui/Button';
import Link from 'next/link';

export const LoginForm = ({
  formData,
  onChange,
  onSubmit,
  loading,
  showPassword,
  setShowPassword,
  error,
}) => (
  <form className="space-y-4" onSubmit={onSubmit}>
    <Input
      label="DNI o Correo electrónico"
      name="username"
      type="text"
      value={formData.username}
      onChange={onChange}
      placeholder="DNI o correo@ejemplo.com"
      required
    />
    <PasswordInput
      label="Contraseña"
      name="password"
      value={formData.password}
      onChange={onChange}
      placeholder="Contraseña"
      show={showPassword}
      setShow={setShowPassword}
      required
    />
    <div className="flex items-center justify-between">
      <Link
        href="/forgot-password"
        className="text-sm font-medium text-blue-600 hover:text-blue-500"
      >
        ¿Olvidaste tu contraseña?
      </Link>
    </div>
    <Button
      type="submit"
      loading={loading}
      className="w-full"
    >
      Iniciar Sesión
    </Button>
    <div className="text-center">
      <span className="text-sm text-gray-600">¿No tienes cuenta? </span>
      <Link
        href="/register"
        className="font-medium text-blue-600 hover:text-blue-500"
      >
        Regístrate
      </Link>
    </div>
    {error && (
      <div className="mt-2 text-red-600 text-sm text-center">{error}</div>
    )}
  </form>
);