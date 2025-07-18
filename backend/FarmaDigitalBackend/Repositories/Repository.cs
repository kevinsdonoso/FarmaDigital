using FarmaDigitalBackend.Data;
using Microsoft.EntityFrameworkCore;

namespace FarmaDigitalBackend.Repositories
{
    public abstract class Repository<T> where T : class
    {
        protected readonly FarmaDbContext context;

        public Repository(FarmaDbContext context)
        {
            this.context = context;
        }

        // Métodos comunes que pueden usar todos los repositorios
        public virtual async Task<T?> GetByIdAsync(int id)
        {
            return await context.Set<T>().FindAsync(id);
        }

        public virtual async Task<IEnumerable<T>> GetAllAsync()
        {
            return await context.Set<T>().ToListAsync();
        }

        public virtual async Task AddAsync(T entity)
        {
            await context.Set<T>().AddAsync(entity);
            await context.SaveChangesAsync();
        }

        public virtual async Task UpdateAsync(T entity)
        {
            context.Set<T>().Update(entity);
            await context.SaveChangesAsync();
        }

        public virtual async Task DeleteAsync(int id)
        {
            var entity = await GetByIdAsync(id);
            if (entity != null)
            {
                context.Set<T>().Remove(entity);
                await context.SaveChangesAsync();
            }
        }
    }
}