using FarmaDigitalBackend.Data;
using FarmaDigitalBackend.Models;
using FarmaDigitalBackend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FarmaDigitalBackend.Repositories
{
    public class ProductoRepository : IProductoRepository
    {
        private readonly FarmaDbContext _context;

        public ProductoRepository(FarmaDbContext context)
        {
            _context = context;
        }

        public async Task<List<Producto>> GetAllProducts()
        {
            return await _context.Productos.ToListAsync(); // ✅ TODOS sin filtros
        }

        public async Task<List<Producto>> GetProductsWithStock()
        {
            return await _context.Productos
                .Where(p => p.Stock > 0)
                .ToListAsync(); // ✅ Solo filtrar por stock
        }

        public async Task<List<Producto>> GetActiveProducts()
        {
            return await _context.Productos
                .Where(p => p.Activo == true)
                .ToListAsync(); // ✅ Solo filtrar por activos
        }

        public async Task<Producto?> GetProductById(int id)
        {
            return await _context.Productos
                .FirstOrDefaultAsync(p => p.IdProducto == id); // ✅ Sin filtro Activo
        }

        public async Task<Producto> CreateProduct(Producto producto)
        {
            _context.Productos.Add(producto);
            await _context.SaveChangesAsync();
            return producto;
        }

        public async Task<Producto?> UpdateProduct(int id, Producto producto)
        {
            var existingProduct = await _context.Productos.FindAsync(id);
            if (existingProduct != null) // ✅ Sin validar Activo
            {
                existingProduct.Nombre = producto.Nombre;
                existingProduct.Descripcion = producto.Descripcion;
                existingProduct.Precio = producto.Precio;
                existingProduct.Stock = producto.Stock;
                existingProduct.EsSensible = producto.EsSensible;
                existingProduct.Categoria = producto.Categoria;
                
                await _context.SaveChangesAsync();
                return existingProduct;
            }
            return null;
        }

        public async Task<bool> SoftDeleteProduct(int id)
        {
            var producto = await _context.Productos.FindAsync(id);
            if (producto != null) // ✅ Sin validar Activo
            {
                producto.Activo = false;
                await _context.SaveChangesAsync();
                return true;
            }
            return false;
        }
    }
}