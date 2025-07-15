using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FarmaDigitalBackend.Models
{
    [Table("items_carrito")]
    public class ItemCarrito
    {
        [Key]
        [Column("id_item_carrito")]
        public int Id { get; set; }

        [Required]
        [Column("id_carrito")]
        public int IdCarrito { get; set; }

        [Required]
        [Column("id_producto")]
        public int IdProducto { get; set; }

        [Required]
        [Column("cantidad")]
        public int Cantidad { get; set; }

        // Propiedades de navegación
        [ForeignKey("IdCarrito")]
        public virtual Carrito Carrito { get; set; } = null!;

        [ForeignKey("IdProducto")]
        public virtual Producto Producto { get; set; } = null!;
    }
}