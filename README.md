# FarmaDigital
FarmaDigital es una app web de farmacia que permite buscar productos, hacer pedidos y recibir facturas de forma segura y autónoma. Protege la confidencialidad del usuario y controla el inventario con acceso por roles, integridad de datos y diseño modular adaptable.

## Seguridad del Sistema

### 1. Autenticación y Autorización

#### Backend (C#/.NET)

- **JWT (JSON Web Tokens)**
  - Tokens de acceso con expiración de 35 minutos
  - Tokens firmados con clave secreta
  - Validación de tokens en cada petición
  - Rotación automática de tokens cuando quedan menos de 15 minutos

- **Roles y Permisos**
  - Roles:  Vendedor, Cliente, Auditor
  - Permisos basados en roles:
    - Vendedor: gestión de productos y pedidos
    - Cliente: carrito y compras
    - Auditor: acceso a auditoría

- **Doble Factor de Autenticación (2FA)**
  - Implementación de TOTP (Time-based One-Time Password)
  - Generación de QR para configuración de 2FA
  - Requerido para todos los usuarios
  - Validación de códigos de 2FA en login

#### Frontend (Next.js)

- **Gestión de Tokens**
  - Tokens almacenados en cookies seguras
  - No se usa localStorage para datos sensibles
  - Cookies con flags de seguridad:
    - HttpOnly: true
    - Secure: true
    - SameSite: Strict

- **Sesión y Estado**
  - Estado centralizado con Zustand
  - Validación de sesión en cada petición
  - Detección de múltiples sesiones
  - Rotación automática de tokens

### 2. Protección de Rutas

- **Middleware de Autenticación**
  - Protección de rutas basada en roles
  - Redirección automática a login
  - Validación de tokens en cada petición

- **Rate Limiting**
  - Máximo 5 intentos de login cada 5 minutos
  - Protección contra ataques de fuerza bruta
  - Limite de 50 cambios en formularios cada 10 segundos


### 3. Auditoría y Logging

- **Registro de Acciones**
  - Registro de todas las acciones importantes
  - Almacenamiento de IP y fecha
  - Auditoría de cambios en datos

- **Logging de Seguridad**
  - Registro de intentos fallidos de login
  - Registro de accesos exitosos
  - Monitoreo de sesiones

### 4. Seguridad HTTP

- **Headers de Seguridad**
  - CSP (Content Security Policy)
  - X-Frame-Options: DENY
  - X-Content-Type-Options: nosniff
  - Referrer-Policy: strict-origin-when-cross-origin
  - HSTS (HTTP Strict Transport Security)
  - X-XSS-Protection: 1; mode=block

- **Protección CSRF**
  - Tokens CSRF en formularios
  - Validación de tokens en peticiones POST/PUT/DELETE

### 5. Gestión de Sesiones

- **Detección de Sesiones Múltiples**
  - Identificación única por sesión
  - Cierre automático de sesiones duplicadas
  - Alertas de seguridad

- **Timeout de Sesión**
  - Inactividad: 30 minutos
  - Expulsión automática
  - Mensajes de seguridad

### 6. Protección contra Ataques

- **Prevención de SQL Injection**
  - Uso de parámetros en consultas
  - Validación de entradas
  - Escaping de caracteres especiales

- **Prevención de XSS**
  - Sanitización de datos
  - Uso de DOMPurify
  - Validación de contenido

- **Prevención de CSRF**
  - Tokens CSRF
  - Verificación de origen
  - Headers de seguridad

### 7. Mejores Prácticas Implementadas

- **Cifrado de Datos**
  - Contraseñas con BCrypt
  - Tokens en cookies seguras
  - Datos sensibles encriptados

- **Validación de Datos**
  - Reglas estrictas de validación
  - Sanitización de entradas
  - Validación de tipos

- **Monitoreo y Logging**
  - Registro de eventos
  - Alertas de seguridad
  - Monitoreo de actividad

### 8. Consideraciones de Seguridad Adicionales

- **Actualizaciones de Seguridad**
  - Mantenimiento regular
  - Actualizaciones de dependencias
  - Parches de seguridad

- **Pruebas de Seguridad**
  - Pruebas de penetración
  - Escaneo de vulnerabilidades
  - Pruebas de seguridad

- **Documentación de Seguridad**
  - Guías de seguridad
  - Procedimientos de respuesta
  - Documentación técnica
