using FarmaDigitalBackend.Models;
using FarmaDigitalBackend.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace FarmaDigitalBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class IdentityController : ControllerBase
    {
        private readonly IUserService _userService;

        public IdentityController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet("user")]
        public async Task<Usuario?> GetUserByDni([FromQuery] string dni)  // ← Cambié "Dni" por "dni"
        {
            return await _userService.GetUserByDni(dni);  // ← Ahora coincide
        }
    }
}