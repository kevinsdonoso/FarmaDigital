using FarmaDigitalBackend.Models.DTOs;
using FarmaDigitalBackend.Repositories.Interfaces;
using FarmaDigitalBackend.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace FarmaDigitalBackend.Services
{
    public class FacturaService : IFacturaService
    {
        private readonly IFacturaRepository _facturaRepository;
        private readonly IProductoRepository _productoRepository;
        private readonly IUsuarioRepository _usuarioRepository;
        private readonly IUserContextService _userContextService;

        public FacturaService(
            IFacturaRepository facturaRepository,
            IProductoRepository productoRepository,
            IUsuarioRepository usuarioRepository,
            IUserContextService userContextService)
        {
            _facturaRepository = facturaRepository;
            _productoRepository = productoRepository;
            _usuarioRepository = usuarioRepository;
            _userContextService = userContextService;
        }

        public async Task<IActionResult> GetFacturaByIdAsync(int idFactura)
        {
            var userId = _userContextService.GetCurrentUserId();
            var factura = await _facturaRepository.GetFacturaByIdAsync(idFactura);

            if (factura == null || factura.IdUsuario != userId)
            {
                return new NotFoundObjectResult(new { success = false, message = "Factura no encontrada" });
            }

            var detalles = await _facturaRepository.GetDetallesByFacturaAsync(idFactura);

            var usuarios = await _usuarioRepository.GetAllUsersAsync();
            var usuario = usuarios.FirstOrDefault(u => u.IdUsuario == userId);

            var facturaDetalle = new FacturaDetalleDto
            {
                IdFactura = factura.IdFactura,
                NumeroFactura = factura.NumeroFactura,
                FechaEmision = factura.FechaEmision,
                NombreCliente = usuario?.Nombre ?? "Cliente",
                EmailCliente = usuario?.Correo ?? "",
                Subtotal = factura.Subtotal,
                Impuestos = factura.Impuestos,
                Total = factura.Total,
                Estado = factura.Estado,
                Items = new List<FacturaItemDto>()
            };

            foreach (var detalle in detalles)
            {
                var producto = await _productoRepository.GetProductById(detalle.IdProducto);

                facturaDetalle.Items.Add(new FacturaItemDto
                {
                    NombreProducto = producto?.Nombre ?? "Producto",
                    Cantidad = detalle.Cantidad,
                    PrecioUnitario = detalle.PrecioUnitario,
                    Subtotal = detalle.Subtotal
                });
            }

            return new OkObjectResult(new { success = true, data = facturaDetalle });
        }

        public async Task<IActionResult> GetFacturasByUsuarioAsync()
        {
            var userId = _userContextService.GetCurrentUserId();
            var facturas = await _facturaRepository.GetFacturasByUsuarioAsync(userId);

            var facturasDto = facturas.Select(f => new FacturaResumenDto
            {
                IdFactura = f.IdFactura,
                NumeroFactura = f.NumeroFactura,
                FechaEmision = f.FechaEmision,
                Total = f.Total,
                Estado = f.Estado
            }).ToList();

            return new OkObjectResult(new { success = true, data = facturasDto });
        }
    }
}