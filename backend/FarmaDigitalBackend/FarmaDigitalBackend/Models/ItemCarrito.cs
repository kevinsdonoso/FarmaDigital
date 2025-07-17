using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FarmaDigitalBackend.Models
{
    [Table("ItemsCarrito")]
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

        // ✅ ELIMINADO:
        // public Carrito Carrito { get; set; }
        // public Producto Producto { get; set; }
    }
}
