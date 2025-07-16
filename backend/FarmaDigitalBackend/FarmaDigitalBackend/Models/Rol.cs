using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FarmaDigitalBackend.Models
{
    public class Rol
    {
        [Key]
        [Column("id_rol")]
        public int Id { get; set; }

        [Required]
        [MaxLength(20)]
        [Column("nombre_rol")]
        public string NombreRol { get; set; }

        // Relaciones
        public virtual ICollection<Usuario> Usuarios { get; set; }
    }
}
