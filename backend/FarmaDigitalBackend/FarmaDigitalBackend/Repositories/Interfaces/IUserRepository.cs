using FarmaDigitalBackend.Models;

namespace FarmaDigitalBackend.Repositories.Interfaces
{
    public interface IUserRepository
    {
        Task<Usuario?> GetUserByDni(string dni);
        Task<List<Usuario>> GetAllUsersAsync();
        Task<Usuario?> GetUserByDniOrEmail(string identifier);
        Task<Usuario> CreateUser(Usuario user);
        Task<Usuario> UpdateUser(Usuario user);
        Task<bool> EmailExists(string email);
        Task<bool> DniExists(string dni);
    }
}