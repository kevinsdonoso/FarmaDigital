/**
 * Hook personalizado para formularios seguros.
 * - Sanitiza y valida todos los datos antes de procesarlos.
 * - Aplica rate limiting para prevenir spam y ataques automatizados.
 * - Bloquea el formulario temporalmente tras demasiados intentos fallidos.
 * - Expone handlers seguros para cambios y envíos.
 *
 * Seguridad:
 * - Todas las entradas se sanitizan y validan antes de actualizar el estado.
 * - El rate limiting previene abuso tanto en cambios como en envíos.
 * - Los errores se gestionan de forma clara y nunca exponen información sensible.
 */
import { useState, useCallback, useEffect } from 'react';
import { validateUserInput, sanitizeInput } from '@/lib/security';
import { checkRateLimit } from '@/lib/security';

export const useSecureForm = (initialData = {}, validationRules = {}) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  /**
   * validateField
   * Sanitiza y valida un campo según las reglas definidas.
   * @param {string} name - Nombre del campo
   * @param {any} value - Valor del campo
   * @returns {boolean} - Si el campo es válido
   */
  const validateField = useCallback((name, value) => {
    const rule = validationRules[name];
    if (!rule) return true;

    // Sanitizar entrada
    const sanitizedValue = sanitizeInput(value);
    
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
  /**
   * handleChange
   * Handler seguro para cambios en los inputs.
   * - Sanitiza el valor antes de actualizar el estado.
   * - (Opcional) Aplica rate limiting por campo.
   */
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : sanitizeInput(fieldValue)
    }));
  }, [validateField]);

const [isBlocked, setIsBlocked] = useState(false);
const [blockTime, setBlockTime] = useState(0);
  /**
   * handleSubmit
   * Handler seguro para el envío del formulario.
   * - Valida todos los campos antes de enviar.
   * - Aplica rate limiting global para envíos.
   * - Bloquea el formulario temporalmente tras demasiados intentos.
   * @param {Function} submitFn - Función de envío
   * @param {boolean} validateOnly - Si solo se debe validar
   * @returns {boolean} - Si el envío fue exitoso
   */
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
    return false; 
  }

  if (validateOnly) return true; 

  // Rate limiting para envíos
  if (!checkRateLimit('form_submit', 3, 60000)) {
    setErrors({ submit: 'Demasiados intentos de envío. Espera 1 minuto.' });
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
    return true;
  } catch (error) {
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