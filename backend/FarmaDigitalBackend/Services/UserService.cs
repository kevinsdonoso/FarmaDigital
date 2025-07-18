using FarmaDigitalBackend.Models;
using FarmaDigitalBackend.Repositories.Interfaces;
using FarmaDigitalBackend.Services.Interfaces;

namespace FarmaDigitalBackend.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<Usuario?> GetUserByDni(string dni)
        {
            return await _userRepository.GetUserByDni(dni);
        }
    }
}
