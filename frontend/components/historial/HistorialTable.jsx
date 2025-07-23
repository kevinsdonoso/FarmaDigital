'use client';
/**
 * Componente de tabla para mostrar el historial de compras del usuario.
 * - Muestra información relevante de cada compra/factura.
 * - Formatea fechas y totales para mejor legibilidad.
 * - Incluye botón seguro para ver el detalle de cada factura.
 * - El diseño es responsivo y accesible.
 *
 * Props:
 * @param {Array} compras - Lista de compras/facturas a mostrar.
 * @param {Function} onVerFactura - Handler para mostrar el detalle de la factura seleccionada.
 */
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Eye } from 'lucide-react';

const HistorialTable = ({ compras, onVerFactura }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-md">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nº Factura
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fecha
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Método de Pago
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estado
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {compras.map((compra) => (
            <tr key={compra.idOrden} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {compra.numeroFactura}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {format(new Date(compra.creadoEn), "d 'de' MMMM 'de' yyyy, HH:mm", { locale: es })}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {compra.metodoPago}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                  ${compra.estado === 'confirmada' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {compra.estado}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${compra.totalFactura.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                <button
                  onClick={() => onVerFactura(compra.idFactura)}
                  className="text-blue-600 hover:text-blue-900 transition-colors"
                  title="Ver detalle de factura"
                >
                  <Eye size={20} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HistorialTable;
