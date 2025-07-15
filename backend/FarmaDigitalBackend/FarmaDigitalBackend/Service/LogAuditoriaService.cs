/*using FarmaDigitalBackend.Models;
using FarmaDigitalBackend.Repositories.Interfaces;
using FarmaDigitalBackend.Service.Interface;

namespace FarmaDigitalBackend.Service
{
    public class LogAuditoriaService : ILogAuditoriaService
    {
        private readonly ILogAuditoriaRepository _repository;

        public LogAuditoriaService(ILogAuditoriaRepository repository)
        {
            _repository = repository;
        }

        public Task<List<LogAuditoria>> GetAllAsync() => _repository.GetAllAsync();
        public Task<LogAuditoria?> GetByIdAsync(int id) => _repository.GetByIdAsync(id);
        public Task<List<LogAuditoria>> GetByUsuarioAsync(int idUsuario) => _repository.GetByUsuarioAsync(idUsuario);
        public Task AddAsync(LogAuditoria log) => _repository.AddAsync(log);
    }
}
*/