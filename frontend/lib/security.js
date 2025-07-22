import DOMPurify from 'dompurify';

// #01 Anti-XSS: Sanitización de entrada de datos
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  // Configuración estricta para DOMPurify
  return DOMPurify.sanitize(input, { 
    ALLOWED_TAGS: [], 
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true
  });
};

// #02 Validación de tipos de archivo segura
export const validateFileType = (file, allowedTypes = ['image/jpeg', 'image/png', 'application/pdf']) => {
  if (!file) return false;
  
  // Verificar tipo MIME y extensión
  const fileExtension = file.name.split('.').pop()?.toLowerCase();
  const allowedExtensions = {
    'image/jpeg': ['jpg', 'jpeg'],
    'image/png': ['png'],
    'application/pdf': ['pdf']
  };
  
  const isValidType = allowedTypes.includes(file.type);
  const isValidExtension = allowedTypes.some(type => 
    allowedExtensions[type]?.includes(fileExtension)
  );
  
  const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB max
  
  return isValidType && isValidExtension && isValidSize;
};

// #03 Generación de CSP headers
export const getCSPHeader = () => ({
  'Content-Security-Policy': 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' https://vercel.live; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "img-src 'self' data: https: blob:; " +
    "connect-src 'self' https://farmadigital-production.up.railway.app https://api.qrserver.com; " +
    "frame-ancestors 'none'; " +
    "base-uri 'self'; " +
    "form-action 'self';"
});

// #04 Protección contra inyección de código
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

// #05 Validación de SQL Injection
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

// #06 Rate limiting básico (cliente)
const rateLimitStore = new Map();

export const checkRateLimit = (key, maxRequests = 5, windowMs = 60000) => {
  const now = Date.now();
  const windowStart = now - windowMs;
  
  if (!rateLimitStore.has(key)) {
    rateLimitStore.set(key, []);
  }
  
  const requests = rateLimitStore.get(key).filter(time => time > windowStart);
  
  if (requests.length >= maxRequests) {
    return false; // Rate limit exceeded
  }
  
  requests.push(now);
  rateLimitStore.set(key, requests);
  return true;
};