using FarmaDigitalBackend.Models;

namespace FarmaDigitalBackend.Services.Interfaces
{
    public interface ITwoFactorService
    {
        Task<string> GenerateSecretKey();
        Task<string> GenerateQrCode(string userEmail, string secretKey);
        Task<bool> ValidateCode(string secretKey, string code);
    }
}