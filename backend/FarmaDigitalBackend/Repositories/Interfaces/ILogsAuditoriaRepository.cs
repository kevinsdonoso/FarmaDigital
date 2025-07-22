using FarmaDigitalBackend.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FarmaDigitalBackend.Repositories.Interfaces
{
    public interface ILogsAuditoriaRepository
    {
        Task RegistrarAsync(LogAuditoria log);
        Task<List<LogAuditoria>> GetAllAsync();
    }
}