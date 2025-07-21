/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // ❌ REMOVER: swcMinify: true, (ya no es necesario en Next.js 14+)
  
  // ✅ Variables de entorno
  env: {
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    NEXT_PUBLIC_BACKEND_PORT: process.env.NEXT_PUBLIC_BACKEND_PORT,
  },

  // ✅ Headers de seguridad
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;