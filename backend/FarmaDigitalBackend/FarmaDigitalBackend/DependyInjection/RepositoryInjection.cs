using FarmaDigitalBackend.Repositories;
using FarmaDigitalBackend.Repositories.Interfaces;
using FarmaDigitalBackend.Service;
using FarmaDigitalBackend.Service.Interface;

namespace FarmaDigitalBackend.DependyInjection
{
    public class RepositoryInjection
    {
        public static void Inject(IServiceCollection services)
        {
            services.AddScoped<IUsuarioRepository, UsuarioRepository>();
            services.AddScoped<IUsuarioService, UsuarioService>();
            services.AddScoped<IProductoRepository, ProductoRepository>();
            services.AddScoped<IProductoService, ProductoService>();
            services.AddScoped<IOrdenRepository, OrdenRepository>();
            services.AddScoped<IOrdenService, OrdenService>();
            services.AddScoped<ICarritoRepository, CarritoRepository>();
            services.AddScoped<ICarritoService, CarritoService>();
            services.AddScoped<IItemCarritoRepository, ItemCarritoRepository>();
            services.AddScoped<IItemCarritoService, ItemCarritoService>();
            services.AddScoped<IFacturaRepository, FacturaRepository>();
            services.AddScoped<IFacturaService, FacturaService>();
            services.AddScoped<IDetalleFacturaRepository, DetalleFacturaRepository>();
            services.AddScoped<IDetalleFacturaService, DetalleFacturaService>();
            services.AddScoped<ILogAuditoriaRepository, LogAuditoriaRepository>();
            services.AddScoped<ILogAuditoriaService, LogAuditoriaService>();
        }
    }
}
