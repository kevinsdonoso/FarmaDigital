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
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ====== PRODUCTOS ======

export async function getProductos() {
  if (USE_FAKE_DATA) {
    await delay(300);
    return fakeProductos;
  }
  
  try {
    const res = await fetch(`${BASE_URL}/Productos`);
    if (!res.ok) throw new Error("Error al obtener productos");
    const data = await res.json();
    
    // Mapear la respuesta del backend al formato esperado por el frontend
    return data.map(producto => ({
      id_producto: producto.id,
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      stock: producto.stock,
      es_sensible: producto.esSensible,
      categoria: producto.categoria,
      creado_por: producto.creadoPorId,
      creado_en: producto.creadoEn,
      usuario_creador: producto.usuarioCreador
    }));
  } catch (error) {
    console.error('Error al obtener productos:', error);
    throw error;
  }
}

export async function addProducto(productoData) {
  if (USE_FAKE_DATA) {
    await delay(300);
    return { id_producto: Math.floor(Math.random() * 1000), ...productoData };
  }
  
  try {
    // Mapear datos del frontend al formato esperado por el backend
    const backendData = {
      nombre: productoData.nombre,
      descripcion: productoData.descripcion,
      precio: parseFloat(productoData.precio),
      stock: parseInt(productoData.stock),
      esSensible: productoData.es_sensible,
      categoria: productoData.categoria,
      creadoPorId: productoData.creado_por || null
    };

    const res = await fetch(`${BASE_URL}/Productos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(backendData),
    });
    
    if (!res.ok) throw new Error("Error al agregar producto");
    const data = await res.json();
    
    // Mapear respuesta del backend al formato del frontend
    return {
      id_producto: data.id,
      nombre: data.nombre,
      descripcion: data.descripcion,
      precio: data.precio,
      stock: data.stock,
      es_sensible: data.esSensible,
      categoria: data.categoria,
      creado_por: data.creadoPorId,
      creado_en: data.creadoEn
    };
  } catch (error) {
    console.error('Error al agregar producto:', error);
    throw error;
  }
}

export async function updateProducto(id, productoData) {
  if (USE_FAKE_DATA) {
    await delay(300);
    return { id_producto: id, ...productoData };
  }
  
  try {
    // Mapear datos del frontend al formato esperado por el backend
    const backendData = {
      id: id,
      nombre: productoData.nombre,
      descripcion: productoData.descripcion,
      precio: parseFloat(productoData.precio),
      stock: parseInt(productoData.stock),
      esSensible: productoData.es_sensible,
      categoria: productoData.categoria
    };

    const res = await fetch(`${BASE_URL}/Productos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(backendData),
    });
    
    if (!res.ok) throw new Error("Error al actualizar producto");
    const data = await res.json();
    
    // Mapear respuesta del backend al formato del frontend
    return {
      id_producto: data.id,
      nombre: data.nombre,
      descripcion: data.descripcion,
      precio: data.precio,
      stock: data.stock,
      es_sensible: data.esSensible,
      categoria: data.categoria,
      creado_por: data.creadoPorId,
      creado_en: data.creadoEn
    };
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    throw error;
  }
}

export async function deleteProducto(id) {
  if (USE_FAKE_DATA) {
    await delay(300);
    return { success: true };
  }
  
  try {
    const res = await fetch(`${BASE_URL}/Productos/${id}`, {
      method: "DELETE",
    });
    
    if (!res.ok) throw new Error("Error al eliminar producto");
    return { success: true };
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    throw error;
  }
}

// ... resto de funciones (mantener igual por ahora)