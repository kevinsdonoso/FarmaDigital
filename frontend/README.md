This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

/frontend/
├── public/                            # Archivos públicos accesibles directamente
│   └── logo.png                       # Imágenes, íconos, manifest, etc.
├── src/
│   ├── app/                           # Rutas del frontend (páginas)
│   │   ├── login/page.jsx             # Página de login
│   │   ├── register/page.jsx          # Página de registro
│   │   ├── reset-password/page.jsx    # Página para restablecer contraseña
│   │   ├── dashboard/page.jsx         # Página principal tras login
│   │   ├── products/page.jsx          # Vista de productos
│   │   ├── addproduct/page.jsx        # Agregar producto (rol vendedor)
│   │   ├── carrito/page.jsx           # Carrito de compras
│   │   ├── historialCompras/page.jsx  # Historial de compras (rol cliente)
│   │   ├── audit/page.jsx             # Auditoría (rol auditor)
│   │   ├── facturacion/page.jsx       # Facturación
│   │   └── layout.jsx                 # Layout global (Header/Footer)
│
│   ├── components/                    # Componentes visuales organizados por dominio
│   │   ├── auth/
│   │   │   ├── LoginForm.jsx
│   │   │   ├── RegisterForm.jsx
│   │   │   └── EditUserForm.jsx
│   │   ├── products/
│   │   │   ├── ProductCard.jsx
│   │   │   └── ProductTable.jsx
│   │   ├── audit/
│   │   │   └── AuditTable.jsx
│   │   └── ui/
│   │       ├── Button.jsx
│   │       ├── Header.jsx
│   │       ├── Footer.jsx
│   │       └── Modal.jsx
│
│   ├── context/                       # Proveedores de contexto global
│   │   ├── AuthProvider.jsx
│   │   ├── CartProvider.jsx
│   │   └── RoleProvider.jsx
│
│   ├── hooks/                         # Hooks personalizados
│   │   ├── useAuth.js
│   │   ├── useCart.js
│   │   └── useRole.js
│
│   ├── lib/                           # Funciones lógicas, conexión a backend, validaciones
│   │   ├── api.js                     # Funciones para llamar a tu backend .NET Core
│   │   ├── auth.js                    # Funciones de login/logout, guardar token
│   │   ├── security.js                # Funciones anti-XSS, CSRF, sanitización
│   │   ├── utils.js                   # Otras utilidades: fechas, precios, helpers
│   │   └── validations.js             # Validaciones: formularios, regex, etc.
│
│   └── styles/                        # (Opcional) CSS global si no usas sólo Tailwind
│       └── globals.css
│
├── .eslintrc.json                     # Configuración de linting
├── tailwind.config.js                # Configuración de Tailwind
├── next.config.js                    # Configuración general de Next.js
├── package.json                      # Dependencias y scripts
└── README.md                         # Documentación del proyecto
