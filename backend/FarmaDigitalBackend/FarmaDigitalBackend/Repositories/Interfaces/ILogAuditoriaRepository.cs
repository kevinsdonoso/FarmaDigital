using FarmaDigitalBackend.Models;

namespace FarmaDigitalBackend.Repositories.Interfaces
{
    public interface ILogAuditoriaRepository
    {
        Task<List<LogAuditoria>> GetAllAsync();
        Task<LogAuditoria?> GetByIdAsync(int id);
        Task<List<LogAuditoria>> GetByUsuarioAsync(int idUsuario);
        Task AddAsync(LogAuditoria log);
    }
}
