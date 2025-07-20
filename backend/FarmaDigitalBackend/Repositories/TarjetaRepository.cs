using FarmaDigitalBackend.Data;
using FarmaDigitalBackend.Models;
using FarmaDigitalBackend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FarmaDigitalBackend.Repositories
{
    public class TarjetaRepository : ITarjetaRepository
    {
        private readonly FarmaDbContext _context;

        public TarjetaRepository(FarmaDbContext context)
        {
            _context = context;
        }

        public async Task<List<Tarjeta>> GetTarjetasByUsuarioAsync(int idUsuario)
        {
            return await _context.Tarjetas
                .Where(t => t.IdUsuario == idUsuario && t.Activa)
                .OrderByDescending(t => t.EsPrincipal)
                .ThenByDescending(t => t.CreadaEn)
                .ToListAsync();
        }

        public async Task<Tarjeta?> GetTarjetaByIdAsync(int idTarjeta, int idUsuario)
        {
            return await _context.Tarjetas
                .FirstOrDefaultAsync(t => t.IdTarjeta == idTarjeta && t.IdUsuario == idUsuario && t.Activa);
        }

        public async Task<Tarjeta> CreateTarjetaAsync(Tarjeta tarjeta)
        {
            // Si es principal, quitar principal de las demás
            if (tarjeta.EsPrincipal)
            {
                var tarjetasExistentes = await _context.Tarjetas
                    .Where(t => t.IdUsuario == tarjeta.IdUsuario && t.Activa)
                    .ToListAsync();

                foreach (var t in tarjetasExistentes)
                {
                    t.EsPrincipal = false;
                }
            }

            _context.Tarjetas.Add(tarjeta);
            await _context.SaveChangesAsync();
            return tarjeta;
        }

        public async Task<bool> DeleteTarjetaAsync(int idTarjeta, int idUsuario)
        {
            var tarjeta = await GetTarjetaByIdAsync(idTarjeta, idUsuario);
            if (tarjeta == null) return false;

            tarjeta.Activa = false;
            await _context.SaveChangesAsync();
            return true;
        }
    }
}