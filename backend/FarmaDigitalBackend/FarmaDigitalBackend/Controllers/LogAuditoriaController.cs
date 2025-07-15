/* 
// Comentado temporalmente - Controller de auditoría
using FarmaDigitalBackend.Models;
using FarmaDigitalBackend.Service.Interface;
using Microsoft.AspNetCore.Mvc;

namespace FarmaDigitalBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LogAuditoriaController : ControllerBase
    {
        private readonly ILogAuditoriaService _service;

        public LogAuditoriaController(ILogAuditoriaService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<List<LogAuditoria>>> GetAll()
        {
            return Ok(await _service.GetAllAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<LogAuditoria>> GetById(int id)
        {
            var log = await _service.GetByIdAsync(id);
            if (log == null) return NotFound();
            return Ok(log);
        }

        [HttpGet("usuario/{idUsuario}")]
        public async Task<ActionResult<List<LogAuditoria>>> GetByUsuario(int idUsuario)
        {
            return Ok(await _service.GetByUsuarioAsync(idUsuario));
        }

        [HttpPost]
        public async Task<IActionResult> Add([FromBody] LogAuditoria log)
        {
            await _service.AddAsync(log);
            return Ok(log);
        }
    }
}

}*/
