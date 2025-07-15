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

        public async Task<List<Producto>> ObtenerTodosAsync()
        {
            return await _productoRepository.GetAllAsync();
        }

        public async Task<Producto?> ObtenerPorIdAsync(int id)
        {
            return await _productoRepository.GetByIdAsync(id);
        }

        public async Task<Producto> CrearAsync(Producto producto)
        {
            return await _productoRepository.CreateAsync(producto);
        }

        public async Task<Producto> ActualizarAsync(Producto producto)
        {
            return await _productoRepository.UpdateAsync(producto);
        }

        public async Task<bool> EliminarAsync(int id)
        {
            return await _productoRepository.DeleteAsync(id);
        }

        public async Task<List<Producto>> ObtenerPorCategoriaAsync(string categoria)
        {
            return await _productoRepository.GetByCategoriaAsync(categoria);
        }

        public async Task<List<Producto>> ObtenerProductosSensiblesAsync()
        {
            return await _productoRepository.GetProductosSensiblesAsync();
        }
    }
}
