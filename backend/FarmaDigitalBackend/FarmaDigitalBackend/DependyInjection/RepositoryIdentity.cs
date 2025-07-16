using FarmaDigitalBackend.Repositories;
using FarmaDigitalBackend.Repositories.Interfaces;
using FarmaDigitalBackend.Services;           // ✅ AGREGAR para TwoFactorService
using FarmaDigitalBackend.Services.Interfaces; // ✅ AGREGAR para ITwoFactorService

namespace FarmaDigitalBackend.DependyInjection
{
    public static class RepositoryIdentity
    {
        public static void Inject(IServiceCollection services)
        {
            // Repositorios existentes
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IUserService, UserService>();
            
            // Nuevos repositorios para autenticación
            services.AddScoped<ITwoFactorRepository, TwoFactorRepository>();
            
            // Nuevos servicios para autenticación
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<ITwoFactorService, TwoFactorService>(); // ✅ Ahora funcionará
            
            // IJwtService ya está registrado en Program.cs como Singleton
        }
    }
}