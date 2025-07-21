using FarmaDigitalBackend.Models.DTOs;
using FarmaDigitalBackend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FarmaDigitalBackend.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ComprasController : ControllerBase
    {
        private readonly ICompraService _compraService;

        public ComprasController(ICompraService compraService)
        {
            _compraService = compraService;
        }

        [HttpPost("procesar")]
        public async Task<IActionResult> ProcesarCompra([FromBody] CompraDto compraDto)
        {
            return await _compraService.ProcesarCompraAsync(compraDto);
        }

        [HttpGet("historial")]
        public async Task<IActionResult> GetHistorialCompras()
        {
            return await _compraService.GetHistorialComprasAsync();
        }
    }
}