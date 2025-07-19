using FarmaDigitalBackend.Services.Interfaces;
using System.Security.Claims;

namespace FarmaDigitalBackend.Services
{
    public class UserContextService : IUserContextService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public UserContextService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public int GetCurrentUserId()
        {
            var userIdClaim = _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier);
            
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
            {
                throw new UnauthorizedAccessException("Usuario no autenticado");
            }

            return userId;
        }

        public string GetCurrentUserEmail()
        {
            var emailClaim = _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.Email);
            return emailClaim?.Value ?? throw new UnauthorizedAccessException("Email no encontrado");
        }

        public string GetCurrentUserRole()
        {
            var roleClaim = _httpContextAccessor.HttpContext?.User?.FindFirst("role");
            return roleClaim?.Value ?? "Cliente";
        }
    }
}