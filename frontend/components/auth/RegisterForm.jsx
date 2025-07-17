import React from 'react';
import { Input } from '../ui/Input';
import { PasswordInput } from '../ui/PasswordInput';
import { Button } from '../ui/Button';

export const RegisterForm = ({
  formData,
  errors,
  onChange,
  onSubmit,
  loading,
}) => (
  <form className="space-y-4" onSubmit={onSubmit}>
    <Input
      label="DNI"
      name="dni"
      type="text"
      value={formData.dni}
      onChange={onChange}
      placeholder="Ingresa tu DNI"
      required
    />
    {errors.dni && <p className="text-sm text-red-600">{errors.dni}</p>}

    <Input
      label="Nombre completo"
      name="nombre"
      type="text"
      value={formData.nombre}
      onChange={onChange}
      placeholder="Ingresa tu nombre completo"
      required
    />
    {errors.nombre && <p className="text-sm text-red-600">{errors.nombre}</p>}

    <Input
      label="Correo electrónico"
      name="correo"
      type="email"
      value={formData.correo}
      onChange={onChange}
      placeholder="correo@ejemplo.com"
      required
    />
    {errors.correo && <p className="text-sm text-red-600">{errors.correo}</p>}

    <PasswordInput
      label="Contraseña"
      name="password"
      value={formData.password}
      onChange={onChange}
      placeholder="Mínimo 8 caracteres"
      required
    />
    {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}

    <PasswordInput
      label="Confirmar contraseña"
      name="confirmPassword"
      value={formData.confirmPassword}
      onChange={onChange}
      placeholder="Repite tu contraseña"
      required
    />
    {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword}</p>}

    {errors.submit && (
      <div className="rounded-md bg-red-50 p-4">
        <p className="text-sm text-red-600">{errors.submit}</p>
      </div>
    )}

    <Button type="submit" loading={loading} className="w-full">
      Registrarse
    </Button>
  </form>
);