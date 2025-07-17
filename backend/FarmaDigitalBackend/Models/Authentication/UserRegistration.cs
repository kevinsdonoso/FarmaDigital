using System.ComponentModel.DataAnnotations;

namespace FarmaDigitalBackend.Models.Authentication
{
    public class UserRegistration
    {
        [Required]
        [StringLength(10)]
        public string Dni { get; set; }
        
        [Required]
        [StringLength(100)]
        public string Nombre { get; set; }
        
        [Required]
        [EmailAddress]
        public string Correo { get; set; }
        
        [Required]
        [MinLength(8)]
        public string Password { get; set; }
        
        [Required]
        public int IdRol { get; set; } = 3; // Cliente por defecto
    }
}