using FarmaDigitalBackend.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FarmaDigitalBackend.Models
{
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
        [Column("fecha_emision")]
        public DateTime FechaEmision { get; set; } = DateTime.UtcNow;

        [Required]
        [Column("subtotal", TypeName = "decimal(10,2)")]
        public decimal Subtotal { get; set; }

        [Column("iva", TypeName = "decimal(10,2)")]
        public decimal Iva { get; set; } = 0;

        [Required]
        [Column("total", TypeName = "decimal(10,2)")]
        public decimal Total { get; set; }

        [Required]
        [MaxLength(50)]
        [Column("metodo_pago")]
        public string MetodoPago { get; set; }

        [MaxLength(100)]
        [Column("referencia_pago")]
        public string ReferenciaPago { get; set; }

        [MaxLength(20)]
        [Column("estado_pago")]
        public string EstadoPago { get; set; } = "pendiente";

        // Navegación
        [ForeignKey("IdOrden")]
        public Orden Orden { get; set; }

        [ForeignKey("IdUsuario")]
        public Usuario Usuario { get; set; }

        public ICollection<DetalleFactura> DetallesFactura { get; set; }
    }
}
