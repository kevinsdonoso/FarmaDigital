'use client'
/**
 * Página principal del sistema de auditoría.
 * - Muestra los registros de auditoría filtrables por acción.
 * - Utiliza componentes seguros y centralizados para mostrar y filtrar datos.
 * - El diseño es responsivo y accesible.
 *
 * Seguridad:
 * - Los datos de logs se obtienen mediante una función centralizada y validada.
 * - El filtro solo permite acciones válidas, evitando manipulación de datos.
 * - El botón de logout elimina la sesión y datos sensibles.
 */
import { useState, useEffect } from 'react';
import { AuditTable } from '@/components/audit/AuditTable';
import Header from '@/components/ui/Header';
import { getLogsAuditoria } from '@/lib/api';
import { useRouteGuard } from '@/hooks/useRouteGuard';
import LogoutButton from '@/components/ui/LogoutButton';

// Opciones de acciones permitidas para filtrar
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

/**
 * fetchLogs
 * Obtiene los registros de auditoría de forma segura.
 * - Utiliza la función centralizada getLogsAuditoria.
 * - Valida que la respuesta sea un array antes de procesar.
 */
async function fetchLogs() {
  try {
    const response = await getLogsAuditoria();
    // Extrae el array de logs
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    return [];
  }
}
export default function AuditPage() {
  const [logs, setLogs] = useState([]);
  const [accionFilter, setAccionFilter] = useState('');
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const status = useRouteGuard({ allowedRoles: [1] }); 

  /**
   * useEffect: carga los logs al montar el componente.
   * - Maneja errores y asegura que el estado se limpie correctamente.
   */
  useEffect(() => {
    const loadLogs = async () => {
      setLoading(true);
      try {
        const data = await fetchLogs();
        setLogs(data);
      } catch (error) {
        setLogs([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadLogs();
    }, []);
  /**
   * useEffect: filtra los logs según la acción seleccionada.
   * - Solo permite acciones válidas.
   */
  useEffect(() => {
    let result = logs || [];
    if (accionFilter) {
      result = result.filter(log =>
        log.accion.toLowerCase() === accionFilter.toLowerCase()
      );
    }
    setFilteredLogs(result);
  }, [accionFilter, logs]);
  // Protección de ruta: solo rol 2 (administrador) puede acceder
    if (status === "loading") return <div>Cargando...</div>;
    if (status === "unauthorized") return null;

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