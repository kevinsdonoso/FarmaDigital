using FarmaDigitalBackend.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FarmaDigitalBackend.Models
{
    public class AlertaSeguridad
    {
        [Key]
        [Column("id_alerta")]
        public int IdAlerta { get; set; }

        [Required]
        [MaxLength(100)]
        [Column("tipo_alerta")]
        public string TipoAlerta { get; set; }

        [Required]
        [Column("descripcion")]
        public string Descripcion { get; set; }

        [Column("id_usuario")]
        public int? IdUsuario { get; set; }

        [MaxLength(50)]
        [Column("direccion_ip")]
        public string DireccionIp { get; set; }

        [MaxLength(20)]
        [Column("nivel_riesgo")]
        public string NivelRiesgo { get; set; } = "medio";

        [Column("resuelta")]
        public bool Resuelta { get; set; } = false;

        [Column("fecha_creacion")]
        public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;

        // Navegación
        [ForeignKey("IdUsuario")]
        public Usuario Usuario { get; set; }
    }

}
