using FarmaDigitalBackend.Models.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace FarmaDigitalBackend.Services.Interfaces
{
    public interface ITarjetaService
    {
        Task<IActionResult> GetTarjetasUsuarioAsync();
        Task<IActionResult> GuardarTarjetaAsync(TarjetaDto tarjetaDto);
        Task<IActionResult> EliminarTarjetaAsync(int idTarjeta);
        Task<IActionResult> ValidarTarjetaExistenteAsync(int idTarjeta, string cvv);
    }
}