'use client';
import React from 'react';
import { Input } from '@components/ui/Input';
import { Button } from '@components/ui/Button';

export const TwoFactorForm = ({
  code,
  onChange,
  onSubmit,
  loading,
  error,
}) => (
  <form className="space-y-4" onSubmit={onSubmit}>
    <Input
      label="Código de verificación"
      name="code"
      type="text"
      value={code}
      onChange={onChange}
      placeholder="Ingresa el código de 6 dígitos"
      maxLength={6}
      required
    />
    <Button type="submit" className="w-full" loading={loading}>
      Verificar
    </Button>
    {error && (
      <div className="mt-2 text-red-600 text-sm text-center">{error}</div>
    )}
  </form>
);
