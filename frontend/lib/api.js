import { USE_FAKE_DATA, BASE_URL } from "./config";
import {
  fakeUsuarios,
  fakeProductos,
  fakeCarritos,
  fakeItemsCarrito,
  fakeOrdenes,
  fakeFacturas,
  fakeDetalleFactura,
  fakeLogsAuditoria,
} from "./fakeData";

// Simula demora en ms
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ====== AUTH ======

export async function loginUser({ correo, password }) {
  if (USE_FAKE_DATA) {
    await delay(300);
    // Simple: si existe el correo, devuelve usuario y token fake
    const user = fakeUsuarios.find((u) => u.correo === correo);
    if (!user) throw new Error("Usuario no encontrado");
    // No verificamos password en fake data, solo simulamos
    return {
      id_usuario: user.id_usuario,
      nombre: user.nombre,
      correo: user.correo,
      id_rol: user.id_rol,
      token: "fake-token-123",
    };
  }

  // Aquí el fetch real a tu backend .NET
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ correo, password }),
  });
  if (!res.ok) throw new Error("Error en login");
  return res.json();
}

// ====== PRODUCTOS ======

export async function getProductos() {
  if (USE_FAKE_DATA) {
    await delay(300);
    return fakeProductos;
  }
  const res = await fetch(`${BASE_URL}/productos`);
  if (!res.ok) throw new Error("Error al obtener productos");
  return res.json();
}

export async function addProducto(productoData) {
  if (USE_FAKE_DATA) {
    await delay(300);
    // Aquí simplemente retorna el producto con id falso generado
    return { id_producto: Math.floor(Math.random() * 1000), ...productoData };
  }
  const res = await fetch(`${BASE_URL}/productos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(productoData),
  });
  if (!res.ok) throw new Error("Error al agregar producto");
  return res.json();
}

// ====== CARRITO ======

export async function getCarrito(id_usuario) {
  if (USE_FAKE_DATA) {
    await delay(300);
    return fakeCarritos.filter((c) => c.id_usuario === id_usuario);
  }
  const res = await fetch(`${BASE_URL}/carrito/${id_usuario}`);
  if (!res.ok) throw new Error("Error al obtener carrito");
  return res.json();
}

export async function addItemCarrito(id_carrito, id_producto, cantidad) {
  if (USE_FAKE_DATA) {
    await delay(300);
    return { id_item_carrito: Math.floor(Math.random() * 1000), id_carrito, id_producto, cantidad };
  }
  const res = await fetch(`${BASE_URL}/carrito/${id_carrito}/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id_producto, cantidad }),
  });
  if (!res.ok) throw new Error("Error al agregar item al carrito");
  return res.json();
}

export async function removeItemCarrito(id_item_carrito) {
  if (USE_FAKE_DATA) {
    await delay(300);
    return { success: true };
  }
  const res = await fetch(`${BASE_URL}/carrito/items/${id_item_carrito}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Error al eliminar item del carrito");
  return res.json();
}

// ====== ORDENES Y FACTURACION ======

export async function crearOrden(ordenData) {
  if (USE_FAKE_DATA) {
    await delay(300);
    return { id_orden: Math.floor(Math.random() * 1000), ...ordenData };
  }
  const res = await fetch(`${BASE_URL}/ordenes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(ordenData),
  });
  if (!res.ok) throw new Error("Error al crear orden");
  return res.json();
}

export async function emitirFactura(facturaData) {
  if (USE_FAKE_DATA) {
    await delay(300);
    return { id_factura: Math.floor(Math.random() * 1000), ...facturaData };
  }
  const res = await fetch(`${BASE_URL}/facturas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(facturaData),
  });
  if (!res.ok) throw new Error("Error al emitir factura");
  return res.json();
}

// ====== AUDITORIA ======

export async function getLogsAuditoria() {
  if (USE_FAKE_DATA) {
    await delay(300);
    return fakeLogsAuditoria;
  }
  const res = await fetch(`${BASE_URL}/auditoria/logs`);
  if (!res.ok) throw new Error("Error al obtener logs de auditoría");
  return res.json();
}
