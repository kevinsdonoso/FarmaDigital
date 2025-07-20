"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getFacturaById, getTarjetas, procesarCompra } from "@/lib/api";
import { loginUser } from '@/lib/api';
import { login as authLogin } from '@/lib/auth';
import { useAuth } from '@/context/AuthProvider';
import { Input } from '@/components/ui/Input';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { useCart } from "@/components/cart/CartContext";

export default function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { login: contextLogin } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await loginUser(form);
      
      console.log('✅ Respuesta del servidor:', res);

      // Error en credenciales
      if (res.error) {
        setError(res.error);
        return;
      }

      // Requiere 2FA
      if (res.requires2FA === true) {
        if (res.qrCode) {
          // Usuario nuevo: primera vez configurando 2FA
          console.log('🔄 Redirigiendo a two-factor-setup con QR');
          const params = new URLSearchParams({
            username: form.username,
            password: form.password,
            qr: res.qrCode
          });
          router.push(`/login/two-factor-setup?${params.toString()}`);
        } else {
          // Usuario recurrente: ya tiene 2FA configurado
          console.log('🔄 Redirigiendo a two-factor');
          const params = new URLSearchParams({
            username: form.username,
            password: form.password
          });
          router.push(`/login/two-factor?${params.toString()}`);
        }
        return;
      }

      // Login exitoso
      if (res.success && res.access_token) {
        console.log('✅ Login exitoso directo');
        
        // Usar nuestro sistema de autenticación integrado
        // El token ya se guardó en loginUser() con la función login()
        
        // Actualizar el contexto de Auth
        contextLogin(res.user_info);
        
        // Redirigir al dashboard
        router.push('/dashboard');
      }

    } catch (err) {
      setError(err.message || 'Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg border border-gray-200 p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Iniciar Sesión</h1>
          <p className="text-gray-600">Ingresa tus credenciales para acceder</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="DNI"
            name="username"
            type="text"
            value={form.username}
            onChange={handleChange}
            placeholder="Ingresa tu DNI o usuario"
            required
          />

          <PasswordInput
            label="Contraseña"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Ingresa tu contraseña"
            required
          />

          {error && (
            <Alert type="error">
              {error}
            </Alert>
          )}

          <Button 
            type="submit" 
            loading={loading} 
            className="w-full h-12 text-base font-medium"
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            ¿No tienes cuenta?{' '}
            <button 
              onClick={() => router.push('/register')}
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              Regístrate aquí
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export function FacturaDetallePage() {
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

export function CarritoPage() {
  const { cart, total, removeFromCart, updateQuantity, clearCart } = useCart();
  const router = useRouter();

  return (
    <div>
      <h1>Carrito de compras</h1>
      {cart.length === 0 ? (
        <p>Tu carrito está vacío.</p>
      ) : (
        <>
          <ul>
            {cart.map((item) => (
              <li key={item.id}>
                {item.nombre} x
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={e => updateQuantity(item.id, Number(e.target.value))}
                  className="w-16 mx-2"
                />
                = ${item.precio * item.quantity}
                <button onClick={() => removeFromCart(item.id)}>Eliminar</button>
              </li>
            ))}
          </ul>
          <div>Total: ${total}</div>
          <button onClick={() => router.push("/pago")}>Pagar</button>
          <button onClick={clearCart}>Vaciar carrito</button>
        </>
      )}
    </div>
  );
}

export function PagoPage() {
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
    esPrincipal: false,
    codigo2FA: ""
  });
  const [codigo2FA, setCodigo2FA] = useState("");
  const [guardarTarjeta, setGuardarTarjeta] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchTarjetas() {
      try {
        const res = await getTarjetas();
        setTarjetas(res.data || []);
        if (!res.data || res.data.length === 0) setMetodoPago("nueva_tarjeta");
      } catch {
        setTarjetas([]);
        setMetodoPago("nueva_tarjeta");
      }
    }
    fetchTarjetas();
  }, []);

  const handlePagar = async (e) => {
    e.preventDefault();
    setError("");
    try {
      let payload = {
        productos: cart.map(item => ({
          idProducto: item.id,
          cantidad: item.quantity
        })),
        metodoPago,
        guardarTarjeta
      };

      if (metodoPago === "tarjeta_existente") {
        payload.idTarjeta = idTarjeta;
        payload.codigo2FA = codigo2FA;
      } else {
        payload.nuevaTarjeta = { ...nuevaTarjeta };
      }

      const res = await procesarCompra(payload);
      clearCart();
      router.push(`/factura/${res.idFactura || res.factura?.id}`);
    } catch (err) {
      setError(err.message || "Error al procesar el pago");
    }
  };

  return (
    <div>
      <h1>Pagar</h1>
      <form onSubmit={handlePagar}>
        {tarjetas.length > 0 && (
          <>
            <label>
              <input
                type="radio"
                checked={metodoPago === "tarjeta_existente"}
                onChange={() => setMetodoPago("tarjeta_existente")}
              />
              Usar tarjeta guardada
            </label>
            <select
              value={idTarjeta}
              onChange={e => setIdTarjeta(e.target.value)}
              disabled={metodoPago !== "tarjeta_existente"}
            >
              <option value="">Selecciona una tarjeta</option>
              {tarjetas.map(t => (
                <option key={t.idTarjeta} value={t.idTarjeta}>
                  {t.tipoTarjeta} ****{t.ultimosDigitos} - {t.nombreTitular}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Código 2FA"
              value={codigo2FA}
              onChange={e => setCodigo2FA(e.target.value)}
              disabled={metodoPago !== "tarjeta_existente"}
              required={metodoPago === "tarjeta_existente"}
            />
            <hr />
            <label>
              <input
                type="radio"
                checked={metodoPago === "nueva_tarjeta"}
                onChange={() => setMetodoPago("nueva_tarjeta")}
              />
              Usar nueva tarjeta
            </label>
          </>
        )}
        {metodoPago === "nueva_tarjeta" && (
          <div>
            <input
              type="text"
              placeholder="Número de tarjeta"
              value={nuevaTarjeta.numeroTarjeta}
              onChange={e => setNuevaTarjeta({ ...nuevaTarjeta, numeroTarjeta: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Fecha de expiración (MM/YYYY)"
              value={nuevaTarjeta.fechaExpiracion}
              onChange={e => setNuevaTarjeta({ ...nuevaTarjeta, fechaExpiracion: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="CVV"
              value={nuevaTarjeta.cvv}
              onChange={e => setNuevaTarjeta({ ...nuevaTarjeta, cvv: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Nombre del titular"
              value={nuevaTarjeta.nombreTitular}
              onChange={e => setNuevaTarjeta({ ...nuevaTarjeta, nombreTitular: e.target.value })}
              required
            />
            <label>
              <input
                type="checkbox"
                checked={nuevaTarjeta.esPrincipal}
                onChange={e => setNuevaTarjeta({ ...nuevaTarjeta, esPrincipal: e.target.checked })}
              />
              Hacer principal
            </label>
            <label>
              <input
                type="checkbox"
                checked={guardarTarjeta}
                onChange={e => setGuardarTarjeta(e.target.checked)}
              />
              Guardar tarjeta para futuras compras
            </label>
            <input
              type="text"
              placeholder="Código 2FA"
              value={nuevaTarjeta.codigo2FA}
              onChange={e => setNuevaTarjeta({ ...nuevaTarjeta, codigo2FA: e.target.value })}
              required
            />
          </div>
        )}
        <div>Total: ${total}</div>
        {error && <div className="text-red-500">{error}</div>}
        <button type="submit">Pagar</button>
      </form>
    </div>
  );
}