import { NextResponse } from 'next/server';
import { getCSPHeader } from './lib/security';

// Rate limiting simple (memoria)
const rateLimitMap = new Map();

export function middleware(request) {
  const response = NextResponse.next();
  
  // #14 Headers de seguridad
  const securityHeaders = {
    ...getCSPHeader(),
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'X-XSS-Protection': '1; mode=block'
  };
  
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  // #15 Rate limiting básico
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
  const now = Date.now();
  const windowMs = 60000; // 1 minuto
  const maxRequests = 60; // 60 requests por minuto
  
  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, []);
  }
  
  const requests = rateLimitMap.get(ip);
  const validRequests = requests.filter(time => now - time < windowMs);
  
  if (validRequests.length >= maxRequests) {
    return new NextResponse('Too Many Requests', { status: 429 });
  }
  
  validRequests.push(now);
  rateLimitMap.set(ip, validRequests);
  
  // #16 Limpiar rate limit map periódicamente
  if (Math.random() < 0.01) { // 1% de probabilidad
    for (const [key, requests] of rateLimitMap.entries()) {
      const validRequests = requests.filter(time => now - time < windowMs);
      if (validRequests.length === 0) {
        rateLimitMap.delete(key);
      } else {
        rateLimitMap.set(key, validRequests);
      }
    }
  }
  
  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};