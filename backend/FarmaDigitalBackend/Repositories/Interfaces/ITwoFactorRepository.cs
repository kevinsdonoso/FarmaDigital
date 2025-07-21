using FarmaDigitalBackend.Models;

namespace FarmaDigitalBackend.Repositories.Interfaces
{
    public interface ITwoFactorRepository
    {
        Task<TwoFactorAuth?> GetByUserIdAsync(int userId);
        Task<TwoFactorAuth> Create(TwoFactorAuth twoFactor);
        Task<TwoFactorAuth> Update(TwoFactorAuth twoFactor);
        Task<bool> Delete(int userId);
    }
}