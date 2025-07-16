using FarmaDigitalBackend.Models;

namespace FarmaDigitalBackend.Service.Interface
{
    public interface ILogAuditoriaService
    {
        Task<List<LogAuditoria>> GetAllAsync();
        Task<LogAuditoria?> GetByIdAsync(int id);
        Task<List<LogAuditoria>> GetByUsuarioAsync(int idUsuario);
        Task AddAsync(LogAuditoria log);
    }
}
