using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FarmaDigitalBackend.Models
{
    public class Orden
    {
        [Key]
        [Column("id_orden")]
        public int Id { get; set; }

        [ForeignKey("Usuario")]
        [Column("id_usuario")]
        public int IdUsuario { get; set; }
        public Usuario Usuario { get; set; }

        [ForeignKey("Carrito")]
        [Column("id_carrito")]
        public int? IdCarrito { get; set; }
        public Carrito Carrito { get; set; }

        [Column("total")]
        public decimal Total { get; set; }

        [Column("metodo_pago")]
        public string MetodoPago { get; set; }

        [Column("estado")]
        public string Estado { get; set; } = "pendiente";

        [Column("creado_en")]
        public DateTime CreadoEn { get; set; } = DateTime.UtcNow;

        public ICollection<Factura> Facturas { get; set; }
    }
}
