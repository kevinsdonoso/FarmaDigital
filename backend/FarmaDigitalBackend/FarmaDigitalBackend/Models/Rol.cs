using System.ComponentModel.DataAnnotations;

namespace FarmaDigitalBackend.Models
{
    public class Rol
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string NombreRol { get; set; }  // Ej: "cliente", "admin", "auditor"

        public ICollection<Usuario> Usuarios { get; set; }
    }
}
