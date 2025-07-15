using FarmaDigitalBackend.Data;
using FarmaDigitalBackend.Models;
using FarmaDigitalBackend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FarmaDigitalBackend.Repositories
{
    public class ItemCarritoRepository : IItemCarritoRepository
    {
        private readonly FarmaDbContext _context;

        public ItemCarritoRepository(FarmaDbContext context)
        {
            _context = context;
        }

        public async Task<List<ItemCarrito>> GetAllAsync()
        {
            return await _context.ItemsCarrito
                .Include(i => i.Producto)
                .Include(i => i.Carrito)
                .ToListAsync();
        }

        public async Task<ItemCarrito?> GetByIdAsync(int id)
        {
            return await _context.ItemsCarrito
                .Include(i => i.Producto)
                .Include(i => i.Carrito)
                .FirstOrDefaultAsync(i => i.Id == id);
        }

        public async Task<List<ItemCarrito>> GetByCarritoIdAsync(int carritoId)
        {
            return await _context.ItemsCarrito
                .Where(i => i.IdCarrito == carritoId)
                .Include(i => i.Producto)
                .ToListAsync();
        }

        public async Task AddAsync(ItemCarrito item)
        {
            await _context.ItemsCarrito.AddAsync(item);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(ItemCarrito item)
        {
            _context.ItemsCarrito.Update(item);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var item = await GetByIdAsync(id);
            if (item != null)
            {
                _context.ItemsCarrito.Remove(item);
                await _context.SaveChangesAsync();
            }
        }
    }
}
