"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getPurchaseHistory, getFacturaById } from '@/lib/api';
import FacturaModal from '@/components/historial/FacturaModal';
import { Clock, Package, ShoppingCart, ArrowLeft, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import LogoutButton from '@/components/ui/LogoutButton';

// ✨ AGREGAR IMPORTS DE SEGURIDAD
import { sanitizeInput, checkRateLimit } from '@/lib/security';

export default function HistorialPage() {
  const router = useRouter();
  const { cart } = useCart();
  const [compras, setCompras] = useState([]);
  const [facturaSeleccionada, setFacturaSeleccionada] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ✨ SANITIZAR CONTADOR DE CARRITO
  const cartItemsCount = Math.max(0, cart.reduce((sum, item) => {
    const cantidad = Number(item.cantidad) || 0;
    return sum + cantidad;
  }, 0));

   // ✨ FUNCIÓN PARA SANITIZAR DATOS DE COMPRAS
  const sanitizeComprasData = (comprasData) => {
    if (!Array.isArray(comprasData)) return [];
    
    return comprasData.map(compra => ({
      ...compra,
      numeroFactura: sanitizeInput(compra.numeroFactura || compra.id || compra.idCompra || ''),
      fecha: sanitizeInput(compra.fecha || compra.fechaCompra || compra.created_at || ''),
      estado: sanitizeInput(compra.estado || compra.estadoCompra || 'Sin estado'),
      total: Number(compra.total || compra.montoTotal || 0),
      productos: Number(compra.productos || compra.cantidadProductos || 0)
    }));
  };

  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        setLoading(true);
        setError('');
        
        console.log('🔄 Cargando historial de compras...');
        const response = await getPurchaseHistory();
        
        console.log('✅ Respuesta del historial:', response);
        
        if (response.success) {
          // ✨ SANITIZAR DATOS DE COMPRAS
          const sanitizedCompras = sanitizeComprasData(response.data || []);
          setCompras(sanitizedCompras);
          console.log(`📦 ${sanitizedCompras.length} compras cargadas`);
        } else {
          setError('No se pudo cargar el historial de compras');
          setCompras([]);
        }
      } catch (err) {
        console.error('❌ Error al cargar historial:', err);
        setError(sanitizeInput(err.message || 'Error al cargar el historial de compras'));
        setCompras([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHistorial();
  }, []);

  // ✨ FUNCIÓN SEGURA PARA VER DETALLE
  const handleVerDetalle = async (idFactura) => {
    // Rate limiting para prevenir spam
    if (!checkRateLimit(`view_detail_${idFactura}`, 5, 30000)) {
      console.warn('Rate limit excedido para ver detalles');
      return;
    }

    // Sanitizar ID de factura
    const sanitizedId = sanitizeInput(idFactura);
    if (!sanitizedId) {
      setError('ID de factura no válido');
      return;
    }

    try {
      console.log('🔍 Cargando detalle de factura:', sanitizedId);
      const facturaDetalle = await getFacturaById(sanitizedId);
      
      if (facturaDetalle.success) {
        setFacturaSeleccionada(facturaDetalle.data);
      } else {
        setError('No se pudo cargar el detalle de la factura');
      }
    } catch (error) {
      console.error('❌ Error al cargar factura:', error);
      setError(sanitizeInput(error.message || 'Error al cargar el detalle de la factura'));
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
      <div className="flex justify-end mb-4">
        <LogoutButton />
      </div>  
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
                    {/* ✨ CONTADOR SANITIZADO */}
                    {cartItemsCount > 99 ? '99+' : cartItemsCount}
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
              {/* ✨ ERROR SANITIZADO */}
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
               {compras.map((compra) => {
                  // ✨ DATOS YA SANITIZADOS
                  const compraId = compra.numeroFactura || `compra-${Date.now()}`;
                  
                  return (
                    <div key={compraId} className="py-6 first:pt-0 hover:bg-gray-50 rounded-lg px-4 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <ShoppingBag className="h-10 w-10 text-blue-600" />
                          </div>
                          
                          <div className="ml-4">
                            <div className="text-lg font-medium text-gray-900">
                              Pedido #{compra.numeroFactura}
                            </div>
                            <div className="text-sm text-gray-500">
                              {compra.fecha}
                            </div>
                            <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                              compra.estado === 'Entregado' || compra.estado === 'completado'
                                ? 'bg-green-100 text-green-800'
                                : compra.estado === 'En tránsito' || compra.estado === 'pendiente'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {compra.estado}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-medium text-gray-900">
                            {/* ✨ TOTAL SANITIZADO */}
                             ${compra.total.toFixed(2)}
                          </div>
                          <div className="flex items-center space-x-3 mt-2">
                            
                            {(compra.numeroFactura || compra.id || compra.idCompra) && (
                              <button
                                onClick={() => handleVerDetalle(compra.idFactura|| compra.id || compra.idCompra)}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                              >
                                Ver detalle
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                  })}
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