using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FarmaDigitalBackend.Models
{
    public class DetalleFactura
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("Factura")]
        public int IdFactura { get; set; }
        public Factura Factura { get; set; }

        [ForeignKey("Producto")]
        public int IdProducto { get; set; }
        public Producto Producto { get; set; }

        [Range(1, int.MaxValue)]
        public int Cantidad { get; set; }

        [Range(0, double.MaxValue)]
        public decimal Subtotal { get; set; }
    }
}
