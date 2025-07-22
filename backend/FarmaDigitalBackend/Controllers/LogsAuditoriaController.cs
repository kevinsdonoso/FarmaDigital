using Microsoft.AspNetCore.Mvc;
using FarmaDigitalBackend.Models;
using FarmaDigitalBackend.Repositories.Interfaces;
using System.Threading.Tasks;

namespace FarmaDigitalBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LogsAuditoriaController : ControllerBase
    {
        private readonly ILogsAuditoriaRepository _logsRepo;

        public LogsAuditoriaController(ILogsAuditoriaRepository logsRepo)
        {
            _logsRepo = logsRepo;
        }

        [HttpPost]
        public async Task<IActionResult> Registrar([FromBody] LogAuditoria log)
        {
            if (log == null || string.IsNullOrEmpty(log.Accion))
                return BadRequest("Log inválido.");

            await _logsRepo.RegistrarAsync(log);
            return Ok(new { success = true });
        }

        public async Task<IActionResult> GetAll()
        {
            var logs = await _logsRepo.GetAllAsync();
            return Ok(logs);
        }
    }
}