"use client";
/**
 * Página principal del dashboard de productos.
 * - Muestra el catálogo de productos disponible para el usuario autenticado.
 * - Incluye navegación segura, contador de carrito y manejo de errores.
 * - Todos los datos se sanitizan antes de mostrarse.
 *
 * Seguridad:
 * - Los datos de productos se sanitizan antes de renderizarse.
 * - El contador del carrito se calcula y sanitiza para evitar inconsistencias.
 * - El acceso está protegido por useRouteGuard, permitiendo solo roles autorizados.
 * - Los errores se muestran de forma segura y nunca exponen información sensible.
 * - El botón de logout elimina la sesión y datos sensibles.
 */
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProductos } from "@/lib/api";
import ProductCard from "@/components/products/ProductCard";
import Header from "@/components/ui/Header";
import { Package, ShoppingCart, Clock} from 'lucide-react';
import { useCart } from "@/context/CartContext";
import { useRouteGuard } from "@/hooks/useRouteGuard";
import { sanitizeInput } from '@/lib/security';
import LogoutButton from '@/components/ui/LogoutButton';

export default function DashboardPage() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const { cart } = useCart();

  // Protección de ruta: solo rol 3 (cliente) puede acceder
  const status = useRouteGuard({ allowedRoles: [3] }); 
  /**
   * sanitizeProductData
   * Sanitiza todos los datos de productos antes de renderizarlos.
   * - Evita mostrar información corrupta o peligrosa.
   */
  const sanitizeProductData = (productos) => {
    if (!Array.isArray(productos)) return [];
    
    return productos.map(producto => ({
      ...producto,
      nombre: sanitizeInput(producto.nombre || ''),
      descripcion: sanitizeInput(producto.descripcion || ''),
      categoria: sanitizeInput(producto.categoria || ''),
      // Mantener números como números (precio, stock, etc.)
      precio: Number(producto.precio) || 0,
      stock: Number(producto.stock) || 0,
      idProducto: producto.idProducto || producto.id || producto.id_producto
    }));
  };
  /**
   * useEffect: carga los productos al montar el componente.
   * - Maneja errores y asegura que el estado se limpie correctamente.
   * - Sanitiza los datos recibidos antes de mostrarlos.
   */
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const data = await getProductos();
        const sanitizedData = sanitizeProductData(data);
        setProductos(sanitizedData);
      } catch (err) {
        setError(sanitizeInput(err.message || 'Error desconocido'));
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, []);

  /**
   * cartItemsCount
   * Calcula y sanitiza el número total de productos en el carrito.
   */
  const cartItemsCount = Math.max(0, cart.reduce((sum, item) => {
    const cantidad = Number(item.cantidad) || 0;
    return sum + cantidad;
  }, 0));

    // Returns condicionales según estado y seguridad
  if (status === "loading") return <div>Cargando...</div>;
  if (status === "unauthorized") return null;
  
  // Estado de carga
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header
          title="Bienvenido"
          subtitle="Cargando tu experiencia..."
          showUserSwitcher={true}
        />
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando catálogo...</p>
          </div>
        </div>
      </div>
    );
  }
// Estado de error
  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header
          title="Error"
          subtitle="Problema al cargar el catálogo"
          showUserSwitcher={true}
        />
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center max-w-md mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-red-800 mb-2">Error al cargar productos</h2>
              <p className="text-red-600 mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Reintentar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  // Render principal
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex justify-end mb-4">
        <LogoutButton />
      </div>  
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header con navegación */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-3x font-bold text-gray-900">
                  FarmaDigital
                </h1>
              </div>
            </div>

            {/* Enlaces de navegación */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/dashboard/carrito')}
                className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors relative"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Carrito
                {cartItemsCount > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                    {cartItemsCount > 99 ? '99+' : cartItemsCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => router.push('/dashboard/historial')}
                className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Clock className="h-5 w-5 mr-2" />
                Historial
              </button>
            </div>
          </div>
        </div>

        {/* Contenido del catálogo */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {productos.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay productos disponibles</h3>
              <p className="text-gray-600">No se encontraron productos en el catálogo</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {productos.map((producto) => (
                <ProductCard
                  key={producto.idProducto || producto.id || producto.id_producto}
                  producto={producto}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}