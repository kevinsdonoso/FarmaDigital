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

        [Column("id_usuario")]
        public int IdUsuario { get; set; }

        [Column("id_carrito")]
        public int? IdCarrito { get; set; }

        [Column("total", TypeName = "decimal(10,2)")]
        public decimal? Total { get; set; }

        [MaxLength(50)]
        [Column("metodo_pago")]
        public string MetodoPago { get; set; } = string.Empty;

        [MaxLength(20)]
        [Column("estado")]
        public string Estado { get; set; } = "pendiente";

        [Column("creado_en")]
        public DateTime CreadoEn { get; set; } = DateTime.UtcNow;
    }
}
