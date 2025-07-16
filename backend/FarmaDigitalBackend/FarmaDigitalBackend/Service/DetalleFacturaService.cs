using FarmaDigitalBackend.Models;
using FarmaDigitalBackend.Repositories.Interfaces;
using FarmaDigitalBackend.Service.Interface;

namespace FarmaDigitalBackend.Service
{
    public class DetalleFacturaService : IDetalleFacturaService
    {
        private readonly IDetalleFacturaRepository _repository;

        public DetalleFacturaService(IDetalleFacturaRepository repository)
        {
            _repository = repository;
        }

        public Task<List<DetalleFactura>> GetAllAsync() => _repository.GetAllAsync();

        public Task<DetalleFactura?> GetByIdAsync(int id) => _repository.GetByIdAsync(id);

        public Task<List<DetalleFactura>> GetByFacturaIdAsync(int facturaId) => _repository.GetByFacturaIdAsync(facturaId);

        public Task AddAsync(DetalleFactura detalle) => _repository.AddAsync(detalle);

        public Task UpdateAsync(DetalleFactura detalle) => _repository.UpdateAsync(detalle);

        public Task DeleteAsync(int id) => _repository.DeleteAsync(id);
    }
}
