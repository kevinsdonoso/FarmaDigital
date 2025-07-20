using FarmaDigitalBackend.Models;
using FarmaDigitalBackend.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace FarmaDigitalBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductosController : ControllerBase
    {
        private readonly IProductoService _productoService;

        public ProductosController(IProductoService productoService)
        {
            _productoService = productoService;
        }

        [HttpGet]
        public async Task<IActionResult> GetProducts([FromQuery] bool? stock, [FromQuery] bool? activo)
        {
            // Si ambos parámetros están presentes y son true
            if (stock.HasValue && stock.Value && activo.HasValue && activo.Value)
            {
                // Crear un nuevo método en el service para ambos filtros
                return await _productoService.GetActiveProductsWithStock();
            }
            
            // Solo stock
            if (stock.HasValue && stock.Value)
                return await _productoService.GetProductsWithStock();
                
            // Solo activo
            if (activo.HasValue && activo.Value)
                return await _productoService.GetActiveProducts();
        
            // Sin filtros
            return await _productoService.GetAllProducts(); 
        }

        [HttpGet("producto")] 
        public async Task<IActionResult> GetProduct([FromQuery] int id)
        {
            return await _productoService.GetProductById(id);
        }

        [HttpPost]
        public async Task<IActionResult> CreateProduct([FromBody] Producto producto)
        {
            return await _productoService.CreateProduct(producto);
        }

        [HttpPut("producto")] 
        public async Task<IActionResult> UpdateProduct([FromQuery] int id, [FromBody] Producto producto)
        {
            return await _productoService.UpdateProduct(id, producto);
        }

        [HttpDelete("producto")] 
        public async Task<IActionResult> DeleteProduct([FromQuery] int id)
        {
            return await _productoService.DeleteProduct(id);
        }
    }
}