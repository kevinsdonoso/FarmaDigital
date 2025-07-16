using FarmaDigitalBackend.Models;

namespace FarmaDigitalBackend.Repositories.Interfaces
{
    public interface IItemCarritoRepository
    {
        Task<List<ItemCarrito>> GetAllAsync();
        Task<ItemCarrito?> GetByIdAsync(int id);
        Task<List<ItemCarrito>> GetByCarritoIdAsync(int carritoId);
        Task AddAsync(ItemCarrito item);
        Task UpdateAsync(ItemCarrito item);
        Task DeleteAsync(int id);
    }
}
