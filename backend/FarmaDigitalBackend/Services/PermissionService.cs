using FarmaDigitalBackend.Models;

namespace FarmaDigitalBackend.Services
{
    public static class PermissionService
    {
        public static List<Permission> GetPermissionsByRole(string role)
        {
            return role.ToLower() switch
            {
                "cliente" => new List<Permission>
                {
                    new("products", "view"),
                    new("orders", "view", "own"),
                    new("orders", "create"),
                    new("cart", "view", "own"),
                    new("cart", "edit", "own"),
                    new("profile", "view", "own"),
                    new("profile", "edit", "own")
                },
                
                "vendedor" => new List<Permission>
                {
                    new("products", "view"),
                    new("products", "create"),
                    new("products", "edit"),
                    new("products", "delete"),
                    new("inventory", "view"),
                    new("inventory", "edit"),
                    new("orders", "view"),
                    new("orders", "edit"),
                    new("customers", "view")
                },
                
                "administrador" => new List<Permission>
                {
                    new("users", "view"),
                    new("users", "create"),
                    new("users", "edit"),
                    new("users", "delete"),
                    new("products", "view"),
                    new("products", "create"),
                    new("products", "edit"),
                    new("products", "delete"),
                    new("orders", "view"),
                    new("orders", "edit"),
                    new("orders", "delete"),
                    new("reports", "view"),
                    new("settings", "edit"),
                    new("roles", "manage")
                },
                
                "auditor" => new List<Permission>
                {
                    new("users", "view"),
                    new("products", "view"),
                    new("orders", "view"),
                    new("reports", "view"),
                    new("logs", "view"),
                    new("audit", "view")
                },
                
                _ => new List<Permission>()
            };
        }
    }
}