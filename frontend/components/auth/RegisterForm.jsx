'use client';

import React from 'react';
import { Input } from '@/components/ui/Input';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { User, Mail, FileText, Lock, CheckCircle } from 'lucide-react';

// ✨ AGREGAR SEGURIDAD
import { sanitizeInput, checkRateLimit } from '@/lib/security';

export function RegisterForm({ formData, errors, onChange, onSubmit, loading }) {
  // ✨ FUNCIÓN SEGURA PARA MANEJAR CAMBIOS
  const handleSecureChange = (e) => {
    // Rate limiting para prevenir spam de input
    if (!checkRateLimit('register_input', 50, 10000)) {
      return;
    }
    
    onChange(e);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      
      {/* DNI */}
      <div>
        <Input
          label="DNI"
          name="dni"
          type="number"
          value={formData.dni}
          onChange={handleSecureChange}
          placeholder="Ingresa tu DNI"
          maxLength={10}
          icon={<FileText className="h-5 w-5" />}
          required
        />
        {errors.dni && <Alert type="error">{errors.dni}</Alert>}
      </div>

      {/* Nombre */}
      <div>
        <Input
          label="Nombre completo"
          name="nombre"
          type="text"
          value={formData.nombre}
          onChange={handleSecureChange}
          placeholder="Ingresa tu nombre completo"
          minLength={2}
          maxLength={50}
          icon={<User className="h-5 w-5" />}
          required
        />
        {errors.nombre && <Alert type="error">{errors.nombre}</Alert>}
      </div>

      {/* Email */}
      <div>
        <Input
          label="Correo electrónico"
          name="correo"
          type="email"
          value={formData.correo}
          onChange={handleSecureChange}
          placeholder="tu@email.com"
          maxLength={100}
          icon={<Mail className="h-5 w-5" />}
          required
        />
        {errors.correo && <Alert type="error">{errors.correo}</Alert>}
      </div>

      {/* Contraseña */}
      <div>
        <PasswordInput
          label="Contraseña"
          name="password"
          value={formData.password}
          onChange={handleSecureChange}
          placeholder="Mínimo 8 caracteres"
          maxLength={128}
          icon={<Lock className="h-5 w-5" />}
          required
        />
        {errors.password && <Alert type="error">{errors.password}</Alert>}
        
        {/* ✨ INDICADOR DE FORTALEZA DE CONTRASEÑA */}
        {formData.password && (
          <div className="mt-2">
            <div className="text-xs text-gray-600 mb-1">Fortaleza de la contraseña:</div>
            <div className="flex space-x-1">
              <div className={`h-1 w-1/4 rounded ${formData.password.length >= 8 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <div className={`h-1 w-1/4 rounded ${/[A-Z]/.test(formData.password) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <div className={`h-1 w-1/4 rounded ${/[a-z]/.test(formData.password) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <div className={`h-1 w-1/4 rounded ${/[0-9]/.test(formData.password) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            </div>
          </div>
        )}
      </div>

      {/* Confirmar contraseña */}
      <div>
        <PasswordInput
          label="Confirmar contraseña"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleSecureChange}
          placeholder="Repite tu contraseña"
          maxLength={128}
          icon={<CheckCircle className="h-5 w-5" />}
          required
        />
        {errors.confirmPassword && <Alert type="error">{errors.confirmPassword}</Alert>}
      </div>

      {/* Mensajes de error/éxito */}
      {errors.submit && <Alert type="error">{errors.submit}</Alert>}
      {errors.success && <Alert type="success">{errors.success}</Alert>}

      {/* Botón de submit */}
      <Button 
        type="submit" 
        loading={loading}
        disabled={loading}
        className="w-full h-12 text-base font-medium"
      >
        {loading ? 'Creando cuenta...' : 'Crear cuenta'}
      </Button>
    </form>
  );
}