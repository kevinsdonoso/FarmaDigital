// Datos fake basados en tu base de datos FarmaDigital

export const fakeRoles = [
  { id_rol: 1, nombre_rol: "cliente" },
  { id_rol: 2, nombre_rol: "vendedor" },
  { id_rol: 3, nombre_rol: "auditor" },
];

export const fakeUsuarios = [
  {
    id_usuario: 1,
    nombre: "Juan Perez",
    correo: "juan@example.com",
    password_hash: "hashed_password", // no necesario para frontend fake
    id_rol: 1,
    mfa_activado: false,
    creado_en: "2025-07-01T12:00:00Z",
  },
  {
    id_usuario: 2,
    nombre: "Ana Gomez",
    correo: "ana@example.com",
    password_hash: "hashed_password",
    id_rol: 2,
    mfa_activado: false,
    creado_en: "2025-07-01T12:30:00Z",
  },
  {
    id_usuario: 3,
    nombre: "Carlos Ruiz",
    correo: "carlos@example.com",
    password_hash: "hashed_password",
    id_rol: 3,
    mfa_activado: false,
    creado_en: "2025-07-01T13:00:00Z",
  },
];

export const fakeProductos = [
  {
    id_producto: 1,
    nombre: "Paracetamol",
    descripcion: "Analgésico y antipirético.",
    precio: 2.5,
    stock: 100,
    es_sensible: false,
    categoria: "Analgesico",
    creado_por: 2,
    creado_en: "2025-07-01T14:00:00Z",
  },
  {
    id_producto: 2,
    nombre: "Insulina",
    descripcion: "Medicamento sensible para diabéticos.",
    precio: 25.0,
    stock: 30,
    es_sensible: true,
    categoria: "Medicamentos",
    creado_por: 2,
    creado_en: "2025-07-01T14:30:00Z",
  },
];

export const fakeCarritos = [
  {
    id_carrito: 1,
    id_usuario: 1,
    activo: true,
    creado_en: "2025-07-02T10:00:00Z",
  },
];

export const fakeItemsCarrito = [
  {
    id_item_carrito: 1,
    id_carrito: 1,
    id_producto: 1,
    cantidad: 2,
  },
];

export const fakeOrdenes = [
  {
    id_orden: 1,
    id_usuario: 1,
    id_carrito: 1,
    total: 5.0,
    metodo_pago: "tarjeta",
    estado: "pendiente",
    creado_en: "2025-07-03T12:00:00Z",
  },
];

export const fakeFacturas = [
  {
    id_factura: 1,
    id_orden: 1,
    id_usuario: 1,
    fecha_emision: "2025-07-03T12:30:00Z",
    subtotal: 5.0,
    iva: 0.9,
    total: 5.9,
    metodo_pago: "tarjeta",
    referencia_pago: "PAY123456",
    estado_pago: "aprobado",
  },
];

export const fakeDetalleFactura = [
  {
    id_detalle_factura: 1,
    id_factura: 1,
    id_producto: 1,
    cantidad: 2,
    precio_unitario: 2.5,
    subtotal: 5.0,
  },
];

export const fakeLogsAuditoria = [
  {
    id_log: 1,
    id_usuario: 3,
    accion: "Login exitoso",
    descripcion: "Usuario auditor Carlos inició sesión.",
    direccion_ip: "192.168.1.10",
    creado_en: "2025-07-04T08:00:00Z",
  },
];
