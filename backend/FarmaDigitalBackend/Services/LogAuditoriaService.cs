using FarmaDigitalBackend.Models;
using FarmaDigitalBackend.Repositories.Interfaces;
using FarmaDigitalBackend.Services.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FarmaDigitalBackend.Services
{
    public class LogAuditoriaService : ILogAuditoriaService
    {
        private readonly ILogsAuditoriaRepository _repo;

        public LogAuditoriaService(ILogsAuditoriaRepository repo)
        {
            _repo = repo;
        }

        public async Task RegistrarAsync(int? idUsuario, string nombre, string correo, string rol, string accion, string descripcion, string ip, DateTime fecha)
        {
            var log = new LogAuditoria
            {
                IdUsuario = idUsuario,
                Nombre = nombre,
                Correo = correo,
                Rol = rol,
                Accion = accion,
                Descripcion = descripcion,
                IP = ip,
                Fecha = fecha
            };
            await _repo.RegistrarAsync(log);
        }

        public async Task<List<LogAuditoria>> GetAllAsync()
        {
            return await _repo.GetAllAsync();
        }
    }
}