using FarmaDigitalBackend.Models;

namespace FarmaDigitalBackend.Repositories.Interfaces
{
    public interface IUserRepository
    {
        Task<List<Usuario>> GetAllUsersAsync();
        Task<Usuario?> GetUserByDni(string dni);
    }
}