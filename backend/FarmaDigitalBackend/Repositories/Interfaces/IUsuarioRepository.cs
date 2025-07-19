using FarmaDigitalBackend.Models;

namespace FarmaDigitalBackend.Repositories.Interfaces
{
    public interface IUsuarioRepository
    {
        Task<List<Usuario>> GetAllUsersAsync();
        Task<Usuario?> GetUserByDni(string dni);
        Task<Usuario?> GetUserByDniOrEmail(string identifier);
        Task<Usuario> CreateUser(Usuario user);
        Task<Usuario> UpdateUser(Usuario user);
        Task<bool> EmailExists(string email);
        Task<bool> DniExists(string dni);
        Task<Usuario?> GetUserById(int idUsuario);
    }
}