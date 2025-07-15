using FarmaDigitalBackend.Data;
using FarmaDigitalBackend.Models;
using FarmaDigitalBackend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FarmaDigitalBackend.Repositories
{
    public class OrdenRepository : IOrdenRepository
    {
        private readonly FarmaDbContext _context;

        public OrdenRepository(FarmaDbContext context)
        {
            _context = context;
        }

        public async Task<List<Orden>> GetAllAsync()
        {
            return await _context.Ordenes
                .Include(o => o.Usuario)
                .Include(o => o.Carrito)
                .ToListAsync();
        }

        public async Task<Orden?> GetByIdAsync(int id)
        {
            return await _context.Ordenes
                .Include(o => o.Usuario)
                .Include(o => o.Carrito)
                .FirstOrDefaultAsync(o => o.Id == id);
        }

        public async Task AddAsync(Orden orden)
        {
            await _context.Ordenes.AddAsync(orden);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Orden orden)
        {
            _context.Ordenes.Update(orden);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var orden = await GetByIdAsync(id);
            if (orden != null)
            {
                _context.Ordenes.Remove(orden);
                await _context.SaveChangesAsync();
            }
        }
    }
}
