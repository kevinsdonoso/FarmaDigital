using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FarmaDigitalBackend.Models
{
    public class DetalleFactura
    {
        [Key]
        [Column("id_detalle_factura")]
        public int Id { get; set; }

        [Required]
        [ForeignKey("Factura")]
        [Column("id_factura")]
        public int IdFactura { get; set; }

        [Required]
        [ForeignKey("Producto")]
        [Column("id_producto")]
        public int IdProducto { get; set; }

        [Required]
        [Column("cantidad")]
        [Range(1, int.MaxValue)]
        public int Cantidad { get; set; }

        [Required]
        [Column("precio_unitario")]
        public decimal PrecioUnitario { get; set; }

        [Required]
        [Column("subtotal")]
        public decimal Subtotal { get; set; }

        // Relaciones
        public Factura Factura { get; set; }
        public Producto Producto { get; set; }
    }
}
