using FarmaDigitalBackend.Models;
using FarmaDigitalBackend.Service.Interface;
using Microsoft.AspNetCore.Mvc;

namespace FarmaDigitalBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FacturaController : ControllerBase
    {
        private readonly IFacturaService _service;

        public FacturaController(IFacturaService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<List<Factura>>> GetAll()
        {
            return Ok(await _service.GetAllAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Factura>> GetById(int id)
        {
            var factura = await _service.GetByIdAsync(id);
            if (factura == null) return NotFound();
            return Ok(factura);
        }

        [HttpGet("usuario/{usuarioId}")]
        public async Task<ActionResult<List<Factura>>> GetByUsuarioId(int usuarioId)
        {
            return Ok(await _service.GetByUsuarioIdAsync(usuarioId));
        }

        [HttpPost]
        public async Task<ActionResult> Add(Factura factura)
        {
            await _service.AddAsync(factura);
            return CreatedAtAction(nameof(GetById), new { id = factura.Id }, factura);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Factura factura)
        {
            if (id != factura.Id) return BadRequest();
            await _service.UpdateAsync(factura);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _service.DeleteAsync(id);
            return NoContent();
        }
    }
}
