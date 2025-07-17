'use client'
import { useState, useEffect } from 'react';

// Simulación de fetch de órdenes (reemplaza por tu fetch real)
async function fetchOrdenes() {
  // Aquí deberías hacer el fetch real a tu API
  return [
    {
      id_orden: 1,
      id_usuario: 101,
      id_carrito: 201,
      total: 150.75,
      metodo_pago: 'Tarjeta',
      estado: 'Completado',
      creado_en: '2024-07-16T10:23:00'
    },
    {
      id_orden: 2,
      id_usuario: 101,
      id_carrito: 202,
      total: 89.99,
      metodo_pago: 'Efectivo',
      estado: 'Pendiente',
      creado_en: '2024-07-17T12:00:00'
    }
    // ...más órdenes
  ];
}

export default function HistorialComprasPage() {
  const [ordenes, setOrdenes] = useState([]);

  useEffect(() => {
    fetchOrdenes().then(data => setOrdenes(data));
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Historial de Compras</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700"># Orden</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Total</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Método de Pago</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Estado</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {ordenes && ordenes.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-3 py-4 text-center text-gray-500">
                  No hay compras registradas.
                </td>
              </tr>
            ) : (
              ordenes.map(orden => (
                <tr key={orden.id_orden} className="hover:bg-blue-50 transition">
                  <td className="px-3 py-2 text-sm text-gray-800">{orden.id_orden}</td>
                  <td className="px-3 py-2 text-sm text-green-700 font-semibold">${orden.total.toFixed(2)}</td>
                  <td className="px-3 py-2 text-sm text-gray-700">{orden.metodo_pago}</td>
                  <td className={`px-3 py-2 text-sm font-semibold ${
                    orden.estado === 'Completado' ? 'text-green-600' : 'text-yellow-600'
                  }`}>{orden.estado}</td>
                  <td className="px-3 py-2 text-sm text-gray-600">{new Date(orden.creado_en).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}