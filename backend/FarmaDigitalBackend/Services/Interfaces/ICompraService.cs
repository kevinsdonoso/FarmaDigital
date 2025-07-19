using FarmaDigitalBackend.Models.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace FarmaDigitalBackend.Services.Interfaces
{
    public interface ICompraService
    {
        Task<IActionResult> ProcesarCompraAsync(CompraDto compraDto);
        Task<IActionResult> GetHistorialComprasAsync();
    }
}