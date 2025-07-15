using FarmaDigitalBackend.Models;
using FarmaDigitalBackend.Repositories.Interfaces;
using FarmaDigitalBackend.Service.Interface;

namespace FarmaDigitalBackend.Service
{
    public class UsuarioService : IUsuarioService
    {
        private readonly IUsuarioRepository _repository;

        public UsuarioService(IUsuarioRepository repository)
        {
            _repository = repository;
        }

        public Task<List<Usuario>> GetAllAsync() => _repository.GetAllAsync();

        public Task<Usuario?> GetByIdAsync(int id) => _repository.GetByIdAsync(id);

        public Task<Usuario?> GetByCorreoAsync(string correo) => _repository.GetByCorreoAsync(correo);

        public Task AddAsync(Usuario usuario) => _repository.AddAsync(usuario);

        public Task UpdateAsync(Usuario usuario) => _repository.UpdateAsync(usuario);

        public Task DeleteAsync(int id) => _repository.DeleteAsync(id);
    }
}
