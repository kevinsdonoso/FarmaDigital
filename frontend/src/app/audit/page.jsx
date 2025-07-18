'use client'
import { useState, useEffect } from 'react';
import { AuditTable } from '../../../components/audit/AuditTable';

const acciones = [
  { value: '', label: 'Todas las acciones' },
  { value: 'INSERT', label: 'Insertar' },
  { value: 'UPDATE', label: 'Actualizar' },
  { value: 'CREATE', label: 'Crear' },
  { value: 'DELETE', label: 'Eliminar' }
];

const roles = [
  { value: '', label: 'Todos los roles' },
  { value: 'admin', label: 'Admin' },
  { value: 'editor', label: 'Editor' },
  { value: 'cliente', label: 'Cliente' }
];

// Simulación de fetch de logs (reemplaza por tu fetch real)
async function fetchLogs() {
  return [
    {
      id_log: 1,
      usuario: { nombre: 'Juan Pérez', correo: 'juan@example.com', role: 'admin' },
      accion: 'INSERT',
      descripcion: 'Usuario creó un registro',
      direccion_ip: '192.168.1.1',
      creado_en: '2024-07-17T10:23:00'
    },
    // ...más logs
  ];
}

export default function AuditPage() {
  const [logs, setLogs] = useState([]);
  const [accionFilter, setAccionFilter] = useState('');
  const [rolFilter, setRolFilter] = useState('');
  const [filteredLogs, setFilteredLogs] = useState([]);

  useEffect(() => {
    fetchLogs().then(data => setLogs(data));
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
        log.usuario.role.toLowerCase() === rolFilter.toLowerCase()
      );
    }
    setFilteredLogs(result);
  }, [accionFilter, rolFilter, logs]);

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Auditoría de Acciones</h2>
      <AuditTable
        logs={filteredLogs}
        accionFilter={accionFilter}
        rolFilter={rolFilter}
        acciones={acciones}
        roles={roles}
        onAccionChange={e => setAccionFilter(e.target.value)}
        onRolChange={e => setRolFilter(e.target.value)}
      />
    </div>
  );
}