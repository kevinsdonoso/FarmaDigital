using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FarmaDigitalBackend.Models
{
    public class AlertaSeguridad
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("Usuario")]
        public int IdUsuario { get; set; }
        public Usuario Usuario { get; set; }

        public DateTime Fecha { get; set; } = DateTime.UtcNow;

        public string TipoAlerta { get; set; }

        public string Descripcion { get; set; }

        [MaxLength(10)]
        public string NivelSeveridad { get; set; } = "medio"; // bajo, medio, alto
    }

}
