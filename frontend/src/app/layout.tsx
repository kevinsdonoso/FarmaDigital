'use client';
import './globals.css';
import { ReactNode, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  
  // Páginas que NO deben mostrar Header y Footer
  const authPages = ['/login', '/register', '/forgot-password'];
  const isAuthPage = authPages.includes(pathname);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Durante el renderizado del servidor, mostrar sin Header/Footer para evitar hidratación
  if (!isClient) {
    return (
      <html lang="es">
        <body className="min-h-screen bg-white antialiased">
          {children}
        </body>
      </html>
    );
  }

  return (
    <html lang="es">
      <body className="min-h-screen bg-white antialiased">
        {!isAuthPage && <Header />}
        <main className={isAuthPage ? '' : 'flex-1 container mx-auto p-4'}>
          {children}
        </main>
        {!isAuthPage && <Footer />}
      </body>
    </html>
  );
}