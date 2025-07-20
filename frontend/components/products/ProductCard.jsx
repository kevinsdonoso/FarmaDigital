"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { Plus, Minus } from 'lucide-react';

export default function ProductCard({ producto }) {
  const router = useRouter();
  const { cart, addToCart } = useCart();
  const [cantidad, setCantidad] = useState(1);

  // Verifica si el producto ya está en el carrito
  const yaEnCarrito = cart.some(item => item.id === producto.idProducto);

  const handleAgregarCarrito = () => {
    addToCart({
      id: producto.idProducto,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: cantidad
    });
  };

  // Control de cantidad con botones + y -
  const incrementCantidad = () => {
    const maxStock = producto.stock || 999; // Si no hay stock definido, permitir hasta 999
    if (cantidad < maxStock) {
      setCantidad(prev => prev + 1);
    }
  };

  const decrementCantidad = () => {
    if (cantidad > 1) {
      setCantidad(prev => prev - 1);
    }
  };

  const handleCantidadChange = (e) => {
    const value = parseInt(e.target.value) || 1;
    const maxStock = producto.stock || 999;
    
    if (value >= 1 && value <= maxStock) {
      setCantidad(value);
    }
  };

  const stockDisponible = producto.stock || 0;
  const sinStock = stockDisponible <= 0;

  return (
    <div className="border rounded-lg p-4 shadow-md flex flex-col justify-between bg-white hover:shadow-lg transition-shadow">
      <div>
        <h3 className="text-xl font-bold text-gray-900">{producto.nombre}</h3>
        <p className="text-gray-600 mt-2">{producto.descripcion}</p>
        
      </div>

      <div className="mt-4 space-y-3">
        <p className="text-lg font-semibold text-blue-600">${producto.precio.toFixed(2)}</p>
        
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

              {/* Input de cantidad */}
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