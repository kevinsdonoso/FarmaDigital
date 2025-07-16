'use client'
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, ShoppingCart, User, Package, FileText, Plus } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { Button } from './Button';

const Header = () => {
  const { state: authState, logout, switchUser } = useAuth();
  const { state: cartState } = useCart();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login'); 
  };

  if (!authState.user) return null;

  const getNavigationItems = () => {
    switch (authState.user?.role) {
      case 'cliente':
        return [
          { href: '/dashboard', label: 'Productos', icon: Package },
          { href: '/carrito', label: `Carrito (${cartState.items.length})`, icon: ShoppingCart },
          { href: '/historialCompras', label: 'Historial', icon: FileText },
        ];
      case 'vendedor':
        return [
          { href: '/products', label: 'Gestión de Productos', icon: Package },
          { href: '/products/addproduct', label: 'Agregar Producto', icon: Plus },
        ];
      case 'auditor':
        return [
          { href: '/audit', label: 'Auditoría', icon: FileText },
        ];
      default:
        return [];
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Package className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold text-gray-900">Farmacia Online</span>
            </div>
          </div>

          <nav className="hidden md:flex space-x-8">
            {getNavigationItems().map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center text-gray-600 hover:text-primary transition-colors"
                >
                  <IconComponent className="h-4 w-4 mr-2" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center space-x-4">
            {/* Botones temporales para cambiar usuario (solo para desarrollo) */}
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => switchUser(1)}
                className="text-xs"
              >
                Cliente
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => switchUser(2)}
                className="text-xs"
              >
                Vendedor
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => switchUser(3)}
                className="text-xs"
              >
                Auditor
              </Button>
            </div>

            <div className="flex items-center text-sm text-gray-600">
              <User className="h-4 w-4 mr-1" />
              {authState.user.nombre}
              <span className="ml-2 px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                {authState.user.role}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Salir
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;