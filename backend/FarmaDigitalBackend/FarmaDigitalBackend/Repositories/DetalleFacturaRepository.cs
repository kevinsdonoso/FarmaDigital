using FarmaDigitalBackend.Data;
using FarmaDigitalBackend.Models;
using FarmaDigitalBackend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FarmaDigitalBackend.Repositories
{
    public class DetalleFacturaRepository : IDetalleFacturaRepository
    {
        private readonly FarmaDbContext _context;

        public DetalleFacturaRepository(FarmaDbContext context)
        {
            _context = context;
        }

        public async Task<List<DetalleFactura>> GetAllAsync()
        {
            return await _context.DetallesFactura
                .Include(d => d.Producto)
                .Include(d => d.Factura)
                .ToListAsync();
        }

        public async Task<DetalleFactura?> GetByIdAsync(int id)
        {
            return await _context.DetallesFactura
                .Include(d => d.Producto)
                .Include(d => d.Factura)
                .FirstOrDefaultAsync(d => d.Id == id);
        }

        public async Task<List<DetalleFactura>> GetByFacturaIdAsync(int facturaId)
        {
            return await _context.DetallesFactura
                .Where(d => d.IdFactura == facturaId)
                .Include(d => d.Producto)
                .ToListAsync();
        }

        public async Task AddAsync(DetalleFactura detalle)
        {
            await _context.DetallesFactura.AddAsync(detalle);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(DetalleFactura detalle)
        {
            _context.DetallesFactura.Update(detalle);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var detalle = await GetByIdAsync(id);
            if (detalle != null)
            {
                _context.DetallesFactura.Remove(detalle);
                await _context.SaveChangesAsync();
            }
        }
    }
}
