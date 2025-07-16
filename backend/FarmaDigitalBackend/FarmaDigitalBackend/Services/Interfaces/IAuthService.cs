using FarmaDigitalBackend.Models.Authentication;
using Microsoft.AspNetCore.Mvc;

namespace FarmaDigitalBackend.Services.Interfaces
{
    public interface IAuthService
    {
        Task<IActionResult> RegisterUser(UserRegistration registration);
        Task<IActionResult> LoginUser(UserCredentials credentials);
    }
}