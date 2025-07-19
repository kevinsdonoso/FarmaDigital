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

        public async Task<Factura> CreateFacturaAsync(Factura factura)
        {
            _context.Facturas.Add(factura);
            await _context.SaveChangesAsync();
            return factura;
        }

        public async Task<Factura?> GetFacturaByIdAsync(int idFactura)
        {
            return await _context.Facturas
                .FirstOrDefaultAsync(f => f.IdFactura == idFactura);
        }

        public async Task<Factura?> GetFacturaByOrdenIdAsync(int idOrden)
        {
            return await _context.Facturas
                .FirstOrDefaultAsync(f => f.IdOrden == idOrden);
        }

        public async Task<List<Factura>> GetFacturasByUsuarioAsync(int idUsuario)
        {
            return await _context.Facturas
                .Where(f => f.IdUsuario == idUsuario)
                .OrderByDescending(f => f.FechaEmision)
                .ToListAsync();
        }

        public async Task<DetalleFactura> CreateDetalleFacturaAsync(DetalleFactura detalle)
        {
            _context.DetallesFactura.Add(detalle);
            await _context.SaveChangesAsync();
            return detalle;
        }

        public async Task<List<DetalleFactura>> GetDetallesByFacturaAsync(int idFactura)
        {
            return await _context.DetallesFactura
                .Where(d => d.IdFactura == idFactura)
                .ToListAsync();
        }

        public async Task<List<Factura>> GetAllFacturasAsync()
        {
            return await _context.Facturas
                .OrderByDescending(f => f.FechaEmision)
                .ToListAsync();
        }
    }
}