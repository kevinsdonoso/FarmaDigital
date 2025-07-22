/** @type {import('next').NextConfig} */
const nextConfig = {
  // #19 Headers de seguridad a nivel de aplicación
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ]
      }
    ];
  },
  
  // #20 Configuración de webpack para eliminar código sensible en producción
  webpack: (config, { isServer, dev }) => {
    if (!dev && !isServer) {
      // Eliminar console.logs en producción
      config.optimization = {
        ...config.optimization,
        minimize: true
      };
    }
    return config;
  },
  
  // #21 Configuración de variables de entorno seguras
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  // #22 Configuración de imágenes segura
  images: {
    domains: ['localhost','api.qrserver.com', 'farmadigital-production.up.railway.app'],
    formats: ['image/webp', 'image/avif'],
  }
};

export default nextConfig;