using FarmaDigitalBackend.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FarmaDigitalBackend.Service.Interface
{
    public interface IProductoService
    {
        Task<List<Producto>> ObtenerTodosAsync();
        Task<Producto?> ObtenerPorIdAsync(int id);
        Task<Producto> CrearAsync(Producto producto);
        Task<Producto> ActualizarAsync(Producto producto);
        Task<bool> EliminarAsync(int id);
        Task<List<Producto>> ObtenerPorCategoriaAsync(string categoria);
        Task<List<Producto>> ObtenerProductosSensiblesAsync();
    }
}
