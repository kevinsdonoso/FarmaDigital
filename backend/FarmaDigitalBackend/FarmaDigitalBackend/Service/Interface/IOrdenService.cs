using FarmaDigitalBackend.Models;

namespace FarmaDigitalBackend.Service.Interface
{
    public interface IOrdenService
    {
        Task<List<Orden>> GetAllAsync();
        Task<Orden?> GetByIdAsync(int id);
        Task AddAsync(Orden orden);
        Task UpdateAsync(Orden orden);
        Task DeleteAsync(int id);
    }
}
