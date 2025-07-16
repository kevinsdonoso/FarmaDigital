using FarmaDigitalBackend.Models;
using FarmaDigitalBackend.Services.Interfaces; // ✅ Debe ser con "s"
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
        public async Task<IActionResult> GetProducts([FromQuery] int? stock)
        {
            if (stock.HasValue && stock.Value == 0)
                return await _productoService.GetProductsWithStock();

            return await _productoService.GetAllProducts();
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetProduct(int id)
        {
            return await _productoService.GetProductById(id);
        }


        [HttpPost]
        public async Task<IActionResult> CreateProduct([FromBody] Producto producto)
        {
            return await _productoService.CreateProduct(producto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduct(int id, [FromBody] Producto producto)
        {
            return await _productoService.UpdateProduct(id, producto);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            return await _productoService.DeleteProduct(id);
        }
    }
}