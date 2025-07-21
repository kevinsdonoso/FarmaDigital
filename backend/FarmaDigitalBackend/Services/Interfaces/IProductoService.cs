using FarmaDigitalBackend.Models;
using Microsoft.AspNetCore.Mvc;

namespace FarmaDigitalBackend.Services.Interfaces
{
    public interface IProductoService
    {
        Task<IActionResult> GetAllProducts();
        Task<IActionResult> GetProductsWithStock();
        Task<IActionResult> GetActiveProducts();
        Task<IActionResult> GetActiveProductsWithStock();
        Task<IActionResult> GetProductById(int id);
        Task<IActionResult> CreateProduct(Producto producto);
        Task<IActionResult> UpdateProduct(int id, Producto producto);
        Task<IActionResult> DeleteProduct(int id);
    }
}