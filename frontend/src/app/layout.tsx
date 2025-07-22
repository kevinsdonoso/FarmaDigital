import './globals.css';
import { ReactNode } from 'react';
import Footer from '@/components/ui/Footer';
import { AuthProvider } from '@/context/AuthProvider';
import { CartProvider } from '@/context/CartContext';
import '@/lib/axiosConfig';

export const metadata = {
  title: 'FarmaDigital',
  description: 'Compra de medicamentos en línea de forma segura.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen flex flex-col bg-white antialiased">
        <AuthProvider>
          <CartProvider>
            <main className="flex-1 container mx-auto p-4">{children}</main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}