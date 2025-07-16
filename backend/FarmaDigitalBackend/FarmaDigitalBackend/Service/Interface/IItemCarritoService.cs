using FarmaDigitalBackend.Models;

namespace FarmaDigitalBackend.Service.Interface
{
    public interface IItemCarritoService
    {
        Task<List<ItemCarrito>> GetAllAsync();
        Task<ItemCarrito?> GetByIdAsync(int id);
        Task<List<ItemCarrito>> GetByCarritoIdAsync(int carritoId);
        Task AddAsync(ItemCarrito item);
        Task UpdateAsync(ItemCarrito item);
        Task DeleteAsync(int id);
    }
}
