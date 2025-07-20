"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getFacturaById } from "@/lib/api";

export default function FacturaDetallePage() {
  const { id } = useParams();
  const [factura, setFactura] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchFactura() {
      try {
        const data = await getFacturaById(id);
        setFactura(data);
      } catch (err) {
        setError(err.message || "Error al cargar la factura");
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchFactura();
  }, [id]);

  if (loading) return <div>Cargando factura...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!factura) return <div>No se encontró la factura.</div>;

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Factura #{factura.id}</h1>
      <div>
        <strong>Fecha:</strong> {factura.fecha}
      </div>
      <div>
        <strong>Cliente:</strong> {factura.cliente?.nombre}
      </div>
      <div>
        <strong>Total:</strong> ${factura.total}
      </div>
      <h2 className="mt-4 font-semibold">Productos:</h2>
      <ul>
        {factura.productos?.map((prod) => (
          <li key={prod.idProducto}>
            {prod.nombre} x {prod.cantidad} = ${prod.precio * prod.cantidad}
          </li>
        ))}
      </ul>
      {/* Puedes mostrar más detalles según la estructura de tu backend */}
    </div>
  );
}
