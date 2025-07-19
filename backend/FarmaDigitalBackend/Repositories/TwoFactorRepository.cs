using FarmaDigitalBackend.Data;
using FarmaDigitalBackend.Models;
using FarmaDigitalBackend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FarmaDigitalBackend.Repositories
{
    public class TwoFactorRepository : ITwoFactorRepository
    {
        private readonly FarmaDbContext _context;

        public TwoFactorRepository(FarmaDbContext context)
        {
            _context = context;
        }

        public async Task<TwoFactorAuth?> GetByUserIdAsync(int userId)
        {
            return await _context.TwoFactorAuths
                .FirstOrDefaultAsync(t => t.IdUsuario == userId);
        }

        public async Task<TwoFactorAuth> Create(TwoFactorAuth twoFactor)
        {
            _context.TwoFactorAuths.Add(twoFactor);
            await _context.SaveChangesAsync();
            return twoFactor;
        }

        public async Task<TwoFactorAuth> Update(TwoFactorAuth twoFactor)
        {
            _context.TwoFactorAuths.Update(twoFactor);
            await _context.SaveChangesAsync();
            return twoFactor;
        }

        public async Task<bool> Delete(int userId)
        {
            var twoFactor = await GetByUserIdAsync(userId); // <-- usa el método correcto
            if (twoFactor != null)
            {
                _context.TwoFactorAuths.Remove(twoFactor);
                await _context.SaveChangesAsync();
                return true;
            }
            return false;
        }
    }
}
