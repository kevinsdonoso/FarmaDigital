using FarmaDigitalBackend.Data;
using FarmaDigitalBackend.Models;
using FarmaDigitalBackend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FarmaDigitalBackend.Repositories
{
    public class LogAuditoriaRepository : ILogAuditoriaRepository
    {
        private readonly FarmaDbContext _context;

        public LogAuditoriaRepository(FarmaDbContext context)
        {
            _context = context;
        }

        public async Task<List<LogAuditoria>> GetAllAsync()
        {
            return await _context.LogsAuditoria
                .Include(l => l.Usuario)
                .ToListAsync();
        }

        public async Task<LogAuditoria?> GetByIdAsync(int id)
        {
            return await _context.LogsAuditoria
                .Include(l => l.Usuario)
                .FirstOrDefaultAsync(l => l.Id == id);
        }

        public async Task<List<LogAuditoria>> GetByUsuarioAsync(int idUsuario)
        {
            return await _context.LogsAuditoria
                .Where(l => l.IdUsuario == idUsuario)
                .ToListAsync();
        }

        public async Task AddAsync(LogAuditoria log)
        {
            await _context.LogsAuditoria.AddAsync(log);
            await _context.SaveChangesAsync();
        }
    }
}
