using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FarmaDigitalBackend.Models
{
    public class ItemCarrito
    {
        [Key]
        [Column("id_item_carrito")]
        public int Id { get; set; }

        [Required]
        [ForeignKey("Carrito")]
        [Column("id_carrito")]
        public int IdCarrito { get; set; }

        [Required]
        [ForeignKey("Producto")]
        [Column("id_producto")]
        public int IdProducto { get; set; }

        [Required]
        [Range(1, int.MaxValue)]
        [Column("cantidad")]
        public int Cantidad { get; set; }

        // Relaciones
        public virtual Carrito Carrito { get; set; } = null!;
        public virtual Producto Producto { get; set; } = null!;
    }
}
