'use client';
import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { X } from 'lucide-react';

// ✨ IMPORTS DE SEGURIDAD
import { sanitizeInput } from '@/lib/security';

const FacturaModal = ({ factura, onClose }) => {
  if (!factura) return null;

  // ✨ FUNCIÓN PARA SANITIZAR DATOS DE FACTURA
  const sanitizeFacturaData = (facturaData) => {
    if (!facturaData) return null;

    return {
      numeroFactura: sanitizeInput(facturaData.numeroFactura || facturaData.id || ''),
      fechaEmision: facturaData.fechaEmision || facturaData.fecha || new Date().toISOString(),
      estado: sanitizeInput(facturaData.estado || 'Sin estado'),
      nombreCliente: sanitizeInput(facturaData.nombreCliente || facturaData.cliente?.nombre || 'Cliente sin nombre'),
      emailCliente: sanitizeInput(facturaData.emailCliente || facturaData.cliente?.email || ''),
      subtotal: Number(facturaData.subtotal || 0),
      impuestos: Number(facturaData.impuestos || facturaData.tax || 0),
      total: Number(facturaData.total || 0),
      items: Array.isArray(facturaData.items || facturaData.productos) 
        ? (facturaData.items || facturaData.productos).map(item => ({
            nombreProducto: sanitizeInput(item.nombreProducto || item.nombre || 'Producto sin nombre'),
            cantidad: Math.max(0, Number(item.cantidad || 0)),
            precioUnitario: Math.max(0, Number(item.precioUnitario || item.precio || 0)),
            subtotal: Math.max(0, Number(item.subtotal || (item.cantidad * item.precio) || 0))
          }))
        : []
    };
  };

  // ✨ DATOS SANITIZADOS
  const facturaSanitizada = sanitizeFacturaData(factura);

  // ✨ VALIDAR QUE TENGAMOS DATOS MÍNIMOS
  if (!facturaSanitizada || !facturaSanitizada.numeroFactura) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Error al cargar factura</h3>
          <p className="text-gray-600 mb-4">Los datos de la factura no son válidos</p>
          <button
            onClick={onClose}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  return (
  <div className="fixed inset-0 z-50 bg-transparent bg-opacity-10 backdrop-blur-sm flex items-center justify-center p-4">
    <div className="bg-white border border-black shadow-2xl rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto relative">
        
        {/* Header del modal */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Detalle de Factura</h2>
            {/* ✨ NÚMERO SANITIZADO */}
            <p className="text-lg text-gray-600">#{facturaSanitizada.numeroFactura}</p>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
            title="Cerrar"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Contenido del modal */}
        <div className="p-6 space-y-6">
          
          {/* Información general */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Fecha de emisión</p>
                <p className="font-medium">
                  {/* ✨ FECHA SANITIZADA */}
                  {format(new Date(facturaSanitizada.fechaEmision), "d 'de' MMMM 'de' yyyy, HH:mm", { locale: es })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Estado</p>
                <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                  facturaSanitizada.estado === 'Entregado' || facturaSanitizada.estado === 'completado'
                    ? 'bg-green-100 text-green-800'
                    : facturaSanitizada.estado === 'En tránsito' || facturaSanitizada.estado === 'pendiente'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {/* ✨ ESTADO SANITIZADO */}
                  {facturaSanitizada.estado}
                </span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Cliente</p>
                {/* ✨ NOMBRE SANITIZADO */}
                <p className="font-medium">{facturaSanitizada.nombreCliente}</p>
              </div>
              {facturaSanitizada.emailCliente && (
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  {/* ✨ EMAIL SANITIZADO */}
                  <p className="font-medium">{facturaSanitizada.emailCliente}</p>
                </div>
              )}
            </div>
          </div>

          {/* Tabla de productos */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Productos</h3>
            
            {facturaSanitizada.items.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No hay productos en esta factura</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Producto
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cantidad
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Precio Unit.
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subtotal
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {/* ✨ USAR DATOS SANITIZADOS */}
                    {facturaSanitizada.items.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {/* ✨ NOMBRE SANITIZADO */}
                          {item.nombreProducto}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 text-center">
                          {/* ✨ CANTIDAD SANITIZADA */}
                          {item.cantidad}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 text-right">
                          {/* ✨ PRECIO SANITIZADO */}
                          ${item.precioUnitario.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 text-right font-medium">
                          {/* ✨ SUBTOTAL SANITIZADO */}
                          ${item.subtotal.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Totales */}
          <div className="border-t pt-6">
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                {/* ✨ SUBTOTAL SANITIZADO */}
                <span className="font-medium">${facturaSanitizada.subtotal.toFixed(2)}</span>
              </div>
              
              {facturaSanitizada.impuestos > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Impuestos</span>
                  {/* ✨ IMPUESTOS SANITIZADOS */}
                  <span className="font-medium">${facturaSanitizada.impuestos.toFixed(2)}</span>
                </div>
              )}
              
              <div className="flex justify-between text-lg font-bold border-t pt-3">
                <span>Total</span>
                {/* ✨ TOTAL SANITIZADO */}
                <span className="text-blue-600">${facturaSanitizada.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Botón de cerrar en mobile */}
          <div className="flex justify-center pt-4 border-t sm:hidden">
            <button
              onClick={onClose}
              className="w-full bg-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacturaModal;