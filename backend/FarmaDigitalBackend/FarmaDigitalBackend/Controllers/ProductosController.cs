using FarmaDigitalBackend.Models;
using FarmaDigitalBackend.Service.Interface;
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
        public async Task<ActionResult<List<Producto>>> Get() =>
            Ok(await _productoService.ObtenerTodosAsync());

        [HttpGet("{id}")]
        public async Task<ActionResult<Producto>> Get(int id)
        {
            var producto = await _productoService.ObtenerPorIdAsync(id);
            return producto == null ? NotFound() : Ok(producto);
        }

        [HttpPost]
        public async Task<ActionResult> Post([FromBody] Producto producto)
        {
            await _productoService.CrearAsync(producto);
            return CreatedAtAction(nameof(Get), new { id = producto.Id }, producto);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Put(int id, [FromBody] Producto producto)
        {
            if (id != producto.Id) return BadRequest();
            await _productoService.ActualizarAsync(producto);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            await _productoService.EliminarAsync(id);
            return NoContent();
        }
    }
}
