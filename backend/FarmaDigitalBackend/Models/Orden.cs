using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FarmaDigitalBackend.Models
{
    [Table("Ordenes")]
    public class Orden
    {
        [Key]
        [Column("id_orden")]
        public int IdOrden { get; set; }

        [Required]
        [Column("id_usuario")]
        public int IdUsuario { get; set; }

        [Column("id_carrito")]
        public int? IdCarrito { get; set; }

        [Required]
        [Column("total", TypeName = "decimal(10,2)")]
        public decimal Total { get; set; }

        [Required]
        [MaxLength(50)]
        [Column("metodo_pago")]
        public string MetodoPago { get; set; } = string.Empty;

        [Required]
        [MaxLength(20)]
        [Column("estado")]
        public string Estado { get; set; } = "pendiente";

        [Column("creado_en")]
        public DateTime CreadoEn { get; set; } = DateTime.UtcNow;

        [Column("actualizado_en")]
        public DateTime? ActualizadoEn { get; set; }

        // Relaciones (opcional)
        [ForeignKey("IdUsuario")]
        public virtual Usuario? Usuario { get; set; }
    }
}
