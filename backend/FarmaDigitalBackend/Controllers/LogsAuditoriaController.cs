using FarmaDigitalBackend.Models;
using FarmaDigitalBackend.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace FarmaDigitalBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LogsAuditoriaController : ControllerBase
    {
        private readonly ILogAuditoriaService _logService;

        public LogsAuditoriaController(ILogAuditoriaService logService)
        {
            _logService = logService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var logs = await _logService.GetAllAsync();
            return Ok(new { success = true, data = logs });
        }
    }
}