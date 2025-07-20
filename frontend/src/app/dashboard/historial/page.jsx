"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getPurchaseHistory, getFacturaById } from '@/lib/api';
import FacturaModal from '@/components/historial/FacturaModal';
import { Clock, Package, ShoppingCart, ArrowLeft, ShoppingBag } from "lucide-react";
import { useCart } from "@/components/cart/CartContext";

export default function HistorialPage() {
  const router = useRouter();
  const { cart } = useCart();
  const [compras, setCompras] = useState([]);
  const [facturaSeleccionada, setFacturaSeleccionada] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const cartItemsCount = cart.reduce((sum, item) => sum + item.cantidad, 0);

  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        setLoading(true);
        setError('');
        
        console.log('🔄 Cargando historial de compras...');
        const response = await getPurchaseHistory();
        
        console.log('✅ Respuesta del historial:', response);
        
        if (response.success) {
          setCompras(response.data || []);
          console.log(`📦 ${response.data?.length || 0} compras cargadas`);
        } else {
          setError('No se pudo cargar el historial de compras');
          setCompras([]);
        }
      } catch (err) {
        console.error('❌ Error al cargar historial:', err);
        setError(err.message || 'Error al cargar el historial de compras');
        setCompras([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHistorial();
  }, []);

  const handleVerDetalle = async (idFactura) => {
    try {
      console.log('🔍 Cargando detalle de factura:', idFactura);
      const facturaDetalle = await getFacturaById(idFactura);
      
      if (facturaDetalle.success) {
        setFacturaSeleccionada(facturaDetalle.data);
      } else {
        setError('No se pudo cargar el detalle de la factura');
      }
    } catch (error) {
      console.error('❌ Error al cargar factura:', error);
      setError('Error al cargar el detalle de la factura');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Cargando historial...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header con navegación - MISMO ESTILO QUE DASHBOARD */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-3x font-bold text-gray-900">
                  Historial de Compras
                </h1>
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
                onClick={() => router.push('/dashboard/carrito')}
                className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors relative"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Carrito
                {cartItemsCount > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                    {cartItemsCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Contenido del historial - MISMO ESTILO DE CONTENEDOR */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-600">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-2 text-sm text-red-700 hover:text-red-900 underline"
              >
                Reintentar
              </button>
            </div>
          )}

          {compras.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay compras registradas</h3>
              <p className="text-gray-600 mb-4">
                {error ? 'Error al cargar las compras' : 'Aún no has realizado ninguna compra'}
              </p>
              <button
                onClick={() => router.push('/dashboard')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Ver Catálogo
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Mis Compras Recientes</h2>
              <div className="divide-y divide-gray-200">
                {compras.map((compra) => (
                  <div key={compra.id || compra.idCompra || compra.numeroFactura} className="py-6 first:pt-0 hover:bg-gray-50 rounded-lg px-4 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <ShoppingBag className="h-10 w-10 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-lg font-medium text-gray-900">
                            Pedido #{compra.numeroFactura || compra.id || compra.idCompra}
                          </div>
                          <div className="text-sm text-gray-500">
                            {compra.fecha || compra.fechaCompra || compra.created_at} • {compra.productos || compra.cantidadProductos || 'N/A'} productos
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-medium text-gray-900">
                          ${(compra.total || compra.montoTotal || 0).toFixed(2)}
                        </div>
                        <div className="flex items-center space-x-3 mt-2">
                          <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                            (compra.estado || compra.estadoCompra) === 'Entregado' || (compra.estado || compra.estadoCompra) === 'completado'
                              ? 'bg-green-100 text-green-800'
                              : (compra.estado || compra.estadoCompra) === 'En tránsito' || (compra.estado || compra.estadoCompra) === 'pendiente'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {compra.estado || compra.estadoCompra || 'Sin estado'}
                          </span>
                          {(compra.numeroFactura || compra.id || compra.idCompra) && (
                            <button
                              onClick={() => handleVerDetalle(compra.numeroFactura || compra.id || compra.idCompra)}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              Ver detalle
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal de detalle de factura */}
        {facturaSeleccionada && (
          <FacturaModal
            factura={facturaSeleccionada}
            onClose={() => setFacturaSeleccionada(null)}
          />
        )}
      </div>
    </div>
  );
}