using FarmaDigitalBackend.Data;
using FarmaDigitalBackend.Models;
using FarmaDigitalBackend.Repositories.Interfaces;
using System.Threading.Tasks;

namespace FarmaDigitalBackend.Repositories
{
    public class LogsAuditoriaRepository : ILogsAuditoriaRepository

    {
        private readonly FarmaDbContext _context;

        public LogsAuditoriaRepository(FarmaDbContext context)
        {
            _context = context;
        }

        public async Task RegistrarAsync(LogAuditoria log)
        {
            _context.LogsAuditoria.Add(log);
            await _context.SaveChangesAsync();
        }
    }
}