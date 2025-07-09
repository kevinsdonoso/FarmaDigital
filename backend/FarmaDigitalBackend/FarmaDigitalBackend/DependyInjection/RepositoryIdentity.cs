using FarmaDigitalBackend.Repositories;
using FarmaDigitalBackend.Repositories.Interfaces;
using FarmaDigitalBackend.Service;
using FarmaDigitalBackend.Service.Interface;

namespace FarmaDigitalBackend.DependyInjection
{
    public static class RepositoryIdentity
    {
        public static void Inject(IServiceCollection services)
        {
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IUserService, UserService>();
        }
    }
}