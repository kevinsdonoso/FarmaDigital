import { useState, useCallback, useEffect } from 'react';
import { validateUserInput, sanitizeInput } from '@/lib/security';
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
    
    // Validar según el tipo
    const isValid = validateUserInput(sanitizedValue, rule.type, rule.options);
    // 👇 Agrega este log para ver el estado de cada campo
    console.log(`[VALIDACIÓN] Campo: ${name}, Valor: "${sanitizedValue}", Tipo: ${rule.type}, ¿Válido?:`, isValid);
    
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
    
    /* //* Rate limiting por campo
    const rateLimitKey = `form_${name}`;
    if (!checkRateLimit(rateLimitKey, 10, 60000)) {
      setErrors(prev => ({
        ...prev,
        [name]: 'Demasiados intentos. Espera un momento.'
      }));
      return;
    }  */
       
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : sanitizeInput(fieldValue)
    }));
  }, [validateField]);

const [isBlocked, setIsBlocked] = useState(false);
const [blockTime, setBlockTime] = useState(0);

const handleSubmit = useCallback(async (submitFn, validateOnly = false) => {
  if (isBlocked) {
    setErrors(prev => ({
      ...prev,
      submit: `Demasiados intentos. Espera ${Math.ceil(blockTime / 1000)} segundos.`
    }));
    return false;
  }

  // Validar todos los campos primero
  let isFormValid = true;
  Object.keys(validationRules).forEach(fieldName => {
    if (!validateField(fieldName, formData[fieldName])) {
      isFormValid = false;
    }
  });

  if (!isFormValid) {
    if (!validateOnly) {
      setErrors(prev => ({
        ...prev,
        submit: 'Por favor corrige los errores en el formulario'
      }));
    }
    return false; // ❌ Formulario inválido
  }

  if (validateOnly) return true; // ✅ Solo querías validar

  // Rate limiting para envíos
  if (!checkRateLimit('form_submit', 3, 300000)) {
    setErrors({ submit: 'Demasiados intentos de envío. Espera 5 minutos.' });
    setIsBlocked(true);
    setBlockTime(60000); // 5 minutos en ms

    // Timer para desbloquear
    let interval = setInterval(() => {
      setBlockTime(prev => {
        if (prev <= 1000) {
          clearInterval(interval);
          setIsBlocked(false);
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    return false;
  }

  setIsSubmitting(true);
  setAttemptCount(prev => prev + 1);

  try {
    await submitFn(formData);

    logUserAction(auditableActions.FORM_SUBMITTED, {
      formType: validationRules.formType || 'unknown',
      attempt: attemptCount + 1
    });

    return true;
  } catch (error) {
    logUserAction(auditableActions.FORM_ERROR, {
      formType: validationRules.formType || 'unknown',
      error: error.message,
      attempt: attemptCount + 1
    });

    setErrors({ submit: error.message });
    return false;
  } finally {
    setIsSubmitting(false);
  }
}, [formData, validationRules, validateField, attemptCount]);


  return {
    formData,
    errors,
    isSubmitting,
    isBlocked,
    blockTime,
    handleChange,
    handleSubmit,
    validateField,
    setFormData,
    setErrors
  };
};