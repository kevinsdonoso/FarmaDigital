using FarmaDigitalBackend.Models;
using FarmaDigitalBackend.Service.Interface;
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

        [HttpGet("users")]
        public async Task<ActionResult<List<Usuario>>> GetAllUsers()
        {
            try
            {
                var usuarios = await _userService.GetAllUsersAsync();
                return Ok(usuarios);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Status = "Error interno del servidor", Error = ex.Message });
            }
        }

        [HttpGet("user")]
        public async Task<Usuario?> GetUserByDni([FromQuery] string dni)
        {
            return await _userService.GetUserByDni(dni);
        }
    }
}