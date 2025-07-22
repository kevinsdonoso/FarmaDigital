import { useState, useCallback, useEffect } from 'react';
import { validateUserInput, sanitizeInput } from '@/lib/security';
import { logUserAction, auditableActions } from '@/lib/audit';
import { checkRateLimit } from '@/lib/security';

export const useSecureForm = (initialData = {}, validationRules = {}) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);

  const validateField = useCallback((name, value) => {
    const rule = validationRules[name];
    if (!rule) return true;

    // Sanitizar entrada
    const sanitizedValue = sanitizeInput(value);
    
    // Detectar intento de inyección
    if (value !== sanitizedValue) {
      logUserAction(auditableActions.SUSPICIOUS_ACTIVITY, {
        field: name,
        originalValue: value.substring(0, 50),
        sanitizedValue: sanitizedValue.substring(0, 50),
        attempt: 'potential_injection',
        timestamp: new Date().toISOString()
      });
    }
    
    // Validar según el tipo
    const isValid = validateUserInput(sanitizedValue, rule.type, rule.options);
    
    if (!isValid) {
      setErrors(prev => ({
        ...prev,
        [name]: rule.message || `${name} no es válido`
      }));
      return false;
    }

    setErrors(prev => ({
      ...prev,
      [name]: ''
    }));
    
    return true;
  }, [validationRules]);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    
    // Rate limiting por campo
    const rateLimitKey = `form_${name}`;
    if (!checkRateLimit(rateLimitKey, 10, 60000)) {
      setErrors(prev => ({
        ...prev,
        [name]: 'Demasiados intentos. Espera un momento.'
      }));
      return;
    }
    
    // Validar en tiempo real
    validateField(name, fieldValue);
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : sanitizeInput(fieldValue)
    }));
  }, [validateField]);

  const handleSubmit = useCallback(async (submitFn) => {
    // Rate limiting para envíos
    if (!checkRateLimit('form_submit', 3, 300000)) { // 3 intentos en 5 minutos
      setErrors({ submit: 'Demasiados intentos de envío. Espera 5 minutos.' });
      return;
    }

    setIsSubmitting(true);
    setAttemptCount(prev => prev + 1);

    try {
      // Validar todos los campos
      let isFormValid = true;
      Object.keys(validationRules).forEach(fieldName => {
        if (!validateField(fieldName, formData[fieldName])) {
          isFormValid = false;
        }
      });

      if (!isFormValid) {
        throw new Error('Por favor corrige los errores en el formulario');
      }

      await submitFn(formData);
      
      // Log éxito
      logUserAction(auditableActions.FORM_SUBMITTED, {
        formType: validationRules.formType || 'unknown',
        attempt: attemptCount + 1
      });
      
    } catch (error) {
      // Log error
      logUserAction(auditableActions.FORM_ERROR, {
        formType: validationRules.formType || 'unknown',
        error: error.message,
        attempt: attemptCount + 1
      });
      
      setErrors({ submit: error.message });
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validationRules, validateField, attemptCount]);

  return {
    formData,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    validateField,
    setFormData,
    setErrors
  };
};