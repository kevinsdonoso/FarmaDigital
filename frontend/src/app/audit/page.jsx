'use client'
import { useState, useEffect } from 'react';
import { Shield } from 'lucide-react'; 
import { AuditTable } from '@/components/audit/AuditTable';
import Header from '@/components/ui/Header';
import { getLogsAuditoria } from '@/lib/api';

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

const roles = [
  { value: '', label: 'Todos los roles' },
  { value: 'vendedor', label: 'Vendedor' },
  { value: 'auditor', label: 'Auditor' },
  { value: 'cliente', label: 'Cliente' },
  { value: 'desconocido', label: 'Desconocido' }
];

// Simulación de fetch de logs (reemplaza por tu fetch real)
async function fetchLogs() {
  try {
    const data = await getLogsAuditoria();
    console.log('✅ Logs obtenidos:', data);
    return data;
  } catch (error) {
    console.error('❌ Error al obtener logs:', error);
    // Retornar array vacío en caso de error
    return [];
  }
}

export default function AuditPage() {
  const [logs, setLogs] = useState([]);
  const [accionFilter, setAccionFilter] = useState('');
  const [rolFilter, setRolFilter] = useState('');
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
    if (rolFilter) {
      result = result.filter(log =>
        log.usuario?.role?.toLowerCase() === rolFilter.toLowerCase()
      );
    }
    setFilteredLogs(result);
  }, [accionFilter, rolFilter, logs]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
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
            rolFilter={rolFilter}
            acciones={acciones}
            roles={roles}
            onAccionChange={e => setAccionFilter(e.target.value)}
            onRolChange={e => setRolFilter(e.target.value)}
            loading={loading}
          />
        </div>
      </main>
    </div>
  );
}