using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace FarmaDigitalBackend.Models
{
    public class ItemCarrito
    {
        [Key]
        [Column("id_item_carrito")]
        public int IdItemCarrito { get; set; }

        [Column("id_carrito")]
        public int IdCarrito { get; set; }

        [Column("id_producto")]
        public int IdProducto { get; set; }

        [Required]
        [Column("cantidad")]
        public int Cantidad { get; set; }

        // Navegación
        [ForeignKey("IdCarrito")]
        public Carrito Carrito { get; set; }

        [ForeignKey("IdProducto")]
        public Producto Producto { get; set; }
    }
}
