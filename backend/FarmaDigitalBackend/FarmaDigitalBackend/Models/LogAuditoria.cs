using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FarmaDigitalBackend.Models
{
    public class LogAuditoria
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("Usuario")]
        public int IdUsuario { get; set; }
        public Usuario Usuario { get; set; }

        public string Accion { get; set; }

        [MaxLength(50)]
        public string Modulo { get; set; }

        public DateTime Fecha { get; set; } = DateTime.UtcNow;
    }
}
