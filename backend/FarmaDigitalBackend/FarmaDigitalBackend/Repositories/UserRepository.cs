using FarmaDigitalBackend.Data;
using FarmaDigitalBackend.Models;
using FarmaDigitalBackend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace FarmaDigitalBackend.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly FarmaDbContext _context;

        public UserRepository(FarmaDbContext context)
        {
            _context = context;
        }

        public async Task<List<Usuario>> GetAllUsersAsync()
        {
            return await _context.Usuarios
                .Include(u => u.Rol)
                .ToListAsync();
        }

        public async Task<Usuario?> GetUserByDni(string dni)
        {
            var result = await _context.Usuarios
                .Include(u => u.Rol)
                .Where(u => u.Dni == dni)
                .FirstOrDefaultAsync();

            return result;
        }
    }
}
