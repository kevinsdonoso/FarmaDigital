using FarmaDigitalBackend.Models;

namespace FarmaDigitalBackend.Repositories.Interfaces
{
    public interface ITarjetaRepository
    {
        Task<List<Tarjeta>> GetTarjetasByUsuarioAsync(int idUsuario);
        Task<Tarjeta?> GetTarjetaByIdAsync(int idTarjeta, int idUsuario);
        Task<Tarjeta> CreateTarjetaAsync(Tarjeta tarjeta);
        Task<bool> DeleteTarjetaAsync(int idTarjeta, int idUsuario);
    }
}