import { USE_FAKE_DATA, BASE_URL } from "./config";

export async function registerUser(userData) {
  if (USE_FAKE_DATA) {
    await delay(500);
    return {
      success: true,
      message: 'Usuario registrado exitosamente'
    };
  }
  
  try {
    console.log('Enviando datos al backend:', userData); // Debug
    
    const response = await fetch(`${BASE_URL}/api/Auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        dni: userData.dni,
        nombre: userData.nombre,
        correo: userData.correo,
        password: userData.password
      }),
    });

    console.log('Respuesta del servidor:', response); // Debug
    console.log('Status:', response.status); // Debug
    console.log('Status Text:', response.statusText); // Debug

    const data = await response.json();
    console.log('Datos de respuesta:', data); // Debug

    if (!response.ok) {
      throw new Error(data.error || data.message || data.Message || `Error ${response.status}: ${response.statusText}`);
    }

    return {
      success: true,
      message: data.message || 'Usuario registrado exitosamente',
      data: data
    };
  } catch (error) {
    console.error('Error completo en registro:', error); // Debug
    
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Error de conexión. Verifica que el servidor esté funcionando.');
    }
    
    throw error;
  }
}

export async function loginUser(credentials) {
  if (USE_FAKE_DATA) {
    await delay(500);
    
    // Simular diferentes escenarios con QR dinámico
    if (credentials.username === 'nuevo') {
      // Simular QR único para este usuario
      const fakeSecret = 'JBSWY3DPEHPK3PXP'; // Cambiaría por cada usuario
      const fakeQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=otpauth%3A%2F%2Ftotp%2FFarmaDigital%3A${encodeURIComponent(credentials.username)}%3Fsecret%3D${fakeSecret}%26issuer%3DFarmaDigital`;
      
      return {
        requires2FA: true,
        qrCode: fakeQrUrl
      };
    } else if (credentials.username === 'existente') {
      return {
        requires2FA: true
        // Sin qrCode porque ya está configurado
      };
    } else if (credentials.twoFactorCode) {
      if (credentials.twoFactorCode === '123456') {
        return {
          success: true,
          access_token: 'fake_token_123',
          user_info: {
            id_usuario: 1,
            nombre: 'Usuario Fake',
            correo: 'usuario@fake.com',
            role: 'cliente'
          }
        };
      } else {
        throw new Error('Código 2FA inválido');
      }
    } else {
      return {
        success: true,
        access_token: 'fake_token_123',
        user_info: {
          id_usuario: 1,
          nombre: 'Usuario Fake',
          correo: 'usuario@fake.com',
          role: 'cliente'
        }
      };
    }
  }
  
  try {
    console.log('Enviando credenciales al backend:', credentials);
    
    const requestBody = {
      username: credentials.username,
      password: credentials.password
    };

    if (credentials.twoFactorCode) {
      requestBody.twoFactorCode = credentials.twoFactorCode;
    }

    const response = await fetch(`${BASE_URL}/api/Auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('Respuesta del login:', response);
    console.log('Status:', response.status);
    console.log('OK:', response.ok);
    
    const data = await response.json();
    console.log('Datos de respuesta del login:', data);

    // ✅ FLUJO CORRECTO: Status 400 significa "Necesita 2FA"
    if (response.status === 400) {
      console.log('Status 400 - Requiere 2FA');
      return {
        success: false,
        requires2FA: true,
        qrCode: data.qrCode, // Solo si es primera vez
        message: data.message || 'Requiere autenticación 2FA'
      };
    }

    // ✅ FLUJO CORRECTO: Status 200 significa "Login exitoso"
    if (response.status === 200) {
      console.log('Status 200 - Login exitoso');
      return {
        success: true,
        access_token: data.access_token || data.token || data.Token,
        user_info: data.user_info || data.user || data.User,
        requires2FA: false,
        message: data.message || 'Login exitoso'
      };
    }

    // Para otros status codes, lanzar error
    if (!response.ok) {
      throw new Error(data.error || data.message || data.Message || `Error ${response.status}: ${response.statusText}`);
    }

    // Fallback (no debería llegar aquí)
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
    
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Error de conexión. Verifica que el servidor esté funcionando.');
    }
    
    throw error;
  }
}

// Función auxiliar para simular delay
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}