using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FarmaDigitalBackend.Models
{
    [Table("Facturas")]
    public class Factura
    {
        [Key]
        [Column("id_factura")]
        public int IdFactura { get; set; }

        [Required]
        [Column("id_orden")]
        public int IdOrden { get; set; }

        [Required]
        [Column("id_usuario")]
        public int IdUsuario { get; set; }

        [Required]
        [MaxLength(50)]
        [Column("numero_factura")]
        public string NumeroFactura { get; set; } = string.Empty;

        [Required]
        [Column("fecha_emision")]
        public DateTime FechaEmision { get; set; } = DateTime.UtcNow;

        [Required]
        [Column("subtotal", TypeName = "decimal(10,2)")]
        public decimal Subtotal { get; set; }

        [Required]
        [Column("impuestos", TypeName = "decimal(10,2)")]
        public decimal Impuestos { get; set; }

        [Required]
        [Column("total", TypeName = "decimal(10,2)")]
        public decimal Total { get; set; }

        [MaxLength(20)]
        [Column("estado")]
        public string Estado { get; set; } = "emitida";
    }
}
