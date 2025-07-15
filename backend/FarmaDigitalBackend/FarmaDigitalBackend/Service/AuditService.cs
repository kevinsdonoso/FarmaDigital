using FarmaDigitalBackend.Data;
using FarmaDigitalBackend.Models.Auditoria;

namespace FarmaDigitalBackend.Service
{
    public class AuditService
    {
        private readonly AuditDbContext _context;

        public AuditService(AuditDbContext context)
        {
            _context = context;
        }

        public async Task RegistrarLogAsync(int idUsuario, string accion, string descripcion, string ip)
        {
            var log = new AuditLog
            {
                IdUsuario = idUsuario,
                Accion = accion,
                Descripcion = descripcion,
                DireccionIp = ip,
                CreadoEn = DateTime.UtcNow
            };

            await _context.AuditLogs.AddAsync(log);
            await _context.SaveChangesAsync();
        }
    }
}
