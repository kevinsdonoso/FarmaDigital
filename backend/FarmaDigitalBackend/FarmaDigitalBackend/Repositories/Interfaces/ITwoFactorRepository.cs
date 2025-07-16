using FarmaDigitalBackend.Models;

namespace FarmaDigitalBackend.Repositories.Interfaces
{
    public interface ITwoFactorRepository
    {
        Task<TwoFactorAuth?> GetByUserId(int userId);
        Task<TwoFactorAuth> Create(TwoFactorAuth twoFactor);
        Task<TwoFactorAuth> Update(TwoFactorAuth twoFactor);
        Task<bool> Delete(int userId);
    }
}