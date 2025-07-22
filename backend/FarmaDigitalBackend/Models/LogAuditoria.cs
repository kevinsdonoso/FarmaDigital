using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FarmaDigitalBackend.Models
{
    [Table("LogsAuditoria")]
    public class LogAuditoria
    {
        [Key]
        [Column("id_log")]
        public int IdLog { get; set; }

        [Column("id_usuario")]
        public int? IdUsuario { get; set; }

        [MaxLength(100)]
        [Column("nombre")]
        public string Nombre { get; set; } = string.Empty;

        [MaxLength(100)]
        [Column("correo")]
        public string Correo { get; set; } = string.Empty;

        [MaxLength(50)]
        [Column("rol")]
        public string Rol { get; set; } = string.Empty;

        [MaxLength(100)]
        [Column("accion")]
        public string Accion { get; set; } = string.Empty;

        [Column("descripcion")]
        public string Descripcion { get; set; } = string.Empty;

        [MaxLength(50)]
        [Column("ip")]
        public string IP { get; set; } = string.Empty;

        [Column("fecha")]
        public DateTime Fecha { get; set; } = DateTime.UtcNow;
    }
}
