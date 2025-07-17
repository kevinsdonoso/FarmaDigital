using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FarmaDigitalBackend.Models
{
    [Table("Sesiones")]
    public class Sesion
    {
        [Key]
        [Column("id_sesion")]
        public int IdSesion { get; set; }

        [Required]
        [Column("id_usuario")]
        public int IdUsuario { get; set; }

        [Required]
        [MaxLength(255)]
        [Column("token")]
        public string Token { get; set; } = string.Empty;

        [Column("fecha_creacion")]
        public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;

        [Column("fecha_expiracion")]
        public DateTime FechaExpiracion { get; set; }

        [Column("activa")]
        public bool Activa { get; set; } = true;

        [MaxLength(50)]
        [Column("direccion_ip")]
        public string DireccionIp { get; set; } = string.Empty;
    }
}
