using FarmaDigitalBackend.Repositories;
using FarmaDigitalBackend.Repositories.Interfaces;
using FarmaDigitalBackend.Services;
using FarmaDigitalBackend.Services.Interfaces;

namespace FarmaDigitalBackend.DependyInjection
{
    public static class RepositoryIdentity
    {
        public static void Inject(IServiceCollection services)
        {
            // Repositorios
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<ITwoFactorRepository, TwoFactorRepository>();
            services.AddScoped<IProductoRepository, ProductoRepository>();
            
            // Servicios
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<ITwoFactorService, TwoFactorService>();
            services.AddScoped<IProductoService, ProductoService>();
        }
    }
}