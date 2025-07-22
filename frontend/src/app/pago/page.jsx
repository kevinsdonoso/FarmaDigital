'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { getTarjetas, procesarCompra } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { sanitizeInput, validateUserInput } from "@/lib/security";

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

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 16) value = value.substring(0, 16);
    value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    setNuevaTarjeta({
      ...nuevaTarjeta,
      numeroTarjeta: value
    });
  };

  const handleExpirationDateChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 6) value = value.substring(0, 6);
    if (value.length > 2) {
      value = value.substring(0, 2) + '/' + value.substring(2);
    }
    setNuevaTarjeta({
      ...nuevaTarjeta,
      fechaExpiracion: value
    });
  };

  const handleCVVChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 3) value = value.substring(0, 3);
    setNuevaTarjeta({
      ...nuevaTarjeta,
      cvv: value
    });
  };

  const validateCardInputs = () => {
    // Validación del código 2FA
    if (!validateUserInput(codigo2FA, 'text', {
      minLength: 4,
      maxLength: 8,
      allowEmpty: false,
      regex: /^[0-9a-zA-Z]+$/ // Solo alfanumérico
    })) {
      throw new Error("Código de verificación inválido (4-8 caracteres alfanuméricos)");
    }

    if (metodoPago === "nueva_tarjeta") {
      // Validación de número de tarjeta
      const cardNumber = nuevaTarjeta.numeroTarjeta.replace(/\s+/g, '');
      if (!validateUserInput(cardNumber, 'number', { 
        minLength: 16, 
        maxLength: 16,
        allowEmpty: false
      })) {
        throw new Error("Número de tarjeta inválido (13-16 dígitos)");
      }

      // Validación de fecha de expiración (MM/AAAA)
      const [month, year] = nuevaTarjeta.fechaExpiracion.split('/');
      if (!month || !year || month.length !== 2 || year.length !== 4) {
        throw new Error("Formato de fecha inválido (MM/AAAA)");
      }
      
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1;
      const expMonth = parseInt(month, 10);
      const expYear = parseInt(year, 10);
      
      if (expMonth < 1 || expMonth > 12) {
        throw new Error("Mes de expiración inválido");
      }
      
      if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
        throw new Error("La tarjeta ha expirado");
      }

      // Validación de CVV
      if (!validateUserInput(nuevaTarjeta.cvv, 'number', {
        minLength: 3,
        maxLength: 4,
        allowEmpty: false
      })) {
        throw new Error("CVV inválido (3-4 dígitos)");
      }

      // Validación del nombre del titular
      if (!validateUserInput(nuevaTarjeta.nombreTitular, 'text', {
        minLength: 2,
        maxLength: 50,
        allowEmpty: false,
        regex: /^[a-zA-Z\s]+$/ // Solo letras y espacios
      })) {
        throw new Error("Nombre del titular inválido (solo letras y espacios)");
      }
    }
  };

  const handlePagar = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      validateCardInputs();

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
          idTarjeta: sanitizeInput(idTarjeta),
          codigo2FA: sanitizeInput(codigo2FA)
        };
      } else {
        payload = {
          productos,
          metodoPago: "nueva_tarjeta",
          nuevaTarjeta: {
            numeroTarjeta: sanitizeInput(nuevaTarjeta.numeroTarjeta.replace(/\s+/g, '')),
            fechaExpiracion: sanitizeInput(nuevaTarjeta.fechaExpiracion),
            cvv: sanitizeInput(nuevaTarjeta.cvv),
            nombreTitular: sanitizeInput(nuevaTarjeta.nombreTitular),
            esPrincipal: nuevaTarjeta.esPrincipal,
            codigo2FA: sanitizeInput(codigo2FA)
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
      setError(sanitizeInput(err.message));
    } finally {
      setLoading(false);
    }
  };

  if (!cart || cart.length === 0) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <Button 
          variant="outline"
          onClick={() => router.push('/dashboard/carrito')} 
          className="text-sm px-4 py-2 text-blue-600 border-blue-600 hover:bg-blue-50"
        >
          ← Volver al carrito
        </Button>

        <h1 className="text-3xl font-bold">Método de Pago</h1>

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
                          <p className="font-medium">{sanitizeInput(tarjeta.nombreTitular)}</p>
                          <p className="text-sm text-gray-600">
                            {sanitizeInput(tarjeta.tipoTarjeta)} terminada en {sanitizeInput(tarjeta.ultimosDigitos)}
                          </p>
                          <p className="text-sm text-gray-600">Expira: {sanitizeInput(tarjeta.fechaExpiracion)}</p>
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
                    onChange={handleCardNumberChange}
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
                      onChange={handleExpirationDateChange}
                      className="mt-1 block w-full border rounded-md px-3 py-2"
                      placeholder="MM/AAAA"
                      required
                      maxLength={7}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">CVV</label>
                    <input
                      type="password"
                      value={nuevaTarjeta.cvv}
                      onChange={handleCVVChange}
                      className="mt-1 block w-full border rounded-md px-3 py-2"
                      placeholder="123"
                      required
                      maxLength={4}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nombre del titular</label>
                  <input
                    type="text"
                    value={nuevaTarjeta.nombreTitular}
                    onChange={(e) => setNuevaTarjeta({ 
                      ...nuevaTarjeta, 
                      nombreTitular: sanitizeInput(e.target.value) 
                    })}
                    className="mt-1 block w-full border rounded-md px-3 py-2"
                    placeholder="Como aparece en la tarjeta"
                    required
                    maxLength={50}
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
                  onChange={(e) => setCodigo2FA(sanitizeInput(e.target.value))}
                  className="mt-1 block w-full border rounded-md px-3 py-2"
                  placeholder="Ingrese el código de verificación"
                  required
                  maxLength={8}
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