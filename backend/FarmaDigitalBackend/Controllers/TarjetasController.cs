using FarmaDigitalBackend.Models.DTOs;
using FarmaDigitalBackend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FarmaDigitalBackend.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class TarjetasController : ControllerBase
    {
        private readonly ITarjetaService _tarjetaService;
        private readonly ITwoFactorService _twoFactorService;
        private readonly IUserContextService _userContextService;

        public TarjetasController(
            ITarjetaService tarjetaService,
            ITwoFactorService twoFactorService,
            IUserContextService userContextService)
        {
            _tarjetaService = tarjetaService;
            _twoFactorService = twoFactorService;
            _userContextService = userContextService;
        }

        [HttpGet]
        public async Task<IActionResult> GetTarjetas()
        {
            return await _tarjetaService.GetTarjetasUsuarioAsync();
        }

        [HttpPost]
        public async Task<IActionResult> GuardarTarjeta([FromBody] TarjetaDto tarjetaDto)
        {
            return await _tarjetaService.GuardarTarjetaAsync(tarjetaDto);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> EliminarTarjeta(int id)
        {
            return await _tarjetaService.EliminarTarjetaAsync(id);
        }

        [HttpPost("{id}/validar")]
        public async Task<IActionResult> ValidarTarjeta(int id, [FromBody] ValidarTarjetaDto dto)
        {
            return await _tarjetaService.ValidarTarjetaExistenteAsync(id, dto.CVV);
        }

    }

    public class ValidarTarjetaDto
    {
        public string CVV { get; set; } = string.Empty;
    }
}