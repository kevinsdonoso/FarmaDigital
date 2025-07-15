using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FarmaDigitalBackend.Models
{
    public class Orden
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("Usuario")]
        public int IdUsuario { get; set; }
        public Usuario Usuario { get; set; }

        [ForeignKey("Carrito")]
        public int? IdCarrito { get; set; }
        public Carrito Carrito { get; set; }

        public decimal Total { get; set; }

        public string MetodoPago { get; set; }

        public string Estado { get; set; } = "pendiente";

        public DateTime CreadoEn { get; set; } = DateTime.UtcNow;

        public Factura Factura { get; set; }
    }
}
