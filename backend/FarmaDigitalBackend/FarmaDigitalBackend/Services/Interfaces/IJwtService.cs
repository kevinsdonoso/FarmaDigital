using FarmaDigitalBackend.Models.Authentication;
using FarmaDigitalBackend.Models;

namespace FarmaDigitalBackend.Services.Interfaces
{
    public interface IJwtService
    {
        TokenResponse GenerateToken(Usuario user);
        bool ValidateToken(string token);
    }
}