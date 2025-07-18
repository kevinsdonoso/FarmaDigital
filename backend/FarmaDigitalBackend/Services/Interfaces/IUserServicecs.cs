using FarmaDigitalBackend.Models;

namespace FarmaDigitalBackend.Services.Interfaces
{
    public interface IUserService
    {
        Task<Usuario?> GetUserByDni(string dni);
    }
}