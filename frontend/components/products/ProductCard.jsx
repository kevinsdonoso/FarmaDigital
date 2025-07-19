"use client";
import React from "react";
import { useRouter } from "next/navigation";

export default function ProductCard({ producto }) {
  const router = useRouter();

  const handleComprarClick = () => {
    router.push(`/facturacion/${producto.idProducto}`);
  };

  return (
    <div className="border rounded-lg p-4 shadow-md flex flex-col justify-between">
      <div>
        <h3 className="text-xl font-bold">{producto.nombre}</h3>
        <p className="text-gray-600 mt-2">{producto.descripcion}</p>
      </div>
      <div className="mt-4">
        <p className="text-lg font-semibold text-blue-600">${producto.precio.toFixed(2)}</p>
        <button
          onClick={handleComprarClick}
          className="w-full mt-4 bg-green-500 text-white py-2 rounded hover:bg-green-600"
        >
          Comprar
        </button>
      </div>
    </div>
  );
}
