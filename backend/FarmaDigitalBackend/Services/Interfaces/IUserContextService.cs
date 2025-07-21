namespace FarmaDigitalBackend.Services.Interfaces
{
    public interface IUserContextService
    {
        int GetCurrentUserId();
        string GetCurrentUserEmail();
        string GetCurrentUserRole();
        string GetClientIp();
    }
}