using FarmaDigitalBackend.Models;
using FarmaDigitalBackend.Repositories.Interfaces;
using FarmaDigitalBackend.Services.Interfaces;

namespace FarmaDigitalBackend.Services
{
    public class LogAuditoriaService : ILogAuditoriaService
    {
        private readonly ILogsAuditoriaRepository _repo;

        public LogAuditoriaService(ILogsAuditoriaRepository repo)
        {
            _repo = repo;
        }

        public async Task RegistrarAsync(int? usuarioId, string accion, string descripcion, string ip)
        {
            var log = new LogAuditoria
            {
                IdUsuario = usuarioId,
                Accion = accion,
                Descripcion = descripcion,
                DireccionIp = ip,
                CreadoEn = DateTime.UtcNow
            };

            await _repo.RegistrarAsync(log);
        }
    }
}