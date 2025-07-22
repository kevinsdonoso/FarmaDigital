using FarmaDigitalBackend.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FarmaDigitalBackend.Services.Interfaces
{
    public interface ILogAuditoriaService
    {
        Task RegistrarAsync(int? idUsuario, string nombre, string correo, string rol, string accion, string descripcion, string ip, DateTime fecha);
        Task<List<LogAuditoria>> GetAllAsync();
    }
}