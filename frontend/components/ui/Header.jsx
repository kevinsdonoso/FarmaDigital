'use client'
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, ShoppingCart, User, Package, FileText, Plus, ChevronDown } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { Button } from './Button';

const Header = ({ title, subtitle, showUserSwitcher = false }) => {
  const { state: authState, logout, switchUser } = useAuth();
  const { cart } = useCart();
  const router = useRouter();
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login'); 
  };

  if (!authState.user) return null;

  const cartCount = cart.reduce((sum, item) => sum + item.cantidad, 0);

  const getNavigationItems = () => {
    switch (authState.user?.role) {
      case 'cliente':
        return [
          { href: '/dashboard', label: 'Catálogo', icon: Package },
          { href: '/historialCompras', label: 'Mis Compras', icon: FileText },
          { href: '/carrito', label: `Carrito (${cartCount})`, icon: ShoppingCart, badge: cartCount },
        ];
      case 'vendedor':
        return [
          { href: '/products', label: 'Gestión de Catálogo', icon: Package },
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

  const getAppName = () => {
    switch (authState.user?.role) {
      case 'cliente':
        return 'FarmaDigital';
      case 'vendedor':
        return 'Panel Vendedor';
      case 'auditor':
        return 'Sistema Auditoría';
      default:
        return 'FarmaDigital';
    }
  };

  const getThemeColor = () => {
    switch (authState.user?.role) {
      case 'cliente':
        return 'text-blue-600';
      case 'vendedor':
        return 'text-green-600';
      case 'auditor':
        return 'text-purple-600';
      default:
        return 'text-gray-600';
    }
  };

  const getRoleBadgeColor = () => {
    switch (authState.user?.role) {
      case 'cliente':
        return 'bg-blue-100 text-blue-800';
      case 'vendedor':
        return 'bg-green-100 text-green-800';
      case 'auditor':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo y Título */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Package className={`h-8 w-8 ${getThemeColor()}`} />
              <div className="ml-3">
                <span className="text-xl font-bold text-gray-900">{getAppName()}</span>
                {(title || subtitle) && (
                  <div className="text-sm text-gray-600">
                    {title && <span className="font-medium">{title}</span>}
                    {subtitle && <span className="ml-2">{subtitle}</span>}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Navegación Central */}
          <nav className="hidden md:flex space-x-6">
            {getNavigationItems().map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center ${getThemeColor()} hover:opacity-75 transition-colors relative font-medium`}
                >
                  <IconComponent className="h-4 w-4 mr-2" />
                  {item.label}
                  {item.badge && item.badge > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Usuario y Acciones - ESTA ES LA PARTE UNIVERSAL */}
          <div className="flex items-center space-x-4">
            
            {/* Botones para cambiar usuario (solo para desarrollo) */}
            {showUserSwitcher && (
              <div className="hidden lg:flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => switchUser(1)}
                  className={`text-xs ${authState.user.role === 'cliente' ? 'bg-blue-50 border-blue-300' : ''}`}
                >
                  Cliente
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => switchUser(2)}
                  className={`text-xs ${authState.user.role === 'vendedor' ? 'bg-green-50 border-green-300' : ''}`}
                >
                  Vendedor
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => switchUser(3)}
                  className={`text-xs ${authState.user.role === 'auditor' ? 'bg-purple-50 border-purple-300' : ''}`}
                >
                  Auditor
                </Button>
              </div>
            )}

            {/* SECCIÓN DE USUARIO - APARECE PARA TODOS LOS ROLES */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-3 bg-gray-50 hover:bg-gray-100 rounded-lg px-3 py-2 transition-colors"
              >
                {/* Avatar del usuario */}
                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-white ${
                  authState.user.role === 'cliente' ? 'bg-blue-500' :
                  authState.user.role === 'vendedor' ? 'bg-green-500' :
                  authState.user.role === 'auditor' ? 'bg-purple-500' : 'bg-gray-500'
                }`}>
                  <User className="h-4 w-4" />
                </div>
                
                {/* Info del usuario */}
                <div className="text-left hidden sm:block">
                  <div className="text-sm font-medium text-gray-900">
                    {authState.user.nombre || 'Usuario'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {authState.user.role?.charAt(0).toUpperCase() + authState.user.role?.slice(1)}
                  </div>
                </div>

                {/* Icono de dropdown */}
                <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${
                  userMenuOpen ? 'rotate-180' : ''
                }`} />
              </button>

              {/* Dropdown del usuario */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  {/* Info del usuario en el dropdown */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white ${
                        authState.user.role === 'cliente' ? 'bg-blue-500' :
                        authState.user.role === 'vendedor' ? 'bg-green-500' :
                        authState.user.role === 'auditor' ? 'bg-purple-500' : 'bg-gray-500'
                      }`}>
                        <User className="h-5 w-5" />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {authState.user.nombre || 'Usuario'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {authState.user.correo || 'Sin email'}
                        </div>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full mt-1 ${getRoleBadgeColor()}`}>
                          {authState.user.role?.charAt(0).toUpperCase() + authState.user.role?.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Opciones del menú */}
                  <div className="py-1">
                    <button
                      onClick={() => {
                        // Aquí puedes agregar navegación al perfil
                        setUserMenuOpen(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <User className="h-4 w-4 mr-3" />
                      Mi Perfil
                    </button>
                    
                    <div className="border-t border-gray-100 my-1"></div>
                    
                    <button
                      onClick={() => {
                        handleLogout();
                        setUserMenuOpen(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cerrar dropdown al hacer click fuera */}
      {userMenuOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setUserMenuOpen(false)}
        ></div>
      )}
    </header>
  );
};

export default Header;