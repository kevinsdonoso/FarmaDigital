using FarmaDigitalBackend.Models;
using FarmaDigitalBackend.Service.Interface;
using Microsoft.AspNetCore.Mvc;

namespace FarmaDigitalBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DetalleFacturaController : ControllerBase
    {
        private readonly IDetalleFacturaService _service;

        public DetalleFacturaController(IDetalleFacturaService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<List<DetalleFactura>>> GetAll()
        {
            return Ok(await _service.GetAllAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<DetalleFactura>> GetById(int id)
        {
            var detalle = await _service.GetByIdAsync(id);
            if (detalle == null) return NotFound();
            return Ok(detalle);
        }

        [HttpGet("factura/{facturaId}")]
        public async Task<ActionResult<List<DetalleFactura>>> GetByFacturaId(int facturaId)
        {
            return Ok(await _service.GetByFacturaIdAsync(facturaId));
        }

        [HttpPost]
        public async Task<ActionResult> Add(DetalleFactura detalle)
        {
            await _service.AddAsync(detalle);
            return Ok(detalle);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, DetalleFactura detalle)
        {
            if (id != detalle.IdDetalleFactura) return BadRequest();
            await _service.UpdateAsync(detalle);
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
