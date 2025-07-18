'use client';

import { useAuth } from '../../../hooks/useAuth';

export default function DashboardPage() {
  const { state } = useAuth();

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Bienvenido al Dashboard</h1>
      <p>Usuario: {state.user?.nombre}</p>
      <p>Correo: {state.user?.correo}</p>
      <p>Rol: {state.user?.role}</p>
    </div>
  );
}