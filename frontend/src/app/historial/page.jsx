'use client';
import { useEffect, useState } from 'react';
import { getPurchaseHistory, getFacturaById } from '@/lib/api';
import HistorialTable from '@/components/historial/HistorialTable';
import FacturaModal from '@/components/historial/FacturaModal';

export default function HistorialComprasPage() {
  const [compras, setCompras] = useState([]);
  const [facturaSeleccionada, setFacturaSeleccionada] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarHistorial();
  }, []);

  const cargarHistorial = async () => {
    try {
      setLoading(true);
      const data = await getPurchaseHistory();
      if (data.success) {
        setCompras(data.data);
      }
    } catch (err) {
      setError('Error al cargar el historial de compras');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerDetalle = async (idFactura) => {
    try {
      setLoading(true);
      const response = await getFacturaById(idFactura);
      setFacturaSeleccionada(response.data);
    } catch (error) {
      console.error('Error al obtener detalle:', error);
      setError('Error al cargar el detalle de la factura');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Historial de Compras</h1>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      {compras.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <p className="text-gray-500 text-lg">No hay compras registradas aún.</p>
        </div>
      ) : (
        <HistorialTable compras={compras} onVerFactura={handleVerDetalle} />
      )}

      {facturaSeleccionada && (
        <FacturaModal
          factura={facturaSeleccionada}
          onClose={() => setFacturaSeleccionada(null)}
        />
      )}
    </div>
  )
}
