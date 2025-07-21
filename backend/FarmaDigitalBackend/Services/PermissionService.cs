using FarmaDigitalBackend.Models;

namespace FarmaDigitalBackend.Services
{
    public static class PermissionService
    {

        public static List<string> GetModulesByRole(string role)
        {
            return role switch
            {
                "cliente" => new List<string> { "dashboard", "carrito", "historialCompras" },
                "vendedor" => new List<string> { "products", "addproduct" },
                "auditor"  => new List<string> { "audit" },
                "administrador" => new List<string> { "users", "products", "orders", "reports", "settings", "roles" },
                _ => new List<string>()
            };
        }

        
        
    }
}