using System.ComponentModel.DataAnnotations;

namespace FarmaDigitalBackend.Models.Authentication
{
    public class UserCredentials
    {
        [Required]
        public string Username { get; set; } // DNI o Email

        [Required]
        public string Password { get; set; }

        public string? TwoFactorCode { get; set; } // Para 2FA
    }
}