"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart/CartContext";

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

  return (
    <div className="border rounded-lg p-4 shadow-md flex flex-col justify-between">
      <div>
        <h3 className="text-xl font-bold">{producto.nombre}</h3>
        <p className="text-gray-600 mt-2">{producto.descripcion}</p>
      </div>
      <div className="mt-4 space-y-3">
        <p className="text-lg font-semibold text-blue-600">${producto.precio.toFixed(2)}</p>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Cantidad:</label>
          <input
            type="number"
            min={1}
            value={cantidad}
            onChange={e => setCantidad(Number(e.target.value))}
            className="border rounded-md px-2 py-1 w-20 text-center"
          />
        </div>
        <button
          onClick={handleAgregarCarrito}
          disabled={yaEnCarrito}
          className={`w-full py-2 px-4 rounded-md transition-colors ${
            yaEnCarrito 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-green-500 hover:bg-green-600'
          } text-white`}
        >
          {yaEnCarrito ? 'Agregado al carrito' : 'Agregar al carrito'}
        </button>
      </div>
    </div>
  );
}
