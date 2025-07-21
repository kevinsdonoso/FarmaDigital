import React from 'react';
import { Input } from '@/components/ui/Input';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';

export const RegisterForm = ({
  formData,
  errors,
  onChange,
  onSubmit,
  loading,
}) => (
  <form className="space-y-6" onSubmit={onSubmit}>
    <Input
      label="DNI"
      name="dni"
      type="text"
      value={formData.dni}
      onChange={onChange}
      placeholder="Ingresa tu DNI"
      maxLength={10}
      required
    />
    {errors.dni && (
      <Alert type="error" className="mt-1 mb-0">
        {errors.dni}
      </Alert>
    )}

    <Input
      label="Nombre Completo"
      name="nombre"
      type="text"
      value={formData.nombre}
      onChange={onChange}
      placeholder="Ingresa tu nombre completo"
      required
    />
    {errors.nombre && (
      <Alert type="error" className="mt-1 mb-0">
        {errors.nombre}
      </Alert>
    )}

    <Input
      label="Correo Electrónico"
      name="correo"
      type="email"
      value={formData.correo}
      onChange={onChange}
      placeholder="correo@ejemplo.com"
      required
    />
    {errors.correo && (
      <Alert type="error" className="mt-1 mb-0">
        {errors.correo}
      </Alert>
    )}

    <PasswordInput
      label="Contraseña"
      name="password"
      value={formData.password}
      onChange={onChange}
      placeholder="Mínimo 8 caracteres"
      required
    />
    {errors.password && (
      <Alert type="error" className="mt-1 mb-0">
        {errors.password}
      </Alert>
    )}

    <PasswordInput
      label="Confirmar Contraseña"
      name="confirmPassword"
      value={formData.confirmPassword}
      onChange={onChange}
      placeholder="Repite tu contraseña"
      required
    />
    {errors.confirmPassword && (
      <Alert type="error" className="mt-1 mb-0">
        {errors.confirmPassword}
      </Alert>
    )}

    {/* Mensaje de éxito */}
    {errors.success && (
      <Alert type="success">
        {errors.success}
      </Alert>
    )}

    {/* Mensaje de error general */}
    {errors.submit && (
      <Alert type="error">
        {errors.submit}
      </Alert>
    )}

    <Button 
      type="submit" 
      loading={loading} 
      disabled={loading}
      className="w-full h-12 text-base font-medium"
    >
      {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
    </Button>

    {/* Info de requisitos */}
    <Alert type="info" className="mb-0">
      <div className="text-sm">
        <h4 className="font-medium text-blue-900 mb-1">Requisitos de la contraseña:</h4>
        <ul className="text-blue-800 space-y-1 text-xs">
          <li>• Mínimo 8 caracteres</li>
          <li>• Se recomienda usar letras, números y símbolos</li>
        </ul>
      </div>
    </Alert>
  </form>
);