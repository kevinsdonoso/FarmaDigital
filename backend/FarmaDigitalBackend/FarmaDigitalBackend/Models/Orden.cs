using FarmaDigitalBackend.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace FarmaDigitalBackend.Models
{
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
        public string MetodoPago { get; set; }

        [MaxLength(20)]
        [Column("estado")]
        public string Estado { get; set; } = "pendiente";

        [Column("creado_en")]
        public DateTime CreadoEn { get; set; } = DateTime.UtcNow;

        // Navegación
        [ForeignKey("IdUsuario")]
        public Usuario Usuario { get; set; }

        [ForeignKey("IdCarrito")]
        public Carrito Carrito { get; set; }

        public ICollection<Factura> Facturas { get; set; }
    }
}
