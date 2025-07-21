using FarmaDigitalBackend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FarmaDigitalBackend.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class FacturasController : ControllerBase
    {
        private readonly IFacturaService _facturaService;

        public FacturasController(IFacturaService facturaService)
        {
            _facturaService = facturaService;
        }

        [HttpGet]
        public async Task<IActionResult> GetFacturas()
        {
            return await _facturaService.GetFacturasByUsuarioAsync();
        }

        [HttpGet("factura")]
        public async Task<IActionResult> GetFactura([FromQuery] int id)
        {
            return await _facturaService.GetFacturaByIdAsync(id);
        }
    }
}