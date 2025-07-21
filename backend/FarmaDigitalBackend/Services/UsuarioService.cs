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

        public async Task<Usuario?> GetUserFromToken(System.Security.Claims.ClaimsPrincipal userClaims)
        {
            // El claim puede ser "userId" o "user_id" según cómo se generó el JWT
            var userIdClaim = userClaims.Claims.FirstOrDefault(c => c.Type == "userId" || c.Type == "user_id");
            if (userIdClaim == null) return null;
            if (!int.TryParse(userIdClaim.Value, out int userId)) return null;
            return await _userRepository.GetUserById(userId);
        }
    }
}
