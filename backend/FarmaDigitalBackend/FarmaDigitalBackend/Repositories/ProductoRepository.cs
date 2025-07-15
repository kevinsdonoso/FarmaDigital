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

        public async Task<List<Producto>> GetAllAsync()
        {
            return await _context.Productos
                .Include(p => p.UsuarioCreador)
                .ToListAsync();
        }

        public async Task<Producto?> GetByIdAsync(int id)
        {
            return await _context.Productos
                .Include(p => p.UsuarioCreador)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<Producto> CreateAsync(Producto producto)
        {
            _context.Productos.Add(producto);
            await _context.SaveChangesAsync();
            return producto;
        }

        public async Task<Producto> UpdateAsync(Producto producto)
        {
            _context.Productos.Update(producto);
            await _context.SaveChangesAsync();
            return producto;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var producto = await _context.Productos.FindAsync(id);
            if (producto == null) return false;

            _context.Productos.Remove(producto);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<Producto>> GetByCategoriaAsync(string categoria)
        {
            return await _context.Productos
                .Where(p => p.Categoria == categoria)
                .ToListAsync();
        }

        public async Task<List<Producto>> GetProductosSensiblesAsync()
        {
            return await _context.Productos
                .Where(p => p.EsSensible == true)
                .ToListAsync();
        }
    }
}