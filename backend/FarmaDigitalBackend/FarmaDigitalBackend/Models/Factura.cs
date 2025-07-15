using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FarmaDigitalBackend.Models
{
    public class Factura
    {
        [Key]
        [Column("id_factura")]
        public int Id { get; set; }

        [Required]
        [ForeignKey("Orden")]
        [Column("id_orden")]
        public int IdOrden { get; set; }
        public Orden Orden { get; set; }

        [Required]
        [ForeignKey("Usuario")]
        [Column("id_usuario")]
        public int IdUsuario { get; set; }
        public Usuario Usuario { get; set; }

        [Column("fecha_emision")]
        public DateTime FechaEmision { get; set; } = DateTime.UtcNow;

        [Required]
        [Column("subtotal")]
        public decimal Subtotal { get; set; }

        [Column("iva")]
        public decimal Iva { get; set; } = 0;

        [Required]
        [Column("total")]
        public decimal Total { get; set; }

        [Required]
        [Column("metodo_pago")]
        public string MetodoPago { get; set; }

        [Column("referencia_pago")]
        public string ReferenciaPago { get; set; }

        [Column("estado_pago")]
        public string EstadoPago { get; set; } = "pendiente";

        public ICollection<DetalleFactura> DetallesFactura { get; set; }
    }
}
