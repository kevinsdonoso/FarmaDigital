import React from 'react';
import { Dropdown } from '../ui/Dropdown';

export const AuditTable = ({
  logs,
  accionFilter,
  rolFilter,
  acciones,
  roles,
  onAccionChange,
  onRolChange,
}) => (
  <div>
    <div className="mb-4 flex flex-wrap gap-4">
      <Dropdown
        label="Filtrar por acción" 
        options={acciones}
        value={accionFilter}
        onChange={onAccionChange}
      />
      <Dropdown
        label="Filtrar por rol"
        options={roles}
        value={rolFilter}
        onChange={onRolChange}
      />
    </div>
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-200 rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Nombre</th>
            <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Correo</th>
            <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Rol</th>
            <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Acción</th>
            <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Descripción</th>
            <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">IP</th>
            <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Fecha</th>
          </tr>
        </thead>
        <tbody>
          {logs && logs.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-3 py-4 text-center text-gray-500">
                No hay registros para mostrar.
              </td>
            </tr>
          ) : (
            logs.map(log => (
              <tr key={log.id_log} className="hover:bg-blue-50 transition">
                <td className="px-3 py-2 text-sm text-gray-800">{log.usuario.nombre}</td>
                <td className="px-3 py-2 text-sm text-gray-800">{log.usuario.correo}</td>
                <td className="px-3 py-2 text-sm text-purple-700 font-semibold">{log.usuario.role}</td>
                <td className="px-3 py-2 text-sm text-blue-700 font-semibold">{log.accion}</td>
                <td className="px-3 py-2 text-sm text-gray-700">{log.descripcion}</td>
                <td className="px-3 py-2 text-sm text-gray-700">{log.direccion_ip}</td>
                <td className="px-3 py-2 text-sm text-gray-600">{new Date(log.creado_en).toLocaleString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
);