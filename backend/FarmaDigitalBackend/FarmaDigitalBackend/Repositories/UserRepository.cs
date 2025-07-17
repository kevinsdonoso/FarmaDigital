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
            return await _context.Usuarios.ToListAsync(); 
        }

        public async Task<Usuario?> GetUserByDni(string dni)
        {
            return await _context.Usuarios
                .Where(u => u.Dni == dni)
                .FirstOrDefaultAsync(); 
        }

        public async Task<Usuario?> GetUserByDniOrEmail(string identifier)
        {
            return await _context.Usuarios
                .FirstOrDefaultAsync(u => u.Dni == identifier || u.Correo == identifier); 
        }

        public async Task<Usuario> CreateUser(Usuario user)
        {
            _context.Usuarios.Add(user);
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task<Usuario> UpdateUser(Usuario user)
        {
            _context.Usuarios.Update(user);
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task<bool> EmailExists(string email)
        {
            return await _context.Usuarios.AnyAsync(u => u.Correo == email);
        }

        public async Task<bool> DniExists(string dni)
        {
            return await _context.Usuarios.AnyAsync(u => u.Dni == dni);
        }
    }
}