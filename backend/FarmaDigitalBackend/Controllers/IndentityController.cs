using FarmaDigitalBackend.Models;
using FarmaDigitalBackend.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace FarmaDigitalBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class IdentityController : ControllerBase
    {
        private readonly IUsuarioService _userService;

        public IdentityController(IUsuarioService userService)
        {
            _userService = userService;
        }

        [HttpGet("user")]
        public async Task<Usuario?> GetUserByDni([FromQuery] string dni)  
        {
            return await _userService.GetUserByDni(dni);  
        }

        [HttpGet("user-token")]
        public async Task<ActionResult<Usuario>> GetUserFromToken()
        {
            var user = await _userService.GetUserFromToken(User);
            if (user == null)
                return Unauthorized();
            return Ok(user);
        }
    }
}