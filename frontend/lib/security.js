/**
 * Módulo central de seguridad frontend.
 * 
 * Funcionalidades incluidas:
 * - Sanitización de entradas con DOMPurify.
 * - Validaciones personalizadas de entradas según tipo.
 * - Detección de inyecciones de código y SQL.
 * - Control de tasa de peticiones (rate limiting) en cliente.
 * 
 * Seguridad aplicada:
 * - Todas las entradas del usuario son sanitizadas antes de procesarse.
 * - Validaciones robustas contra patrones comunes de ataque (XSS, SQLi).
 * - Protección contra ejecución de scripts maliciosos o código embebido.
 * - Límite de frecuencia configurable para mitigar abuso de formularios.
 */
import DOMPurify from 'dompurify';

/**
 * Sanitiza la entrada usando DOMPurify.
 * Elimina cualquier contenido HTML o atributos potencialmente peligrosos.
 * 
 * @param {string|any} input - Entrada bruta del usuario
 * @returns {string} Entrada segura
 */
export const sanitizeInput = (input) => {
  if (input === null || input === undefined) return '';
  if (typeof input !== 'string') return String(input);
  
  return DOMPurify.sanitize(input, { 
    ALLOWED_TAGS: [], 
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true
  });
};

/**
 * Valida una entrada de usuario según el tipo y reglas adicionales.
 * Se realiza sanitización y verificación contra inyecciones.
 * 
 * @param {any} input - Valor a validar
 * @param {string} type - Tipo de dato esperado ('text', 'email', 'number', etc.)
 * @param {Object} options - Reglas adicionales (minLength, max, allowEmpty, etc.)
 * @returns {boolean} true si es válido, false si no
 */
export const validateUserInput = (input, type = 'text', options = {}) => {
  if (input === null || input === undefined) return false;
  
  // Convertir a string y sanitizar
  const rawInput = typeof input === 'string' ? input : String(input);
  const sanitized = sanitizeInput(rawInput);

  // Validar inyecciones
  if (!validateSQLInjection(sanitized) || !validateCodeInjection(sanitized)) {
    return false;
  }

  const {
    minLength = 0,
    maxLength = 1000,
    min = -Infinity,
    max = Infinity,
    allowEmpty = false
  } = options;

// Validar vacío
  if (!allowEmpty && sanitized.trim().length === 0) return false;

  switch (type) {
    case 'text':
      return sanitized.length >= minLength && sanitized.length <= maxLength;

    case 'number': {
      const num = Number(sanitized);
      if (isNaN(num)) return false;
      return num >= min && num <= max;
    }

    case 'email': {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(sanitized) && sanitized.length <= maxLength;
    }

    case 'dni': {
      const dniRegex = /^\d{8,10}$/;
      return dniRegex.test(sanitized);
    }

    case 'password':
      return sanitized.length >= Math.max(minLength, 8) && sanitized.length <= maxLength;

    case 'phone': {
      const phoneRegex = /^\+?[\d\s\-\(\)]{10,15}$/;
      return phoneRegex.test(sanitized);
    }

    case 'expirationDate': {
      const dateRegex = /^(0[1-9]|1[0-2])\/\d{4}$/;
      return dateRegex.test(sanitized) && sanitized.length === 7;
    }

    default:
      return sanitized.length >= minLength && sanitized.length <= maxLength;
  }
};

/**
 * Valida que la entrada no contenga código malicioso (XSS).
 * Se buscan patrones comunes de scripts y eventos inline.
 * 
 * @param {string} input - Entrada ya sanitizada
 * @returns {boolean} true si es segura, false si contiene intentos de XSS
 */
export const validateCodeInjection = (input) => {
  if (!input || typeof input !== 'string') return true;
  
  const dangerousPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /eval\s*\(/gi,
    /Function\s*\(/gi,
    /<iframe/gi,
    /<object/gi,
    /<embed/gi,
    /expression\s*\(/gi,
    /vbscript:/gi
  ];
  
  return !dangerousPatterns.some(pattern => pattern.test(input));
};

/**
 * Valida que la entrada no contenga patrones de SQL Injection.
 * Busca palabras clave y operadores sospechosos.
 * 
 * @param {string} input - Entrada ya sanitizada
 * @returns {boolean} true si es segura, false si contiene patrones SQLi
 */
export const validateSQLInjection = (input) => {
  if (!input || typeof input !== 'string') return true;
  
  const sqlPatterns = [
    /(\b(select|insert|update|delete|drop|create|alter|exec|execute|union|script)\b)/gi,
    /(--|#|\/\*|\*\/)/g,
    /(\b(or|and)\b.*?[=<>].*?['"])/gi,
    /['"]\s*(or|and)\s*['"]/gi,
    /\b(waitfor|delay)\b/gi,
    /\b(cast|convert|substring)\s*\(/gi
  ];
  
  return !sqlPatterns.some(pattern => pattern.test(input));
};

/**
 * Rate limiting básico del lado del cliente.
 * Limita la cantidad de acciones que un usuario puede realizar en un período.
 * 
 * @param {string} key - Identificador único del usuario o acción
 * @param {number} maxRequests - Cantidad máxima permitida
 * @param {number} windowMs - Ventana de tiempo en milisegundos
 * @returns {boolean} true si puede continuar, false si supera el límite
 */
const rateLimitStore = new Map();

export const checkRateLimit = (key, maxRequests = 5, windowMs = 60000) => {
  const now = Date.now();
  const windowStart = now - windowMs;
  
  if (!rateLimitStore.has(key)) {
    rateLimitStore.set(key, []);
  }
  
  const requests = rateLimitStore.get(key).filter(time => time > windowStart);
  
  if (requests.length >= maxRequests) {
    return false;
  }
  
  requests.push(now);
  rateLimitStore.set(key, requests);
  return true;
};