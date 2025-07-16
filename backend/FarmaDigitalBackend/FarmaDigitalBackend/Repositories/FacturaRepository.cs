using FarmaDigitalBackend.Data;
using FarmaDigitalBackend.Models;
using FarmaDigitalBackend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FarmaDigitalBackend.Repositories
{
    public class FacturaRepository : IFacturaRepository
    {
        private readonly FarmaDbContext _context;

        public FacturaRepository(FarmaDbContext context)
        {
            _context = context;
        }

        public async Task<List<Factura>> GetAllAsync()
        {
            return await _context.Facturas
                .Include(f => f.Usuario)
                .Include(f => f.Orden)
                .Include(f => f.DetallesFactura)
                .ToListAsync();
        }

        public async Task<Factura?> GetByIdAsync(int id)
        {
            return await _context.Facturas
                .Include(f => f.Usuario)
                .Include(f => f.Orden)
                .Include(f => f.DetallesFactura)
                .FirstOrDefaultAsync(f => f.Id == id);
        }

        public async Task<List<Factura>> GetByUsuarioIdAsync(int usuarioId)
        {
            return await _context.Facturas
                .Where(f => f.IdUsuario == usuarioId)
                .Include(f => f.DetallesFactura)
                .ToListAsync();
        }

        public async Task AddAsync(Factura factura)
        {
            await _context.Facturas.AddAsync(factura);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Factura factura)
        {
            _context.Facturas.Update(factura);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var factura = await GetByIdAsync(id);
            if (factura != null)
            {
                _context.Facturas.Remove(factura);
                await _context.SaveChangesAsync();
            }
        }
    }
}
