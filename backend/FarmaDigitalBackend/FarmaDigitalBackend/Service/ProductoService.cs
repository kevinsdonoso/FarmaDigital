using FarmaDigitalBackend.Models;
using FarmaDigitalBackend.Repositories.Interfaces;
using FarmaDigitalBackend.Service.Interface;

namespace FarmaDigitalBackend.Service
{
    public class ProductoService : IProductoService
    {
        private readonly IProductoRepository _productoRepository;

        public ProductoService(IProductoRepository productoRepository)
        {
            _productoRepository = productoRepository;
        }

        public async Task<List<Producto>> ObtenerTodosAsync() => await _productoRepository.GetAllAsync();
        public async Task<Producto?> ObtenerPorIdAsync(int id) => await _productoRepository.GetByIdAsync(id);
        public async Task CrearAsync(Producto producto) => await _productoRepository.AddAsync(producto);
        public async Task ActualizarAsync(Producto producto) => await _productoRepository.UpdateAsync(producto);
        public async Task EliminarAsync(int id) => await _productoRepository.DeleteAsync(id);
    }
}
