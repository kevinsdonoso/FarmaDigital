import { sanitizeInput, validateCodeInjection, validateSQLInjection } from './security';

// #08 Validación completa de entrada
export const validateUserInput = (input, type = 'text', options = {}) => {
  if (!input || typeof input !== 'string') return false;
  
  // Sanitizar primero
  const sanitized = sanitizeInput(input);
  
  // Verificar inyecciones
  if (!validateSQLInjection(sanitized) || !validateCodeInjection(sanitized)) {
    return false;
  }
  
  // Validaciones por tipo
  const patterns = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    dni: /^\d{8,10}$/,
    phone: /^\+?[\d\s-()]{7,15}$/,
    name: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    precio: /^\d+(\.\d{1,2})?$/,
    stock: /^\d+$/,
    text: /.+/,
    codigo2fa: /^\d{6}$/,
    numeroTarjeta: /^\d{13,19}$/,
    cvv: /^\d{3,4}$/
  };
  
  // Longitud máxima por tipo
  const maxLengths = {
    email: 254,
    dni: 10,
    name: 50,
    password: 128,
    text: options.maxLength || 255,
    ...options.maxLengths
  };
  
  const pattern = patterns[type];
  const maxLength = maxLengths[type];
  
  if (maxLength && sanitized.length > maxLength) {
    return false;
  }
  
  return pattern ? pattern.test(sanitized) : sanitized.length > 0;
};

// #09 Validación específica para productos
export const validateProductData = (productData) => {
  const errors = {};
  
  if (!validateUserInput(productData.nombre, 'name')) {
    errors.nombre = 'Nombre inválido (solo letras y espacios, 2-50 caracteres)';
  }
  
  if (!validateUserInput(productData.precio, 'precio')) {
    errors.precio = 'Precio inválido (formato: 00.00)';
  }
  
  if (!validateUserInput(productData.stock, 'stock')) {
    errors.stock = 'Stock inválido (solo números)';
  }
  
  if (!validateUserInput(productData.descripcion, 'text', { maxLength: 500 })) {
    errors.descripcion = 'Descripción inválida (máximo 500 caracteres)';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// #10 Validación de tarjeta de crédito
export const validateCreditCard = (cardData) => {
  const errors = {};
  
  if (!validateUserInput(cardData.numeroTarjeta, 'numeroTarjeta')) {
    errors.numeroTarjeta = 'Número de tarjeta inválido';
  }
  
  if (!validateUserInput(cardData.cvv, 'cvv')) {
    errors.cvv = 'CVV inválido';
  }
  
  if (!validateUserInput(cardData.nombreTitular, 'name')) {
    errors.nombreTitular = 'Nombre del titular inválido';
  }
  
  // Validar fecha de expiración
  const [mes, año] = cardData.fechaExpiracion.split('/');
  const now = new Date();
  const expiry = new Date(2000 + parseInt(año), parseInt(mes) - 1);
  
  if (expiry <= now) {
    errors.fechaExpiracion = 'Tarjeta expirada';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};