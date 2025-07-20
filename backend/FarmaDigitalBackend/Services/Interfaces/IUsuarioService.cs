using FarmaDigitalBackend.Models;

namespace FarmaDigitalBackend.Services.Interfaces
{
    public interface IUsuarioService
    {
        Task<Usuario?> GetUserByDni(string dni);
    }
}