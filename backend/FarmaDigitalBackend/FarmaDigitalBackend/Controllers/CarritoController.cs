using FarmaDigitalBackend.Models;
using FarmaDigitalBackend.Service.Interface;
using Microsoft.AspNetCore.Mvc;

namespace FarmaDigitalBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CarritoController : ControllerBase
    {
        private readonly ICarritoService _carritoService;

        public CarritoController(ICarritoService carritoService)
        {
            _carritoService = carritoService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Carrito>>> GetAll()
        {
            var carritos = await _carritoService.GetAllAsync();
            return Ok(carritos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Carrito>> GetById(int id)
        {
            var carrito = await _carritoService.GetByIdAsync(id);
            if (carrito == null)
                return NotFound();
            return Ok(carrito);
        }

        [HttpGet("usuario/{usuarioId}")]
        public async Task<ActionResult<List<Carrito>>> GetByUsuario(int usuarioId)
        {
            var carritos = await _carritoService.GetByUsuarioIdAsync(usuarioId);
            return Ok(carritos);
        }

        [HttpPost]
        public async Task<IActionResult> Add([FromBody] Carrito carrito)
        {
            await _carritoService.AddAsync(carrito);
            return CreatedAtAction(nameof(GetById), new { id = carrito.Id }, carrito);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Carrito carrito)
        {
            if (id != carrito.Id)
                return BadRequest();
            await _carritoService.UpdateAsync(carrito);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _carritoService.DeleteAsync(id);
            return NoContent();
        }
    }
}
