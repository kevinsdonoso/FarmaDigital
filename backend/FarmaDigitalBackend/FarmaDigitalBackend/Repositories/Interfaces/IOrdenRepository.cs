using FarmaDigitalBackend.Models;

namespace FarmaDigitalBackend.Repositories.Interfaces
{
    public interface IOrdenRepository
    {
        Task<List<Orden>> GetAllAsync();
        Task<Orden?> GetByIdAsync(int id);
        Task AddAsync(Orden orden);
        Task UpdateAsync(Orden orden);
        Task DeleteAsync(int id);
    }
}
