using FarmaDigitalBackend.Models;
using FarmaDigitalBackend.Service.Interface;
using Microsoft.AspNetCore.Mvc;

namespace FarmaDigitalBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ItemCarritoController : ControllerBase
    {
        private readonly IItemCarritoService _service;

        public ItemCarritoController(IItemCarritoService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<List<ItemCarrito>>> GetAll()
        {
            return Ok(await _service.GetAllAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ItemCarrito>> GetById(int id)
        {
            var item = await _service.GetByIdAsync(id);
            if (item == null) return NotFound();
            return Ok(item);
        }

        [HttpGet("carrito/{carritoId}")]
        public async Task<ActionResult<List<ItemCarrito>>> GetByCarritoId(int carritoId)
        {
            return Ok(await _service.GetByCarritoIdAsync(carritoId));
        }

        [HttpPost]
        public async Task<ActionResult> Add(ItemCarrito item)
        {
            await _service.AddAsync(item);
            return CreatedAtAction(nameof(GetById), new { id = item.IdItemCarrito }, item);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, ItemCarrito item)
        {
            if (id != item.IdItemCarrito) return BadRequest();
            await _service.UpdateAsync(item);
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
