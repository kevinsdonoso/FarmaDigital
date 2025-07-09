using FarmaDigitalBackend.Models;

namespace FarmaDigitalBackend.Service.Interface
{
    public interface IUserService
    {
        Task<List<Usuario>> GetAllUsersAsync();
        Task<Usuario?> GetUserByDni(string dni);
    }
}