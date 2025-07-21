using System.Threading.Tasks;

namespace FarmaDigitalBackend.Services.Interfaces
{
    public interface ILogAuditoriaService
    {
        Task RegistrarAsync(int? usuarioId, string accion, string descripcion, string ip);
    }
}