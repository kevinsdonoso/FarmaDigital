import axios from 'axios';
import { getCurrentToken, login } from "@/lib/auth";
import '@/lib/axiosConfig'; // Importar configuración de axios

export async function registerUser(userData) { 
  try {
    console.log('Enviando datos al backend:', userData); // Debug
    
    const requestData = {
      dni: userData.dni,
      nombre: userData.nombre,
      correo: userData.correo,
      password: userData.password
    };

    const response = await axios.post('/api/Auth/register', requestData);
    
    console.log('Respuesta del servidor:', response); // Debug
    console.log('Status:', response.status); // Debug
    console.log('Data:', response.data); // Debug

    return {
      success: true,
      message: response.data.message || 'Usuario registrado exitosamente',
      data: response.data
    };
  } catch (error) {
    console.error('Error completo en registro:', error); // Debug
    
    if (error.code === 'ERR_NETWORK') {
      throw new Error('Error de conexión. Verifica que el servidor esté funcionando.');
    }
    
    const message = error.response?.data?.error || 
                   error.response?.data?.message || 
                   error.response?.data?.Message || 
                   error.message;
    
    throw new Error(message);
  }
}

export async function loginUser(credentials) {
    try {
    console.log('Enviando credenciales al backend:', credentials);
    
    const requestBody = {
      username: credentials.username,
      password: credentials.password
    };

    if (credentials.twoFactorCode) {
      requestBody.twoFactorCode = credentials.twoFactorCode;
    }

    const response = await axios.post('/api/Auth/login', requestBody);
    
    console.log('Respuesta del login:', response);
    console.log('Status:', response.status);
    console.log('Data:', response.data);
    
    const data = response.data;

    if (response.status === 200 && data.access_token) {
      console.log('Status 200 - Login exitoso');
      login(data.access_token || data.token || data.Token, data.user_info || data.user || data.User);
      
      return {
        success: true,
        access_token: data.access_token || data.token || data.Token,
        user_info: data.user_info || data.user || data.User,
        requires2FA: false,
        message: data.message || 'Login exitoso'
      };
    }
    return {
      success: !data.requires2FA,
      access_token: data.access_token || data.token || data.Token,
      user_info: data.user_info || data.user || data.User,
      requires2FA: data.requires2FA || data.requiresTwoFactor,
      qrCode: data.qrCode,
      message: data.message
    };

  } catch (error) {
    console.error('Error completo en login:', error);
    if (error.response?.status === 400) {
      console.log('Status 400 - Requiere 2FA');
      return {
        success: false,
        requires2FA: true,
        qrCode: error.response.data?.qrCode,
        message: error.response.data?.message || 'Requiere autenticación 2FA'
      };
    }
    
    if (error.code === 'ERR_NETWORK') {
      throw new Error('Error de conexión. Verifica que el servidor esté funcionando.');
    }
    
    const message = error.response?.data?.error || 
                   error.response?.data?.message || 
                   error.response?.data?.Message || 
                   error.message;
    
    throw new Error(message);
  }
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
export async function createFactura(facturaData) {
  try {
    const response = await axios.post('/api/facturas', facturaData);

    return {
      success: true,
      factura: response.data
    };
  } catch (error) {
    console.error('Error al crear factura:', error);
    
    const message = error.response?.data?.message || 
                   error.response?.data?.error || 
                   error.message;
    
    throw new Error(message);
  }
}

export async function getProducts() {
  try {
    const response = await axios.get('api/Productos?activo=true&stock=true');
    return response.data;
  } catch (error) {
    console.error('Error al obtener productos:', error);
    
    const message = error.response?.data?.message || 
                   error.response?.data?.error || 
                   error.message;
    
    throw new Error(message);
  }
}

export async function getProductos() {
  try {
    const response = await axios.get('api/Productos?activo=true');
    return response.data;
  } catch (error) {
    console.error('Error al obtener productos:', error);
    
    const message = error.response?.data?.message || 
                   error.response?.data?.error || 
                   error.message;
    
    throw new Error(message);
  }
}

// ...existing code...

// Agregar nuevo producto
export async function addProducto(productoData) {
  try {
    console.log('Enviando datos del producto:', productoData);
    
    const requestData = {
      nombre: productoData.nombre,
      descripcion: productoData.descripcion,
      precio: parseFloat(productoData.precio),
      stock: parseInt(productoData.stock),
      esSensible: Boolean(productoData.esSensible),
      categoria: productoData.categoria,
      activo: Boolean(productoData.activo ?? true) // Por defecto true
    };

    const response = await axios.post('/api/productos', requestData);
    
    console.log('Respuesta al agregar producto:', response);
    
    return {
      success: true,
      message: response.data.message || 'Producto agregado exitosamente',
      data: response.data
    };
  } catch (error) {
    console.error('Error al agregar producto:', error);
    
    if (error.code === 'ERR_NETWORK') {
      throw new Error('Error de conexión. Verifica que el servidor esté funcionando.');
    }
    
    const message = error.response?.data?.message || 
                   error.response?.data?.error || 
                   error.response?.data?.Message || 
                   error.message;
    
    throw new Error(message);
  }
}

// Editar producto existente
export async function updateProducto(id, productoData) {
  try {
    console.log('Editando producto ID:', id, 'con datos:', productoData);
    
   const requestData = {
      nombre: productoData.nombre,
      descripcion: productoData.descripcion,
      precio: parseFloat(productoData.precio),
      stock: parseInt(productoData.stock),
      esSensible: Boolean(productoData.esSensible),
      categoria: productoData.categoria,
      activo: Boolean(productoData.activo ?? true) // Por defecto true
    };

    // Si tu API usa PUT para actualizar
    const response = await axios.put(`/api/productos/producto?id=${id}`, requestData);
    
    console.log('Respuesta al editar producto:', response);
    
    return {
      success: true,
      message: response.data.message || 'Producto actualizado exitosamente',
      data: response.data
    };
  } catch (error) {
    console.error('Error al editar producto:', error);
    
    if (error.code === 'ERR_NETWORK') {
      throw new Error('Error de conexión. Verifica que el servidor esté funcionando.');
    }
    
    const message = error.response?.data?.message || 
                   error.response?.data?.error || 
                   error.response?.data?.Message || 
                   error.message;
    
    throw new Error(message);
  }
}

// ...existing code...

export async function deleteProducto(id) {
  try {
    const response = await axios.delete(`/api/productos/producto?id=${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar producto:', error);  
    const message = error.response?.data?.message || 
                   error.response?.data?.error || 
                   error.message;
    throw new Error(message);
  }
}


export async function getProductoById(id) {
  try {
    const response = await axios.get(`/api/productos/producto?id=${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener producto:', error);
    
    const message = error.response?.data?.message || 
                   error.response?.data?.error || 
                   error.message;
    
    throw new Error(message);
  }
}

export async function addToCart(productId, quantity = 1) {
  try {
    const response = await axios.post('/api/carrito/agregar', {
      productId,
      quantity
    });
    return response.data;
  } catch (error) {
    console.error('Error al agregar al carrito:', error);
    
    const message = error.response?.data?.message || 
                   error.response?.data?.error || 
                   error.message;
    
    throw new Error(message);
  }
}

export async function getCart() {
  try {
    const response = await axios.get('/api/carrito');
    return response.data;
  } catch (error) {
    console.error('Error al obtener carrito:', error);
    
    const message = error.response?.data?.message || 
                   error.response?.data?.error || 
                   error.message;
    
    throw new Error(message);
  }
}

export async function getPurchaseHistory() {
  try {
    const response = await axios.get('/api/compras/historial');
    return response.data;
  } catch (error) {
    console.error('Error al obtener historial:', error);
    
    const message = error.response?.data?.message || 
                   error.response?.data?.error || 
                   error.message;
    
    throw new Error(message);
  }
}

export async function getAuditLog() {
  try {
    const response = await axios.get('/api/auditoria');
    return response.data;
  } catch (error) {
    console.error('Error al obtener auditoría:', error);
    
    const message = error.response?.data?.message || 
                   error.response?.data?.error || 
                   error.message;
    
    throw new Error(message);
  }
}

// Obtener factura por ID
export async function getFacturaById(idFactura) {
  try {
    const response = await axios.get(`/api/facturas/factura?id=${idFactura}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener detalle de factura:', error);
    
    const message = error.response?.data?.message || 
                   error.response?.data?.error || 
                   error.message;
    
    throw new Error(message);
  }
}

// Obtener tarjetas guardadas
export async function getTarjetas() {
  try {
    const response = await axios.get('/api/tarjetas');
    return response.data;
  } catch (error) {
    console.error('Error al obtener tarjetas:', error);
    const message = error.response?.data?.message || 
                   error.response?.data?.error || 
                   error.message;
    throw new Error(message);
  }
}

// Registrar nueva tarjeta (requiere 2FA)
export async function registrarTarjeta(data) {
  try {
    const response = await axios.post('/api/tarjetas', data);
    return response.data;
  } catch (error) {
    console.error('Error al registrar tarjeta:', error);
    const message = error.response?.data?.message || 
                   error.response?.data?.error || 
                   error.message;
    throw new Error(message);
  }
}

// Enviar código 2FA para tarjeta existente (opcional)
export async function send2FATarjeta(idTarjeta) {
  try {
    const response = await axios.post('/api/tarjetas/send-2fa', { idTarjeta });
    return response.data;
  } catch (error) {
    console.error('Error al enviar código 2FA:', error);
    const message = error.response?.data?.message || 
                   error.response?.data?.error || 
                   error.message;
    throw new Error(message);
  }
}

export async function getUserFromToken() {
  try {
    const response = await axios.get('/api/Identity/user-token');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error al obtener usuario");
  }
}
// Procesar compra
export async function procesarCompra(payload) {
  try {
    const response = await axios.post('/api/compras/procesar', payload);
    return response.data;
  } catch (error) {
    console.error('Error al procesar compra:', error);
    const message = error.response?.data?.message || 
                   error.response?.data?.error || 
                   error.message;
    throw new Error(message);
  }
}


//logs
export async function getLogsAuditoria() {
  try {
    const response = await axios.get('/api/auditoria/logs');
    return response.data;
  } catch (error) {
    console.error('Error al obtener logs de auditoría:', error);
    
    const message = error.response?.data?.message || 
                   error.response?.data?.error || 
                   error.message;
    
    throw new Error(message);
  }
} 

