using FarmaDigitalBackend.Models;

namespace FarmaDigitalBackend.Repositories.Interfaces
{
    public interface IOrdenRepository
    {
        Task<Orden> CreateOrdenAsync(Orden orden);
        Task<Orden?> GetOrdenByIdAsync(int idOrden);
        Task<List<Orden>> GetOrdenesByUsuarioAsync(int idUsuario);
        Task<Orden> UpdateOrdenAsync(Orden orden);
        Task<List<Orden>> GetAllOrdenesAsync();
    }
}