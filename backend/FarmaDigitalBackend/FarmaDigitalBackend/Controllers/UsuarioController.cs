using FarmaDigitalBackend.Models;
using FarmaDigitalBackend.Service.Interface;
using Microsoft.AspNetCore.Mvc;

namespace FarmaDigitalBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsuarioController : ControllerBase
    {
        private readonly IUsuarioService _service;

        public UsuarioController(IUsuarioService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<List<Usuario>>> GetAll()
        {
            var usuarios = await _service.GetAllAsync();
            return Ok(usuarios);
        }

   
        [HttpGet("correo/{correo}")]
        public async Task<ActionResult<Usuario>> GetByCorreo(string correo)
        {
            var usuario = await _service.GetByCorreoAsync(correo);
            if (usuario == null) return NotFound();
            return Ok(usuario);
        }

      

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Usuario usuario)
        {
            if (id != usuario.IdUsuario) return BadRequest();
            await _service.UpdateAsync(usuario);
            return NoContent();
        }


    }
}
