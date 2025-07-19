'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getProductoById } from '@/lib/api';

export default function FacturaPage() {
  const { id } = useParams();
  const router = useRouter();

  const [producto, setProducto] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [error, setError] = useState('');
  const IVA = 0.12;

  useEffect(() => {
    async function fetchProducto() {
      try {
        const prod = await getProductoById(id);
        setProducto(prod);
      } catch (err) {
        console.error('Error al obtener producto:', err);
        setError('Producto no encontrado');
      }
    }
    fetchProducto();
  }, [id]);

  if (!producto) return <div className="p-4 text-red-600">{error || 'Cargando producto...'}</div>;

  const maxCantidad = producto.esSensible ? 1 : Math.min(5, producto.stock);

  const handleCantidadChange = (e) => {
    const valor = parseInt(e.target.value);
    if (!isNaN(valor)) {
      setCantidad(Math.max(1, Math.min(valor, maxCantidad)));
    }
  };

  const subtotal = cantidad * producto.precio;
  const iva = subtotal * IVA;
  const total = subtotal + iva;

  const handleIrAPago = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user?.userId) {
      setError('Usuario no encontrado en sesión');
      return;
    }

    const facturaPayload = {
      idUsuario: user.userId,
      idProducto: producto.idProducto,
      cantidad,
      precioUnitario: producto.precio,
      subtotal,
      iva,
      total,
      nombreProducto: producto.nombre,
    };

    localStorage.setItem('facturaTemp', JSON.stringify(facturaPayload));
    router.push('/pago');
  };

  return (
    <main className="max-w-xl mx-auto p-4 border rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Factura de: {producto.nombre}</h1>
      <p className="text-gray-600">{producto.descripcion}</p>
      <p className="mt-2 text-sm text-gray-500">Stock disponible: {producto.stock}</p>
      <p className="text-lg mt-2">Precio unitario: ${producto.precio.toFixed(2)}</p>

      <label className="block mt-4">
        Cantidad (máx. {maxCantidad}):
        <input
          type="number"
          value={cantidad}
          min={1}
          max={maxCantidad}
          onChange={handleCantidadChange}
          className="border rounded px-3 py-2 mt-1 w-full"
        />
      </label>

      <div className="mt-4 text-sm">
        <p>Subtotal: ${subtotal.toFixed(2)}</p>
        <p>IVA (12%): ${iva.toFixed(2)}</p>
        <p className="text-lg font-bold mt-2">Total: ${total.toFixed(2)}</p>
      </div>

      {error && <div className="mt-2 text-red-600">{error}</div>}

      <button
        onClick={handleIrAPago}
        className="mt-6 w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
      >
        Continuar al pago
      </button>
    </main>
  );
}