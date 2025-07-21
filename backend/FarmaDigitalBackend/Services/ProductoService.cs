using FarmaDigitalBackend.Models;
using FarmaDigitalBackend.Repositories.Interfaces;
using FarmaDigitalBackend.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace FarmaDigitalBackend.Services
{
    public class ProductoService : IProductoService
    {
        private readonly IProductoRepository _productoRepository;
        private readonly IUserContextService _userContextService;
        private readonly ILogAuditoriaService _logService;

        public ProductoService(IProductoRepository productoRepository,
            IUserContextService userContextService,
            ILogAuditoriaService logAuditoriaService
)
        {
            _productoRepository = productoRepository;
            _userContextService = userContextService;
            _logService = logAuditoriaService;
        }

        public async Task<IActionResult> GetAllProducts()
        {
            var productos = await _productoRepository.GetAllProducts();
            return new OkObjectResult(productos);
        }

        public async Task<IActionResult> GetProductsWithStock()
        {
            var productos = await _productoRepository.GetProductsWithStock();
            return new OkObjectResult(productos);
        }

        public async Task<IActionResult> GetActiveProducts() // ✅ NUEVO
        {
            var productos = await _productoRepository.GetActiveProducts();
            return new OkObjectResult(productos);
        }

        public async Task<IActionResult> GetActiveProductsWithStock()
        {
            var productos = await _productoRepository.GetActiveProductsWithStock();
            return new OkObjectResult(productos);
        }

        public async Task<IActionResult> GetProductById(int id)
        {
            var producto = await _productoRepository.GetProductById(id);
            return producto != null ? new OkObjectResult(producto) : new NotFoundResult();
        }

        public async Task<IActionResult> CreateProduct(Producto producto)
        {
            producto.CreadoEn = DateTime.UtcNow;
            producto.Activo = true;

            var nuevoProducto = await _productoRepository.CreateProduct(producto);

            var userId = _userContextService.GetCurrentUserId();
            var ip = _userContextService.GetClientIp();

            await _logService.RegistrarAsync(
                userId,
                "crear_producto",
                $"Producto creado: '{nuevoProducto.Nombre}' (Categoría: {nuevoProducto.Categoria}, ID: {nuevoProducto.IdProducto})",
                ip
            );

            return new CreatedAtActionResult("GetProduct", "Productos", 
                new { id = nuevoProducto.IdProducto }, nuevoProducto);
        }

        public async Task<IActionResult> UpdateProduct(int id, Producto producto)
        {
            var productoActualizado = await _productoRepository.UpdateProduct(id, producto);

            if (productoActualizado != null)
            {
                var userId = _userContextService.GetCurrentUserId();
                var ip = _userContextService.GetClientIp();

                await _logService.RegistrarAsync(
                    userId,
                    "modificar_producto",
                    $"Producto modificado: '{productoActualizado.Nombre}' (ID: {productoActualizado.IdProducto})",
                    ip
                );

                return new OkObjectResult(productoActualizado);
            }

            return new NotFoundResult();
        }

        public async Task<IActionResult> DeleteProduct(int id)
        {
            var producto = await _productoRepository.GetProductById(id);
            var eliminado = await _productoRepository.SoftDeleteProduct(id);

            if (eliminado)
            {
                var userId = _userContextService.GetCurrentUserId();
                var ip = _userContextService.GetClientIp();

                await _logService.RegistrarAsync(
                    userId,
                    "eliminar_producto",
                    $"Producto eliminado: '{producto?.Nombre}' (ID: {id})",
                    ip
                );
            }

            return eliminado ? new NoContentResult() : new NotFoundResult();
        }
    }
}