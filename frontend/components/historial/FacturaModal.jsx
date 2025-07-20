'use client';
import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { X } from 'lucide-react';

const FacturaModal = ({ factura, onClose }) => {
  if (!factura) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="space-y-6">
          {/* Encabezado */}
          <div className="border-b pb-4">
            <h2 className="text-2xl font-bold text-gray-900">Detalle de Factura</h2>
            <p className="text-lg text-gray-600">{factura.numeroFactura}</p>
          </div>

          {/* Información general */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Fecha de emisión</p>
              <p className="font-medium">
                {format(new Date(factura.fechaEmision), "d 'de' MMMM 'de' yyyy, HH:mm", { locale: es })}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Estado</p>
              <p className="font-medium capitalize">{factura.estado}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Cliente</p>
              <p className="font-medium">{factura.nombreCliente}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{factura.emailCliente}</p>
            </div>
          </div>

          {/* Tabla de items */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">Productos</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Producto
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Cantidad
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Precio Unit.
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {factura.items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.nombreProducto}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                        {item.cantidad}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                        ${item.precioUnitario.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                        ${item.subtotal.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totales */}
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">${factura.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Impuestos</span>
              <span className="font-medium">${factura.impuestos.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>${factura.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacturaModal;
