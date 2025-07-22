import DOMPurify from 'dompurify';

// Sanitización de entrada de datos
export const sanitizeInput = (input) => {
  if (input === null || input === undefined) return '';
  if (typeof input !== 'string') return String(input);
  
  return DOMPurify.sanitize(input, { 
    ALLOWED_TAGS: [], 
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true
  });
};

// Validación de entrada de usuario
export const validateUserInput = (input, type = 'text', options = {}) => {
  if (input === null || input === undefined) return false;
  
  const {
    minLength = 0,
    maxLength = 1000,
    min = -Infinity,
    max = Infinity,
    allowEmpty = false
  } = options;

  switch (type) {
    case 'text':
      if (typeof input !== 'string') return false;
      if (!allowEmpty && input.trim().length === 0) return false;
      return input.length >= minLength && input.length <= maxLength;
      
    case 'number':
      const num = Number(input);
      if (isNaN(num)) return false;
      return num >= min && num <= max;
    
    case 'email':
      if (typeof input !== 'string') return false;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(input) && input.length <= maxLength;
      
    case 'dni':
      if (typeof input !== 'string') return false;
      const dniRegex = /^\d{8,10}$/;
      return dniRegex.test(input);
      
    case 'password':
      if (typeof input !== 'string') return false;
      return input.length >= Math.max(minLength, 8) && input.length <= maxLength;
      
    case 'phone':
      if (typeof input !== 'string') return false;
      const phoneRegex = /^\+?[\d\s\-\(\)]{10,15}$/;
      return phoneRegex.test(input);

    case 'expirationDate':
      if (typeof input !== 'string') return false;
      const dateRegex = /^(0[1-9]|1[0-2])\/\d{4}$/; // MM/YYYY format
      return dateRegex.test(input) && input.length === 7;
      
    default:
      return typeof input === 'string' && input.length >= minLength && input.length <= maxLength;
  }
};

/*/ Validación específica para tarjetas de crédito
export const validateCreditCard = {
  number: (number) => {
    const cleaned = number.replace(/\s+/g, '');
    return validateUserInput(cleaned, 'text', { minLength: 13, maxLength: 19 });
  },
  
  expiration: (date) => {
    if (!/^\d{2}\/\d{4}$/.test(date)) return false;
    
    const [month, year] = date.split('/');
    const monthNum = parseInt(month, 10);
    const yearNum = parseInt(year, 10);
    
    if (monthNum < 1 || monthNum > 12) return false;
    
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    
    if (yearNum < currentYear) return false;
    if (yearNum === currentYear && monthNum < currentMonth) return false;
    
    return true;
  },
  
  cvv: (cvv) => {
    return validateUserInput(cvv, 'text', { minLength: 3, maxLength: 4 });
  },
  
  name: (name) => {
    return validateUserInput(name, 'text', { minLength: 2, maxLength: 50 }) && 
           validateCodeInjection(name) && 
           validateSQLInjection(name);
  }
};

// Formateadores para UI
export const formatCardNumber = (input) => {
  const digits = input.replace(/\D/g, '');
  let formatted = '';
  
  for (let i = 0; i < Math.min(digits.length, 16); i++) {
    if (i > 0 && i % 4 === 0) formatted += ' ';
    formatted += digits[i];
  }
  
  return formatted;
};

export const formatExpirationDate = (input) => {
  const digits = input.replace(/\D/g, '');
  const month = digits.slice(0, 2);
  const year = digits.slice(2, 6);
  
  if (digits.length >= 3) {
    return `${month}/${year}`;
  }
  return month;
};
*/
// Protección contra inyección de código
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

// Validación de SQL Injection
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

// Rate limiting básico (cliente)
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





/*/ ✨ NUEVA FUNCIÓN: Validación de entrada de usuario
export const validateUserInput = (input, type = 'text', options = {}) => {
  if (input === null || input === undefined) return false;
  
  const {
    minLength = 0,
    maxLength = 1000,
    min = -Infinity,
    max = Infinity,
    allowEmpty = false
  } = options;

  switch (type) {
    case 'text':
      if (typeof input !== 'string') return false;
      if (!allowEmpty && input.trim().length === 0) return false;
      return input.length >= minLength && input.length <= maxLength;
      
    case 'number':
      const num = Number(input);
      if (isNaN(num)) return false;
      return num >= min && num <= max;
      case 'email':
      if (typeof input !== 'string') return false;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(input) && input.length <= maxLength;
      
    case 'dni':
      if (typeof input !== 'string') return false;
      const dniRegex = /^\d{8,10}$/;
      return dniRegex.test(input);
      
    case 'password':
      if (typeof input !== 'string') return false;
      return input.length >= Math.max(minLength, 8) && input.length <= maxLength;
      
    case 'phone':
      if (typeof input !== 'string') return false;
      const phoneRegex = /^\+?[\d\s\-\(\)]{10,15}$/;
      return phoneRegex.test(input);
      
    default:
      return typeof input === 'string' && input.length >= minLength && input.length <= maxLength;
  }
};
*/