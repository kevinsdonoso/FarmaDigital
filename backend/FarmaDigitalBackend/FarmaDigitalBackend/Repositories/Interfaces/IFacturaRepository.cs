using FarmaDigitalBackend.Models;

namespace FarmaDigitalBackend.Repositories.Interfaces
{
    public interface IFacturaRepository
    {
        Task<List<Factura>> GetAllAsync();
        Task<Factura?> GetByIdAsync(int id);
        Task<List<Factura>> GetByUsuarioIdAsync(int usuarioId);
        Task AddAsync(Factura factura);
        Task UpdateAsync(Factura factura);
        Task DeleteAsync(int id);
    }
}
