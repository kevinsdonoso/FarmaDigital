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
            // Repositories
            services.AddScoped<IUsuarioRepository, UsuarioRepository>();
            services.AddScoped<IProductoRepository, ProductoRepository>();
            services.AddScoped<ITarjetaRepository, TarjetaRepository>();
            services.AddScoped<IOrdenRepository, OrdenRepository>();
            services.AddScoped<IFacturaRepository, FacturaRepository>();

            // Services
            services.AddScoped<IUsuarioService, UsuarioService>();
            services.AddScoped<IProductoService, ProductoService>();
            services.AddScoped<ITarjetaService, TarjetaService>();
            services.AddScoped<ICompraService, CompraService>();
            services.AddScoped<IFacturaService, FacturaService>();
            services.AddScoped<IUserContextService, UserContextService>();
            services.AddScoped<IAuthService, AuthService>();

         
            services.AddScoped<ITwoFactorRepository, TwoFactorRepository>();
            services.AddScoped<IProductoRepository, ProductoRepository>();
            
            // Servicios
            services.AddScoped<ITwoFactorService, TwoFactorService>();
            services.AddScoped<IProductoService, ProductoService>();

            services.AddScoped<ITwoFactorService, TwoFactorService>();
            services.AddScoped<IProductoService, ProductoService>();

            // HttpContextAccessor for getting current user
            services.AddHttpContextAccessor();
        }
    }
}