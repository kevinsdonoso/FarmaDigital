"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { ArrowLeft, ShoppingCart, Trash2, Plus, Minus, Package } from "lucide-react";

// ✨ AGREGAR IMPORTS DE SEGURIDAD
import { sanitizeInput, checkRateLimit } from '@/lib/security';


export default function CarritoPage() {
  const router = useRouter();
  const { cart, total, removeFromCart, updateQuantity, clearCart } = useCart();

  //const cartItemsCount = cart.reduce((sum, item) => sum + item.cantidad, 0);

  // ✨ SANITIZAR CONTADOR DE CARRITO
  const cartItemsCount = Math.max(0, cart.reduce((sum, item) => {
    const cantidad = Number(item.cantidad) || 0;
    return sum + cantidad;
  }, 0));

  // ✨ FUNCIÓN SEGURA PARA ACTUALIZAR CANTIDAD
  const handleUpdateQuantity = (id, newQuantity) => {
    // Validar que newQuantity sea un número positivo
    const sanitizedQuantity = Math.max(0, parseInt(newQuantity) || 0);
    
    // Rate limiting para prevenir spam
    if (!checkRateLimit(`update_cart_${id}`, 10, 30000)) {
      console.warn('Rate limit excedido para actualizar carrito');
      return;
    }

    if (sanitizedQuantity <= 0) {
      removeFromCart(id);
    } else {
      // Limitar cantidad máxima por seguridad
      const maxQuantity = 999;
      const finalQuantity = Math.min(sanitizedQuantity, maxQuantity);
      updateQuantity(id, finalQuantity);
    }
  };

  // ✨ FUNCIÓN SEGURA PARA VACIAR CARRITO
  const handleClearCart = () => {
    // Rate limiting para prevenir spam
    if (!checkRateLimit('clear_cart', 3, 60000)) {
      console.warn('Rate limit excedido para vaciar carrito');
      return;
    }
    clearCart();
  };

    // ✨ SANITIZAR TOTAL
  const sanitizedTotal = Number(total) || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header con navegación - MISMO ESTILO QUE DASHBOARD */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <ShoppingCart className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-3x font-bold text-gray-900">
                  Carrito de Compras
                </h1>
                <p className="text-gray-600 mt-1">
                  {/* ✨ CONTADOR SANITIZADO */}
                  {cartItemsCount} producto{cartItemsCount !== 1 ? 's' : ''} en tu carrito
                </p>
              </div>
            </div>

            {/* Enlaces de navegación */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Package className="h-5 w-5 mr-2" />
                Catálogo
              </button>

              <button
                onClick={() => router.push('/dashboard/historial')}
                className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Historial
              </button>
            </div>
          </div>
        </div>

        {/* Contenido del carrito - MISMO ESTILO DE CONTENEDOR */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Tu carrito está vacío</h3>
              <p className="text-gray-600 mb-4">Agrega productos desde el catálogo</p>
              <button
                onClick={() => router.push('/dashboard')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Ver Catálogo
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Lista de productos del carrito */}
              <div className="lg:col-span-2">
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Productos en tu carrito</h2>
                  <div className="divide-y divide-gray-200">
                    {cart.map((item) => {
                      // ✨ SANITIZAR DATOS DEL ITEM
                      const itemId = item.id || `item-${Date.now()}`;
                      const nombreSanitizado = sanitizeInput(item.nombre || 'Producto sin nombre');
                      const precioSanitizado = Number(item.precio) || 0;
                      const cantidadSanitizada = Math.max(1, Number(item.cantidad) || 1);

                      return (
                        <div key={itemId} className="py-6 first:pt-0">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center flex-1">
                              <div className="ml-4">
                                {/* ✨ NOMBRE SANITIZADO */}
                                <h3 className="text-lg font-medium text-gray-900">{nombreSanitizado}</h3>
                                <p className="text-sm text-gray-500">
                                  ${precioSanitizado.toFixed(2)} c/u
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center space-x-4">
                                                            {/* Control de cantidad */}
                              <div className="flex items-center border border-gray-300 rounded-md">
                                <button
                                  onClick={() => handleUpdateQuantity(itemId, cantidadSanitizada - 1)}
                                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-colors"
                                >
                                  <Minus className="h-4 w-4" />
                                </button>
                                <span className="px-4 py-2 text-sm font-medium border-l border-r border-gray-300">
                                  {/* ✨ CANTIDAD SANITIZADA */}
                                  {cantidadSanitizada}
                                </span>
                                <button
                                  onClick={() => handleUpdateQuantity(itemId, cantidadSanitizada + 1)}
                                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-colors"
                                >
                                  <Plus className="h-4 w-4" />
                                </button>
                              </div>
                              {/* Subtotal */}
                              <div className="text-right min-w-[100px]">
                                <p className="text-lg font-medium text-gray-900">
                                  {/* ✨ SUBTOTAL SANITIZADO */}
                                  ${(precioSanitizado * cantidadSanitizada).toFixed(2)}
                                </p>
                              </div>

                              {/* Botón eliminar */}
                              <button
                                onClick={() => removeFromCart(itemId)}
                                className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              {/* Resumen del carrito */}
              <div className="lg:col-span-1">
                <div className="bg-gray-50 rounded-lg p-6 sticky top-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Resumen del pedido</h3>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Productos ({cartItemsCount})</span>
                      {/* ✨ TOTAL SANITIZADO */}
                      <span>${sanitizedTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Envío</span>
                      <span>Gratis</span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between text-lg font-medium">
                        <span>Total</span>
                        <span>${sanitizedTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 space-y-3">
                    <button 
                      onClick={() => router.push("/pago")}
                      className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Proceder al checkout
                    </button>
                    <button
                      onClick={handleClearCart}
                      className="w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Vaciar carrito
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}