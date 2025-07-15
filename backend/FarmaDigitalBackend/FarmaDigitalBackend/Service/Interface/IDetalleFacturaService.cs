using FarmaDigitalBackend.Models;

namespace FarmaDigitalBackend.Service.Interface
{
    public interface IDetalleFacturaService
    {
        Task<List<DetalleFactura>> GetAllAsync();
        Task<DetalleFactura?> GetByIdAsync(int id);
        Task<List<DetalleFactura>> GetByFacturaIdAsync(int facturaId);
        Task AddAsync(DetalleFactura detalle);
        Task UpdateAsync(DetalleFactura detalle);
        Task DeleteAsync(int id);
    }
}
