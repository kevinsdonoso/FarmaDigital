using FarmaDigitalBackend.Models;

namespace FarmaDigitalBackend.Repositories.Interfaces
{
    public interface ICarritoRepository
    {
        Task<List<Carrito>> GetAllAsync();
        Task<Carrito?> GetByIdAsync(int id);
        Task<List<Carrito>> GetByUsuarioIdAsync(int usuarioId);
        Task AddAsync(Carrito carrito);
        Task UpdateAsync(Carrito carrito);
        Task DeleteAsync(int id);
    }
}
