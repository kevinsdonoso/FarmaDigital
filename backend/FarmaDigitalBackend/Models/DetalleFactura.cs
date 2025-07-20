using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FarmaDigitalBackend.Models
{
    [Table("DetallesFactura")]
    public class DetalleFactura
    {
        [Key]
        [Column("id_detalle")]
        public int IdDetalle { get; set; }

        [Required]
        [Column("id_factura")]
        public int IdFactura { get; set; }

        [Required]
        [Column("id_producto")]
        public int IdProducto { get; set; }

        [Required]
        [Column("cantidad")]
        public int Cantidad { get; set; }

        [Required]
        [Column("precio_unitario", TypeName = "decimal(10,2)")]
        public decimal PrecioUnitario { get; set; }

        [Required]
        [Column("subtotal", TypeName = "decimal(10,2)")]
        public decimal Subtotal { get; set; }

        // Relaciones (opcional)
        [ForeignKey("IdFactura")]
        public virtual Factura? Factura { get; set; }

        [ForeignKey("IdProducto")]
        public virtual Producto? Producto { get; set; }
    }
}
