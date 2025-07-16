using FarmaDigitalBackend.Models;
using FarmaDigitalBackend.Service.Interface;
using Microsoft.AspNetCore.Mvc;

namespace FarmaDigitalBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdenController : ControllerBase
    {
        private readonly IOrdenService _ordenService;

        public OrdenController(IOrdenService ordenService)
        {
            _ordenService = ordenService;
        }

        [HttpGet]
        public async Task<ActionResult<List<Orden>>> GetAll()
        {
            var ordenes = await _ordenService.GetAllAsync();
            return Ok(ordenes);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Orden>> GetById(int id)
        {
            var orden = await _ordenService.GetByIdAsync(id);
            if (orden == null)
                return NotFound();
            return Ok(orden);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Orden orden)
        {
            await _ordenService.AddAsync(orden);
            return CreatedAtAction(nameof(GetById), new { id = orden.IdOrden }, orden);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Orden orden)
        {
            if (id != orden.IdOrden)
                return BadRequest();

            await _ordenService.UpdateAsync(orden);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _ordenService.DeleteAsync(id);
            return NoContent();
        }
    }
}
