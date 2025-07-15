using FarmaDigitalBackend.Data;
using FarmaDigitalBackend.Models;
using FarmaDigitalBackend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FarmaDigitalBackend.Repositories
{
    public class CarritoRepository : ICarritoRepository
    {
        private readonly FarmaDbContext _context;

        public CarritoRepository(FarmaDbContext context)
        {
            _context = context;
        }

        public async Task<List<Carrito>> GetAllAsync()
        {
            return await _context.Carritos
                .Include(c => c.Usuario)
                .Include(c => c.ItemsCarrito)
                .ToListAsync();
        }

        public async Task<Carrito?> GetByIdAsync(int id)
        {
            return await _context.Carritos
                .Include(c => c.Usuario)
                .Include(c => c.ItemsCarrito)
                .FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task<List<Carrito>> GetByUsuarioIdAsync(int usuarioId)
        {
            return await _context.Carritos
                .Where(c => c.IdUsuario == usuarioId)
                .Include(c => c.ItemsCarrito)
                .ToListAsync();
        }

        public async Task AddAsync(Carrito carrito)
        {
            await _context.Carritos.AddAsync(carrito);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Carrito carrito)
        {
            _context.Carritos.Update(carrito);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var carrito = await GetByIdAsync(id);
            if (carrito != null)
            {
                _context.Carritos.Remove(carrito);
                await _context.SaveChangesAsync();
            }
        }
    }
}
