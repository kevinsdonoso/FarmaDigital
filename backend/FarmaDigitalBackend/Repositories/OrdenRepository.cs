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

        public async Task<Orden> CreateOrdenAsync(Orden orden)
        {
            _context.Ordenes.Add(orden);
            await _context.SaveChangesAsync();
            return orden;
        }

        public async Task<Orden?> GetOrdenByIdAsync(int idOrden)
        {
            return await _context.Ordenes
                .FirstOrDefaultAsync(o => o.IdOrden == idOrden);
        }

        public async Task<List<Orden>> GetOrdenesByUsuarioAsync(int idUsuario)
        {
            return await _context.Ordenes
                .Where(o => o.IdUsuario == idUsuario)
                .OrderByDescending(o => o.CreadoEn)
                .ToListAsync();
        }

        public async Task<Orden> UpdateOrdenAsync(Orden orden)
        {
            _context.Ordenes.Update(orden);
            await _context.SaveChangesAsync();
            return orden;
        }

        public async Task<List<Orden>> GetAllOrdenesAsync()
        {
            return await _context.Ordenes
                .OrderByDescending(o => o.CreadoEn)
                .ToListAsync();
        }
    }
}