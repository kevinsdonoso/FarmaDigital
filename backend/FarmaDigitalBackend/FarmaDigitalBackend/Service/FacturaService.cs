using FarmaDigitalBackend.Models;
using FarmaDigitalBackend.Repositories.Interfaces;
using FarmaDigitalBackend.Service.Interface;

namespace FarmaDigitalBackend.Service
{
    public class FacturaService : IFacturaService
    {
        private readonly IFacturaRepository _repository;

        public FacturaService(IFacturaRepository repository)
        {
            _repository = repository;
        }

        public Task<List<Factura>> GetAllAsync() => _repository.GetAllAsync();

        public Task<Factura?> GetByIdAsync(int id) => _repository.GetByIdAsync(id);

        public Task<List<Factura>> GetByUsuarioIdAsync(int usuarioId) => _repository.GetByUsuarioIdAsync(usuarioId);

        public Task AddAsync(Factura factura) => _repository.AddAsync(factura);

        public Task UpdateAsync(Factura factura) => _repository.UpdateAsync(factura);

        public Task DeleteAsync(int id) => _repository.DeleteAsync(id);
    }
}
