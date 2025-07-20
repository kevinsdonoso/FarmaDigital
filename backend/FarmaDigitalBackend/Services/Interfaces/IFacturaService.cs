using Microsoft.AspNetCore.Mvc;

namespace FarmaDigitalBackend.Services.Interfaces
{
    public interface IFacturaService
    {
        Task<IActionResult> GetFacturaByIdAsync(int idFactura);
        Task<IActionResult> GetFacturasByUsuarioAsync();
    }
}