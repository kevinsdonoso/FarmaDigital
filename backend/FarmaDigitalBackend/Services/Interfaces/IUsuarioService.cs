using FarmaDigitalBackend.Models;

namespace FarmaDigitalBackend.Services.Interfaces
{
    public interface IUsuarioService
    {
        Task<Usuario?> GetUserByDni(string dni);
        Task<Usuario?> GetUserFromToken(System.Security.Claims.ClaimsPrincipal userClaims);
    }
}