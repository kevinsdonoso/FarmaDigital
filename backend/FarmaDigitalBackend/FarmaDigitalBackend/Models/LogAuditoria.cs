using FarmaDigitalBackend.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FarmaDigitalBackend.Models
{
    public class LogAuditoria
    {
        [Key]
        [Column("id_log")]
        public int IdLog { get; set; }

        [Column("id_usuario")]
        public int? IdUsuario { get; set; }

        [MaxLength(100)]
        [Column("accion")]
        public string Accion { get; set; }

        [Column("descripcion")]
        public string Descripcion { get; set; }

        [MaxLength(50)]
        [Column("direccion_ip")]
        public string DireccionIp { get; set; }

        [Column("creado_en")]
        public DateTime CreadoEn { get; set; } = DateTime.UtcNow;

        // Navegación
        [ForeignKey("IdUsuario")]
        public Usuario Usuario { get; set; }
    }

}
