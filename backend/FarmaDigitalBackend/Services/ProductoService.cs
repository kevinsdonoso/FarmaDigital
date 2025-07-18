using FarmaDigitalBackend.Models;
using FarmaDigitalBackend.Repositories.Interfaces;
using FarmaDigitalBackend.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace FarmaDigitalBackend.Services
{
    public class ProductoService : IProductoService
    {
        private readonly IProductoRepository _productoRepository;

        public ProductoService(IProductoRepository productoRepository)
        {
            _productoRepository = productoRepository;
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
            return new CreatedAtActionResult("GetProduct", "Productos", 
                new { id = nuevoProducto.IdProducto }, nuevoProducto);
        }

        public async Task<IActionResult> UpdateProduct(int id, Producto producto)
        {
            var productoActualizado = await _productoRepository.UpdateProduct(id, producto);
            return productoActualizado != null ? new OkObjectResult(productoActualizado) : new NotFoundResult();
        }

        public async Task<IActionResult> DeleteProduct(int id)
        {
            var eliminado = await _productoRepository.SoftDeleteProduct(id);
            return eliminado ? new NoContentResult() : new NotFoundResult();
        }
    }
}