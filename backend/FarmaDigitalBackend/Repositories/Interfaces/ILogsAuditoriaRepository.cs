using FarmaDigitalBackend.Models;
using System.Threading.Tasks;

namespace FarmaDigitalBackend.Repositories.Interfaces
{
    public interface ILogsAuditoriaRepository
    {
        Task RegistrarAsync(LogAuditoria log);
        Task<IEnumerable<LogAuditoria>> GetAllAsync();
    }
}