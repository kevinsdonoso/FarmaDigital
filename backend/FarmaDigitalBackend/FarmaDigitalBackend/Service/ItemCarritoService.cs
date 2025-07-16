using FarmaDigitalBackend.Models;
using FarmaDigitalBackend.Repositories.Interfaces;
using FarmaDigitalBackend.Service.Interface;

namespace FarmaDigitalBackend.Service
{
    public class ItemCarritoService : IItemCarritoService
    {
        private readonly IItemCarritoRepository _repository;

        public ItemCarritoService(IItemCarritoRepository repository)
        {
            _repository = repository;
        }

        public Task<List<ItemCarrito>> GetAllAsync() => _repository.GetAllAsync();

        public Task<ItemCarrito?> GetByIdAsync(int id) => _repository.GetByIdAsync(id);

        public Task<List<ItemCarrito>> GetByCarritoIdAsync(int carritoId) => _repository.GetByCarritoIdAsync(carritoId);

        public Task AddAsync(ItemCarrito item) => _repository.AddAsync(item);

        public Task UpdateAsync(ItemCarrito item) => _repository.UpdateAsync(item);

        public Task DeleteAsync(int id) => _repository.DeleteAsync(id);
    }
}
