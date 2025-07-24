'use client';

/**
 * Componente de formulario de login con seguridad mejorada.
 * - Incluye rate limiting en los inputs para prevenir spam.
 * - Muestra alertas de error y feedback al usuario.
 */

import React from 'react';
import { Input } from '@/components/ui/Input';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { FileText, Lock } from 'lucide-react';
// Seguridad: Importa función para limitar la frecuencia de cambios en los inputs
import { checkRateLimit } from '@/lib/security';

export function LoginForm({ formData, errors, onChange, onSubmit, loading }) {
  /**
   * handleSecureChange
   * Limita la frecuencia de cambios en los inputs usando rate limiting.
   * Previene ataques de spam y mejora la seguridad del formulario.
   */
  const handleSecureChange = (e) => {
    // Permite máximo 50 cambios cada 10 segundos por input
    if (!checkRateLimit('login_input', 50, 10000)) {
      return;
    }
    
    onChange(e);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">   
      {/* DNI/Username */}
      <div>
      <Input
          label="DNI"
          name="username"
          type="text"
          inputMode="numeric"
          pattern="\d{10}"
          value={formData.username.replace(/\D/g, '').slice(0, 10)} 
          onChange={handleSecureChange}
          placeholder="Ingresa tu DNI (10 dígitos)"
          maxLength={10}
          icon={<FileText className="h-5 w-5" />}
          required
        />
        {errors.username && <Alert type="error">{errors.username}</Alert>}
      </div>

      {/* Contraseña */}
      <div>
        <PasswordInput
          label="Contraseña"
          name="password"
          value={formData.password}
          onChange={handleSecureChange}
          placeholder="Ingresa tu contraseña"
          maxLength={128}
          icon={<Lock className="h-5 w-5" />}
          required
        />
        {errors.password && <Alert type="error">{errors.password}</Alert>}
      </div>

      {/* Mensaje de error general */}
      {errors.submit && (
        <Alert type="error">
          {errors.submit}
        </Alert>
      )}

      {/* Botón de submit */}
      <Button 
        type="submit" 
        loading={loading}
        disabled={loading}
        className="w-full h-12 text-base font-medium"
      >
        {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </Button>
    </form>
  );
}
