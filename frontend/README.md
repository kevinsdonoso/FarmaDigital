# FarmaDigital Frontend

Este proyecto es el frontend de FarmaDigital, una plataforma segura para la compra y gestión de medicamentos en línea. Está desarrollado con [Next.js](https://nextjs.org), usando React y TailwindCSS, y se conecta a un backend .NET Core.

## Características principales

- **Autenticación segura** con login, registro y 2FA.
- **Gestión de productos** para clientes y vendedores.
- **Carrito de compras** y proceso de pago con validación avanzada.
- **Historial de compras** y facturación.
- **Panel de auditoría** para roles autorizados.
- **Protección contra ataques comunes** (XSS, SQLi, abuso de formularios) mediante sanitización y rate limiting en el frontend.

## Estructura del proyecto

```
/frontend/
├── public/                            # Archivos públicos (imágenes, íconos, manifest, etc.)
├── src/
│   ├── app/                           # Rutas del frontend (páginas)
│   │   ├── login/page.jsx             # Página de login
│   │   ├── register/page.jsx          # Página de registro
│   │   ├── dashboard/page.jsx         # Página principal tras login
│   │   ├── products/page.jsx          # Vista de productos
│   │   ├── products/addproduct/page.jsx # Agregar producto (rol vendedor)
│   │   ├── carrito/page.jsx           # Carrito de compras
│   │   ├── historial/page.jsx         # Historial de compras
│   │   ├── audit/page.jsx             # Auditoría (rol auditor)
│   │   ├── pago/page.jsx              # Proceso de pago
│   │   └── layout.tsx                 # Layout global (Header/Footer)
│
│   ├── components/                    # Componentes visuales organizados por dominio
│   │   ├── auth/                      # Login, registro, edición de usuario
│   │   ├── products/                  # Tarjetas y tablas de productos
│   │   ├── audit/                     # Tabla de auditoría
│   │   └── ui/                        # Botones, Header, Footer, Modal, etc.
│
│   ├── context/                       # Proveedores de contexto global (auth, carrito, roles)
│   ├── hooks/                         # Hooks personalizados
│   ├── lib/                           # Funciones lógicas, conexión a backend, validaciones, seguridad
│   └── styles/                        # CSS global y Tailwind
│
├── .env.local                         # Variables de entorno (API URL, etc.)
├── package.json                       # Dependencias y scripts
└── README.md                          # Documentación del proyecto
```

## Instalación y ejecución

1. **Instala dependencias:**
   ```bash
   npm install
   # o
   yarn install
   # o
   pnpm install
   ```

2. **Configura variables de entorno:**
   - Copia `.env.example` a `.env.local` y ajusta los valores según tu entorno.

3. **Ejecuta el servidor de desarrollo:**
   ```bash
   npm run dev
   # o
   yarn dev
   # o
   pnpm dev
   # o
   bun dev
   ```

4. **Abre la app en tu navegador:**
   [http://localhost:3000](http://localhost:3000)

## Seguridad en el frontend

- Todas las entradas del usuario se **validan y sanitizan** antes de enviarse al backend.
- Se aplica **rate limiting** en formularios y acciones críticas para prevenir spam y ataques automatizados.
- Los errores se muestran de forma segura y nunca exponen información sensible.
- El diseño y los componentes previenen fugas de información y mantienen la accesibilidad.

## Recursos útiles

- [Next.js Documentation](https://nextjs.org/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [React Documentation](https://react.dev/)

## Despliegue

Puedes desplegar el frontend fácilmente en [Vercel](https://vercel.com/) o cualquier plataforma compatible con Next.js.

---

**¿Dudas o sugerencias?**  
Contacta al equipo de FarmaDigital o revisa la documentación del backend para