using FarmaDigitalBackend.Models;
using FarmaDigitalBackend.Repositories.Interfaces;
using FarmaDigitalBackend.Service.Interface;

namespace FarmaDigitalBackend.Service
{
    public class OrdenService : IOrdenService
    {
        private readonly IOrdenRepository _ordenRepository;

        public OrdenService(IOrdenRepository ordenRepository)
        {
            _ordenRepository = ordenRepository;
        }

        public async Task<List<Orden>> GetAllAsync()
        {
            return await _ordenRepository.GetAllAsync();
        }

        public async Task<Orden?> GetByIdAsync(int id)
        {
            return await _ordenRepository.GetByIdAsync(id);
        }

        public async Task AddAsync(Orden orden)
        {
            await _ordenRepository.AddAsync(orden);
        }

        public async Task UpdateAsync(Orden orden)
        {
            await _ordenRepository.UpdateAsync(orden);
        }

        public async Task DeleteAsync(int id)
        {
            await _ordenRepository.DeleteAsync(id);
        }
    }
}
