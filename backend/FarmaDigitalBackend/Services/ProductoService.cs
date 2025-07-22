using FarmaDigitalBackend.Models;
using FarmaDigitalBackend.Repositories.Interfaces;
using FarmaDigitalBackend.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace FarmaDigitalBackend.Services
{
public class ProductoService : IProductoService
    {
        private readonly IProductoRepository _productoRepository;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public ProductoService(IProductoRepository productoRepository, IHttpContextAccessor httpContextAccessor)
        {
            _productoRepository = productoRepository;
            _httpContextAccessor = httpContextAccessor;
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

            // Log personalizado para auditoría
            if (_httpContextAccessor.HttpContext != null)
            {
                _httpContextAccessor.HttpContext.Items["AuditAccion"] = "crear_producto";
                _httpContextAccessor.HttpContext.Items["AuditDescripcion"] = $"Producto '{nuevoProducto.Nombre}' creado correctamente.";
            }

            return new CreatedAtActionResult("GetProduct", "Productos", 
                new { id = nuevoProducto.IdProducto }, nuevoProducto);
        }

        public async Task<IActionResult> UpdateProduct(int id, Producto producto)
        {
            var productoActualizado = await _productoRepository.UpdateProduct(id, producto);

            // Log personalizado para auditoría
            if (_httpContextAccessor.HttpContext != null && productoActualizado != null)
            {
                _httpContextAccessor.HttpContext.Items["AuditAccion"] = "actualizar_producto";
                _httpContextAccessor.HttpContext.Items["AuditDescripcion"] = $"Producto '{productoActualizado.Nombre}' actualizado correctamente.";
            }

            return productoActualizado != null ? new OkObjectResult(productoActualizado) : new NotFoundResult();
        }

        public async Task<IActionResult> DeleteProduct(int id)
        {
            var eliminado = await _productoRepository.SoftDeleteProduct(id);

            // Log personalizado para auditoría
            if (_httpContextAccessor.HttpContext != null && eliminado)
            {
                _httpContextAccessor.HttpContext.Items["AuditAccion"] = "eliminar_producto";
                _httpContextAccessor.HttpContext.Items["AuditDescripcion"] = $"Producto con ID {id} eliminado correctamente.";
            }

            return eliminado ? new NoContentResult() : new NotFoundResult();
        }
    }
}