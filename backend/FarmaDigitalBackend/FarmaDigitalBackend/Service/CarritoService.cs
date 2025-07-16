using FarmaDigitalBackend.Models;
using FarmaDigitalBackend.Repositories.Interfaces;
using FarmaDigitalBackend.Service.Interface;

namespace FarmaDigitalBackend.Service
{
    public class CarritoService : ICarritoService
    {
        private readonly ICarritoRepository _repository;

        public CarritoService(ICarritoRepository repository)
        {
            _repository = repository;
        }

        public Task<List<Carrito>> GetAllAsync() => _repository.GetAllAsync();
        public Task<Carrito?> GetByIdAsync(int id) => _repository.GetByIdAsync(id);
        public Task<List<Carrito>> GetByUsuarioIdAsync(int usuarioId) => _repository.GetByUsuarioIdAsync(usuarioId);
        public Task AddAsync(Carrito carrito) => _repository.AddAsync(carrito);
        public Task UpdateAsync(Carrito carrito) => _repository.UpdateAsync(carrito);
        public Task DeleteAsync(int id) => _repository.DeleteAsync(id);
    }
}
