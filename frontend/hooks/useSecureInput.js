import React, { useState, useEffect } from 'react';
import { validateUserInput, sanitizeInput } from '@/lib/security';
import { AlertTriangle, Shield } from 'lucide-react';

export const SecureInput = ({ 
  type = 'text', 
  validationType = 'text',
  onSecureChange,
  maxLength = 255,
  showSecurityIndicator = false,
  validationOptions = {},
  ...props 
}) => {
  const [securityWarning, setSecurityWarning] = useState('');
  const [securityLevel, setSecurityLevel] = useState('safe');

  const handleChange = (e) => {
    const { value } = e.target;
    
    // Sanitizar
    const sanitizedValue = sanitizeInput(value);
    
    // Detectar intento de inyección
    if (value !== sanitizedValue) {
      setSecurityWarning('Caracteres peligrosos detectados y removidos');
      setSecurityLevel('danger');
      
      // Log intento de inyección
      console.warn('Security: Potential injection attempt detected', {
        original: value.substring(0, 50),
        sanitized: sanitizedValue.substring(0, 50)
      });
    } else if (!validateUserInput(sanitizedValue, validationType, validationOptions)) {
      setSecurityWarning('Formato no válido');
      setSecurityLevel('warning');
    } else {
      setSecurityWarning('');
      setSecurityLevel('safe');
    }
    
    // Llamar callback con valor sanitizado
    if (onSecureChange) {
      onSecureChange({
        ...e,
        target: {
          ...e.target,
          value: sanitizedValue
        }
      });
    }
  };

  const getSecurityColor = () => {
    switch (securityLevel) {
      case 'danger': return 'border-red-500 bg-red-50';
      case 'warning': return 'border-yellow-500 bg-yellow-50';
      default: return 'border-gray-300';
    }
  };

  return (
    <div className="space-y-1">
      <div className="relative">
        <input
          {...props}
          type={type}
          onChange={handleChange}
          maxLength={maxLength}
          className={`${props.className} ${getSecurityColor()}`}
        />
        {showSecurityIndicator && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {securityLevel === 'safe' && (
              <Shield className="h-4 w-4 text-green-500" />
            )}
            {securityLevel === 'warning' && (
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            )}
            {securityLevel === 'danger' && (
              <AlertTriangle className="h-4 w-4 text-red-500" />
            )}
          </div>
        )}
      </div>
      {securityWarning && (
        <p className="text-xs text-red-600 flex items-center">
          <AlertTriangle className="h-3 w-3 mr-1" />
          {securityWarning}
        </p>
      )}
    </div>
  );
};