using FarmaDigitalBackend.Models;
using FarmaDigitalBackend.Repositories.Interfaces;
using FarmaDigitalBackend.Services.Interfaces;

namespace FarmaDigitalBackend.Services
{
    public class UsuarioService : IUsuarioService
    {
        private readonly IUsuarioRepository _userRepository;

        public UsuarioService(IUsuarioRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<Usuario?> GetUserByDni(string dni)
        {
            return await _userRepository.GetUserByDni(dni);
        }
    }
}
