using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FarmaDigitalBackend.Models
{
    public class Usuario
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(10)]
        public string Dni { get; set; }

        [Required]
        [MaxLength(100)]
        public string Nombre { get; set; }

        [Required]
        [MaxLength(100)]
        public string Correo { get; set; }

        [Required]
        public string ContrasenaHash { get; set; }

        public bool MfaActivado { get; set; } = false;

        [ForeignKey("Rol")]
        public int IdRol { get; set; }
        public Rol Rol { get; set; }

        public ICollection<Factura> Facturas { get; set; }
        public ICollection<Tarjeta> Tarjetas { get; set; }
    }
}
