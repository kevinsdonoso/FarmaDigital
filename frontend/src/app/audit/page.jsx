'use client'
import { useState, useEffect } from 'react';
import { Shield } from 'lucide-react'; 
import { AuditTable } from '@/components/audit/AuditTable';
import Header from '@/components/ui/Header';
import { getLogsAuditoria } from '@/lib/api';
import LogoutButton from '@/components/ui/LogoutButton';

const acciones = [
  { value: '', label: 'Todas las acciones' },
  { value: 'guardar_tarjeta', label: 'Guardar Tarjeta' },
  { value: 'pago_realizado', label: 'Pago Realizado' },
  { value: 'pago_fallido', label: 'Pago Fallido' },
  { value: 'codigo_2fa_invalido', label: 'Código 2FA Inválido' },
  { value: 'login_exitoso', label: 'Login Exitoso' },
  { value: '2fa_activado_despues_de_registro', label: '2FA Activado' },
  { value: 'primer_login_exitoso', label: 'Primer Login Exitoso' },
  { value: 'intento_login_fallido', label: 'Intento Login Fallido' },
  { value: 'eliminar_producto', label: 'Eliminar Producto' },
  { value: 'actualizar_producto', label: 'Editar Producto' },
  { value: 'crear_producto', label: 'Crear Producto' },
  { value: 'compra_exitosa', label: 'Compra Exitosa' }
];

// Simulación de fetch de logs (reemplaza por tu fetch real)
async function fetchLogs() {
  try {
    const response = await getLogsAuditoria();
    console.log('✅ Logs obtenidos:', response);
    // Extrae el array de logs
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('❌ Error al obtener logs:', error);
    return [];
  }
}
export default function AuditPage() {
  const [logs, setLogs] = useState([]);
  const [accionFilter, setAccionFilter] = useState('');
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLogs = async () => {
      setLoading(true);
      try {
        const data = await fetchLogs();
        setLogs(data);
      } catch (error) {
        console.error('Error cargando logs:', error);
        setLogs([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadLogs();
    }, []);

  useEffect(() => {
    let result = logs || [];
    if (accionFilter) {
      result = result.filter(log =>
        log.accion.toLowerCase() === accionFilter.toLowerCase()
      );
    }
    setFilteredLogs(result);
  }, [accionFilter, logs]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex justify-end mb-4">
        <LogoutButton />
      </div>      
      <Header 
        title="Sistema de Auditoría" 
        subtitle={`${filteredLogs.length} registros encontrados`}
        showUserSwitcher={true} 
      />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Auditoría de Acciones</h2>
              <p className="text-gray-600">Monitoreo y seguimiento de actividades del sistema</p>
            </div>
          </div>

           <AuditTable
            logs={filteredLogs}
            accionFilter={accionFilter}
            acciones={acciones}
            onAccionChange={e => setAccionFilter(e.target.value)}
            loading={loading}
          />
        </div>
      </main>
    </div>
  );
}