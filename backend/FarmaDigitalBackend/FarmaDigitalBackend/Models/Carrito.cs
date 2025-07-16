using FarmaDigitalBackend.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace FarmaDigitalBackend.Models
{
    public class Carrito
    {
        [Key]
        [Column("id_carrito")]
        public int IdCarrito { get; set; }

        [Column("id_usuario")]
        public int IdUsuario { get; set; }

        [Column("activo")]
        public bool Activo { get; set; } = true;

        [Column("creado_en")]
        public DateTime CreadoEn { get; set; } = DateTime.UtcNow;

        // Navegación
        [ForeignKey("IdUsuario")]
        public Usuario Usuario { get; set; }
        public ICollection<ItemCarrito> ItemsCarrito { get; set; }
        public ICollection<Orden> Ordenes { get; set; }
    }
}
