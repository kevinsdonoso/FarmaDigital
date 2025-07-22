using FarmaDigitalBackend.Models;
using FarmaDigitalBackend.Models.DTOs;
using FarmaDigitalBackend.Repositories.Interfaces;
using FarmaDigitalBackend.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace FarmaDigitalBackend.Services
{
    public class CompraService : ICompraService
    {
        private readonly IOrdenRepository _ordenRepository;
        private readonly IFacturaRepository _facturaRepository;
        private readonly IProductoRepository _productoRepository;
        private readonly ITarjetaRepository _tarjetaRepository;
        private readonly IUserContextService _userContextService;
        private readonly ITwoFactorService _twoFactorService;
        private readonly IUsuarioRepository _usuarioRepository;
        private readonly ITwoFactorRepository _twoFactorRepository;
        private readonly ILogAuditoriaService _logService;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public CompraService(
            IOrdenRepository ordenRepository,
            IFacturaRepository facturaRepository,
            IProductoRepository productoRepository,
            ITarjetaRepository tarjetaRepository,
            IUserContextService userContextService,
            ITwoFactorService twoFactorService,
            IUsuarioRepository usuarioRepository,
            ITwoFactorRepository twoFactorRepository,
            ILogAuditoriaService logAuditoriaService,
            IHttpContextAccessor httpContextAccessor
        )
        {
            _ordenRepository = ordenRepository;
            _facturaRepository = facturaRepository;
            _productoRepository = productoRepository;
            _tarjetaRepository = tarjetaRepository;
            _userContextService = userContextService;
            _twoFactorService = twoFactorService;
            _usuarioRepository = usuarioRepository;
            _twoFactorRepository = twoFactorRepository;
            _logService = logAuditoriaService;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<IActionResult> ProcesarCompraAsync(CompraDto compraDto)
        {
            var userId = _userContextService.GetCurrentUserId();

            var detallesCompra = await ValidarYCalcularCompraAsync(compraDto.Productos);
            var total = detallesCompra.Sum(d => d.Subtotal);

            var pagoResult = await ProcesarPagoAsync(compraDto, userId);
            if (pagoResult != null) return pagoResult;

            var orden = new Orden
            {
                IdUsuario = userId,
                Total = total,
                MetodoPago = compraDto.MetodoPago == "nueva_tarjeta" ? "Tarjeta de Crédito" : "Tarjeta Guardada",
                Estado = "confirmada",
                CreadoEn = DateTime.UtcNow
            };

            var ordenCreada = await _ordenRepository.CreateOrdenAsync(orden);

            await ActualizarStockProductosAsync(compraDto.Productos);

            var factura = await GenerarFacturaAsync(ordenCreada, detallesCompra);
            if (_httpContextAccessor.HttpContext != null)
            {
                _httpContextAccessor.HttpContext.Items["AuditAccion"] = "compra_exitosa";
                _httpContextAccessor.HttpContext.Items["AuditDescripcion"] = $"Compra realizada exitosamente. Orden #{ordenCreada.IdOrden}, Factura #{factura.NumeroFactura}, Total: {total:C}";
            }
            var response = new CompraResponseDto
            {
                IdOrden = ordenCreada.IdOrden,
                IdFactura = factura.IdFactura,
                NumeroFactura = factura.NumeroFactura,
                Total = total,
                Estado = "completada",
                FechaCompra = ordenCreada.CreadoEn,
                Mensaje = "Compra realizada exitosamente"
            };
            return new OkObjectResult(new { success = true, data = response });
            
        }

        public async Task<IActionResult> GetHistorialComprasAsync()
        {
            var userId = _userContextService.GetCurrentUserId();
            var ordenes = await _ordenRepository.GetOrdenesByUsuarioAsync(userId);

            var historial = new List<object>();

            foreach (var orden in ordenes)
            {
                var factura = await _facturaRepository.GetFacturaByOrdenIdAsync(orden.IdOrden);

                historial.Add(new
                {
                    orden.IdOrden,
                    orden.Total,
                    orden.MetodoPago,
                    orden.Estado,
                    orden.CreadoEn,
                    IdFactura = factura?.IdFactura,
                    NumeroFactura = factura?.NumeroFactura,
                    TotalFactura = factura?.Total
                });
            }

            return new OkObjectResult(new { success = true, data = historial });
        }

        private async Task<List<DetalleCompra>> ValidarYCalcularCompraAsync(List<ItemCompraDto> items)
        {
            var detalles = new List<DetalleCompra>();

            foreach (var item in items)
            {
                var producto = await _productoRepository.GetProductById(item.IdProducto);

                if (producto == null)
                    throw new ArgumentException($"Producto con ID {item.IdProducto} no encontrado");

                if (!producto.Activo)
                    throw new ArgumentException($"Producto {producto.Nombre} no está disponible");

                if (producto.Stock < item.Cantidad)
                    throw new ArgumentException($"Stock insuficiente para {producto.Nombre}. Disponible: {producto.Stock}");

                detalles.Add(new DetalleCompra
                {
                    IdProducto = producto.IdProducto,
                    NombreProducto = producto.Nombre,
                    Cantidad = item.Cantidad,
                    PrecioUnitario = producto.Precio,
                    Subtotal = producto.Precio * item.Cantidad
                });
            }

            return detalles;
        }

        private async Task<IActionResult> ProcesarPagoAsync(CompraDto compraDto, int userId)
        {
            if (compraDto.MetodoPago == "nueva_tarjeta")
            {
                if (compraDto.NuevaTarjeta == null)
                    throw new ArgumentException("Datos de tarjeta requeridos");

                if (compraDto.GuardarTarjeta)
                {
                    var tarjetaService = new TarjetaService(
                        _tarjetaRepository,
                        _userContextService,
                        _twoFactorRepository,
                        _twoFactorService,
                        _logService,
                        _httpContextAccessor
                    );
                    var saveResult = await tarjetaService.GuardarTarjetaAsync(compraDto.NuevaTarjeta);
                    if (saveResult is not OkObjectResult)
                        return saveResult;
                }

                var pagoResult = await SimularProcesoPagoAsync(compraDto.NuevaTarjeta.NumeroTarjeta);
                if (pagoResult != null) return pagoResult;
            }
            else if (compraDto.MetodoPago == "tarjeta_existente")
            {
                if (compraDto.IdTarjeta == null || string.IsNullOrEmpty(compraDto.Codigo2FA))
                    throw new ArgumentException("ID de tarjeta y código de doble factor requeridos");

                var tarjeta = await _tarjetaRepository.GetTarjetaByIdAsync(compraDto.IdTarjeta.Value, userId);
                if (tarjeta == null)
                    throw new ArgumentException("Tarjeta no encontrada");

                var twoFactor = await _twoFactorRepository.GetByUserIdAsync(userId);
                if (twoFactor == null || string.IsNullOrEmpty(twoFactor.SecretKey))
                    return new BadRequestObjectResult(new { success = false, message = "No se encontró configuración de doble factor" });

                var twoFactorResult = await _twoFactorService.ValidateCode(twoFactor.SecretKey, compraDto.Codigo2FA);
                if (!twoFactorResult)
                {
                    // Auditoría automática por middleware

                    return new BadRequestObjectResult(new { success = false, message = "Código de doble factor inválido" });
                }

                    

                var pagoResult = await SimularProcesoPagoAsync("****");
                if (pagoResult != null) return pagoResult;
            }
            else
            {
                throw new ArgumentException("Método de pago no válido");
            }

            return null;
        }

        private async Task<IActionResult?> SimularProcesoPagoAsync(string numeroTarjeta)
        {
            await Task.Delay(1000);
            return null;
        }

        private async Task ActualizarStockProductosAsync(List<ItemCompraDto> items)
        {
            foreach (var item in items)
            {
                var producto = await _productoRepository.GetProductById(item.IdProducto);
                if (producto != null)
                {
                    await _productoRepository.UpdateProduct(producto.IdProducto, new Producto
                    {
                        IdProducto = producto.IdProducto,
                        Nombre = producto.Nombre,
                        Descripcion = producto.Descripcion,
                        Precio = producto.Precio,
                        Stock = producto.Stock - item.Cantidad,
                        EsSensible = producto.EsSensible,
                        Categoria = producto.Categoria,
                        CreadoEn = producto.CreadoEn,
                        CreadoPor = producto.CreadoPor,
                        Activo = producto.Activo
                    });
                }
            }
        }

        private async Task<Factura> GenerarFacturaAsync(Orden orden, List<DetalleCompra> detalles)
        {
            var numeroFactura = GenerarNumeroFactura();
            var subtotal = detalles.Sum(d => d.Subtotal);
            var impuestos = subtotal * 0.19m;
            var total = subtotal + impuestos;

            var factura = new Factura
            {
                IdOrden = orden.IdOrden,
                IdUsuario = orden.IdUsuario,
                NumeroFactura = numeroFactura,
                FechaEmision = DateTime.UtcNow,
                Subtotal = subtotal,
                Impuestos = impuestos,
                Total = total,
                Estado = "emitida"
            };

            var facturaCreada = await _facturaRepository.CreateFacturaAsync(factura);

            foreach (var detalle in detalles)
            {
                var detalleFactura = new DetalleFactura
                {
                    IdFactura = facturaCreada.IdFactura,
                    IdProducto = detalle.IdProducto,
                    Cantidad = detalle.Cantidad,
                    PrecioUnitario = detalle.PrecioUnitario,
                    Subtotal = detalle.Subtotal
                };

                await _facturaRepository.CreateDetalleFacturaAsync(detalleFactura);
            }

            return facturaCreada;
        }

        private string GenerarNumeroFactura()
        {
            var timestamp = DateTime.UtcNow.ToString("yyyyMMddHHmmss");
            var random = new Random().Next(1000, 9999);
            return $"FD-{timestamp}-{random}";
        }
    }

    public class DetalleCompra
    {
        public int IdProducto { get; set; }
        public string NombreProducto { get; set; } = string.Empty;
        public int Cantidad { get; set; }
        public decimal PrecioUnitario { get; set; }
        public decimal Subtotal { get; set; }
    }
}