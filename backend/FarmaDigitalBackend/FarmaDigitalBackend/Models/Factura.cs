using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FarmaDigitalBackend.Models
{
    public class Factura
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("Usuario")]
        public int IdUsuario { get; set; }
        public Usuario Usuario { get; set; }

        public DateTime FechaEmision { get; set; } = DateTime.UtcNow;

        [Range(0, double.MaxValue)]
        public decimal Total { get; set; }

        public string ReferenciaPago { get; set; }

        [ForeignKey("Tarjeta")]
        public int? IdTarjetaUsada { get; set; }
        public Tarjeta Tarjeta { get; set; }

        public ICollection<DetalleFactura> Detalles { get; set; }
    }
}
