"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { getTarjetas, procesarCompra } from "@/lib/api";
import { Button } from "@/components/ui/Button";

export default function PagoPage() {
  const { cart, total, clearCart } = useCart();
  const router = useRouter();
  const [tarjetas, setTarjetas] = useState([]);
  const [metodoPago, setMetodoPago] = useState("tarjeta_existente");
  const [idTarjeta, setIdTarjeta] = useState("");
  const [nuevaTarjeta, setNuevaTarjeta] = useState({
    numeroTarjeta: "",
    fechaExpiracion: "",
    cvv: "",
    nombreTitular: "",
    esPrincipal: false
  });
  const [codigo2FA, setCodigo2FA] = useState("");
  const [guardarTarjeta, setGuardarTarjeta] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  useEffect(() => {
    if (!cart || cart.length === 0) {
      router.push('/dashboard/carrito');
      return;
    }
    fetchTarjetas();
  }, [cart, router]);

  const fetchTarjetas = async () => {
    try {
      const data = await getTarjetas();
      if (data.success) {
        setTarjetas(data.data);
        if (data.data.length === 0) {
          setMetodoPago("nueva_tarjeta");
        }
      }
    } catch (err) {
      console.error("Error al cargar tarjetas:", err);
      setError("No se pudieron cargar las tarjetas guardadas");
      setMetodoPago("nueva_tarjeta");
    }
  };

  const handlePagar = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!codigo2FA) {
      setError("El código de verificación es requerido");
      setLoading(false);
      return;
    }

    try {
      const productos = cart.map(item => ({
        idProducto: item.id,
        cantidad: item.cantidad
      }));

      let payload;
      if (metodoPago === "tarjeta_existente") {
        if (!idTarjeta) {
          throw new Error("Por favor seleccione una tarjeta");
        }
        payload = {
          productos,
          metodoPago: "tarjeta_existente",
          idTarjeta,
          codigo2FA
        };
      } else {
        if (!nuevaTarjeta.numeroTarjeta || !nuevaTarjeta.fechaExpiracion || 
            !nuevaTarjeta.cvv || !nuevaTarjeta.nombreTitular) {
          throw new Error("Por favor complete todos los campos de la tarjeta");
        }
        payload = {
          productos,
          metodoPago: "nueva_tarjeta",
          nuevaTarjeta: {
            ...nuevaTarjeta,
            codigo2FA
          },
          guardarTarjeta
        };
      }

      const data = await procesarCompra(payload);
      if (!data.success) {
        throw new Error(data.message || "Error al procesar el pago");
      }

      clearCart();
      router.push(`/facturacion/${data.idCompra}`);
    } catch (err) {
      setError(err.message || "Error al procesar el pago");
    } finally {
      setLoading(false);
    }
  };

  if (!cart || cart.length === 0) {
    return null;
  }

  return (
       <div className="max-w-4xl mx-auto p-6">
      {/* Header con botón volver y título centrado */}
      <div className="flex items-center justify-between mb-8">
        <Button 
          variant="outline"
          onClick={() => router.push('/dashboard/carrito')} 
          className="text-sm px-4 py-2 text-blue-600 border-blue-600 hover:bg-blue-50"
        >
          ← Volver al carrito
        </Button>

        <h1 className="text-3xl font-bold">Método de Pago</h1>

        {/* Espacio invisible para balancear el flex */}
        <div className="w-[200px]"></div>
      </div>
      
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handlePagar} className="space-y-6">
            {tarjetas.length > 0 && (
              <div className="flex gap-4 mb-6">
                <button
                  type="button"
                  onClick={() => setMetodoPago("tarjeta_existente")}
                  className={`flex-1 p-4 border rounded-lg transition-colors ${
                    metodoPago === "tarjeta_existente" ? "border-blue-500 bg-blue-50" : "border-gray-200"
                  }`}
                >
                  <h3 className="font-medium">Usar tarjeta guardada</h3>
                </button>
                <button
                  type="button"
                  onClick={() => setMetodoPago("nueva_tarjeta")}
                  className={`flex-1 p-4 border rounded-lg transition-colors ${
                    metodoPago === "nueva_tarjeta" ? "border-blue-500 bg-blue-50" : "border-gray-200"
                  }`}
                >
                  <h3 className="font-medium">Usar nueva tarjeta</h3>
                </button>
              </div>
            )}

            {metodoPago === "tarjeta_existente" && tarjetas.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-medium">Seleccione una tarjeta:</h3>
                <div className="space-y-2">
                  {tarjetas.map((tarjeta) => (
                    <div
                      key={tarjeta.idTarjeta}
                      onClick={() => setIdTarjeta(tarjeta.idTarjeta)}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        idTarjeta === tarjeta.idTarjeta
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{tarjeta.nombreTitular}</p>
                          <p className="text-sm text-gray-600">
                            {tarjeta.tipoTarjeta} terminada en {tarjeta.ultimosDigitos}
                          </p>
                          <p className="text-sm text-gray-600">Expira: {tarjeta.fechaExpiracion}</p>
                        </div>
                        {tarjeta.esPrincipal && (
                          <span className="text-sm text-blue-600">Principal</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {metodoPago === "nueva_tarjeta" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Número de tarjeta</label>
                  <input
                    type="text"
                    value={nuevaTarjeta.numeroTarjeta}
                    onChange={(e) => setNuevaTarjeta({ ...nuevaTarjeta, numeroTarjeta: e.target.value })}
                    className="mt-1 block w-full border rounded-md px-3 py-2"
                    placeholder="4532 1234 5678 1234"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Fecha de expiración</label>
                    <input
                      type="text"
                      value={nuevaTarjeta.fechaExpiracion}
                      onChange={(e) => setNuevaTarjeta({ ...nuevaTarjeta, fechaExpiracion: e.target.value })}
                      className="mt-1 block w-full border rounded-md px-3 py-2"
                      placeholder="MM/AAAA"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">CVV</label>
                    <input
                      type="password"
                      maxLength="4"
                      value={nuevaTarjeta.cvv}
                      onChange={(e) => setNuevaTarjeta({ ...nuevaTarjeta, cvv: e.target.value })}
                      className="mt-1 block w-full border rounded-md px-3 py-2"
                      placeholder="123"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nombre del titular</label>
                  <input
                    type="text"
                    value={nuevaTarjeta.nombreTitular}
                    onChange={(e) => setNuevaTarjeta({ ...nuevaTarjeta, nombreTitular: e.target.value })}
                    className="mt-1 block w-full border rounded-md px-3 py-2"
                    placeholder="Como aparece en la tarjeta"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={guardarTarjeta}
                      onChange={(e) => setGuardarTarjeta(e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-600">Guardar esta tarjeta</span>
                  </label>
                  {guardarTarjeta && (
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={nuevaTarjeta.esPrincipal}
                        onChange={(e) => setNuevaTarjeta({ ...nuevaTarjeta, esPrincipal: e.target.checked })}
                        className="rounded border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-600">Establecer como tarjeta principal</span>
                    </label>
                  )}
                </div>
              </div>
            )}

            <div className="space-y-4 pt-4 border-t">
              <div>
                <label className="block text-sm font-medium text-gray-700">Código de verificación (2FA)</label>
                <input
                  type="text"
                  value={codigo2FA}
                  onChange={(e) => setCodigo2FA(e.target.value)}
                  className="mt-1 block w-full border rounded-md px-3 py-2"
                  placeholder="Ingrese el código de verificación"
                  required
                />
              </div>

              {error && (
                <div className="text-red-600 text-sm p-2 bg-red-50 rounded">{error}</div>
              )}

              <div className="flex justify-between items-center pt-4">
                <div className="text-lg">
                  <span className="font-medium">Total:</span>
                  <span className="ml-2 font-bold">${total.toFixed(2)}</span>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? "Procesando..." : "Pagar ahora"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}