using FarmaDigitalBackend.Models;

namespace FarmaDigitalBackend.Repositories.Interfaces
{
    public interface IProductoRepository
    {
        Task<List<Producto>> GetAllProducts();
        Task<List<Producto>> GetProductsWithStock();
        Task<List<Producto>> GetActiveProducts();
        Task<Producto?> GetProductById(int id);
        Task<Producto> CreateProduct(Producto producto);
        Task<Producto?> UpdateProduct(int id, Producto producto);
        Task<bool> SoftDeleteProduct(int id);
    }
}