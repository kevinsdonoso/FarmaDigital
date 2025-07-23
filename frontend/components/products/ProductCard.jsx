"use client";
/**
 * Componente para mostrar la tarjeta de un producto.
 * - Incluye controles seguros para cantidad y agregar al carrito.
 * - Sanitiza todos los datos antes de mostrarlos o procesarlos.
 * - Aplica rate limiting para prevenir spam de clics y ataques automatizados.
 * - El diseño es responsivo y accesible.
 *
 * Props:
 * @param {Object} producto - Datos del producto a mostrar.
 */

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { Plus, Minus } from 'lucide-react';
// Seguridad: Importa función para sanitizar datos
import { sanitizeInput, checkRateLimit } from '@/lib/security';

export default function ProductCard({ producto }) {
  const router = useRouter();
  const { cart, addToCart } = useCart();
  const [cantidad, setCantidad] = useState(1);

  // Verifica si el producto ya está en el carrito
  const yaEnCarrito = cart.some(item => item.id === producto.idProducto);

  /**
   * handleAgregarCarrito
   * Agrega el producto al carrito de forma segura.
   * - Aplica rate limiting para evitar spam de clics.
   * - Sanitiza los datos antes de agregarlos.
   */
  const handleAgregarCarrito = () => {
    if (!checkRateLimit(`add_to_cart_${producto.idProducto}`, 3, 10000)) {
      console.warn('Rate limit excedido para agregar al carrito');
      return;
    }

    addToCart({
      id: producto.idProducto,
      nombre: sanitizeInput(producto.nombre),
      precio: Number(producto.precio) || 0,
      cantidad: Math.max(1, Math.min(cantidad, stockDisponible))
    });
  };

  /**
   * incrementCantidad / decrementCantidad
   * Controlan el cambio de cantidad de forma segura, respetando el stock.
   */
  const incrementCantidad = () => {
    const maxStock = Number(producto.stock) || 999;
    if (cantidad < maxStock) {
      setCantidad(prev => Math.min(prev + 1, maxStock));
    }
  };
  /**
   * handleCantidadChange
   * Sanitiza y valida el input de cantidad para evitar valores inválidos.
   */
  const decrementCantidad = () => {
    if (cantidad > 1) {
      setCantidad(prev => Math.max(prev - 1, 1));
    }
  };

  /**
   * handleCantidadChange
   * Sanitiza y valida el input de cantidad para evitar valores inválidos.
   */
  const handleCantidadChange = (e) => {
    const inputValue = sanitizeInput(e.target.value);
    const value = parseInt(inputValue) || 1;
    const maxStock = Number(producto.stock) || 999;
    // Validar rango
    if (value >= 1 && value <= maxStock) {
      setCantidad(value);
    } else if (value > maxStock) {
      setCantidad(maxStock);
    } else {
      setCantidad(1);
    }
  };

// Datos sanitizados del producto
  const stockDisponible = Math.max(0, Number(producto.stock) || 0);
  const sinStock = stockDisponible <= 0;
  const precioSanitizado = Number(producto.precio) || 0;
  const nombreSanitizado = sanitizeInput(producto.nombre || 'Producto sin nombre');
  const descripcionSanitizada = sanitizeInput(producto.descripcion || '');

  return (
    <div className="border rounded-lg p-4 shadow-md flex flex-col justify-between bg-white hover:shadow-lg transition-shadow">
      <div>
        <h3 className="text-xl font-bold text-gray-900">{producto.nombre}</h3>
        <p className="text-gray-600 mt-2">{producto.descripcion}</p> 
      </div>

      <div className="mt-4 space-y-3">
        <p className="text-lg font-semibold text-blue-600">
          ${precioSanitizado.toFixed(2)}
        </p>
        
        {/* Selector de cantidad con botones + y - */}
        {!sinStock && (
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Cantidad:</label>
            <div className="flex items-center border border-gray-300 rounded-md">
              {/* Botón de menos */}
              <button
                onClick={decrementCantidad}
                disabled={cantidad <= 1}
                className={`p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-colors ${
                  cantidad <= 1 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                }`}
              >
                <Minus className="h-4 w-4" />
              </button>
              {/*handle cantidad para sanitizar*/}
              <input
                type="number"
                min={1}
                max={stockDisponible}
                value={cantidad}
                onChange={handleCantidadChange}
                className="border-0 px-2 py-1 w-16 text-center focus:ring-0 focus:outline-none"
              />

              {/* Botón de más */}
              <button
                onClick={incrementCantidad}
                disabled={cantidad >= stockDisponible}
                className={`p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-colors ${
                  cantidad >= stockDisponible ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                }`}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Botón de agregar al carrito */}
        <button
          onClick={handleAgregarCarrito}
          disabled={yaEnCarrito || sinStock}
          className={`w-full py-2 px-4 rounded-md transition-colors ${
            yaEnCarrito 
              ? 'bg-gray-400 cursor-not-allowed text-white' 
              : sinStock
              ? 'bg-red-300 cursor-not-allowed text-white'
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          {yaEnCarrito 
            ? 'Agregado al carrito' 
            : sinStock 
            ? 'Producto agotado'
            : 'Agregar al carrito'
          }
        </button>
      </div>
    </div>
  );
}