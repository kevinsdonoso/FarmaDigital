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
        [Column("accion")]
        public string Accion { get; set; } = string.Empty;

        [Column("descripcion")]
        public string Descripcion { get; set; } = string.Empty;

        [MaxLength(50)]
        [Column("direccion_ip")]
        public string DireccionIp { get; set; } = string.Empty;

        [Column("creado_en")]
        public DateTime CreadoEn { get; set; } = DateTime.UtcNow;
    }
}
