using FarmaDigitalBackend.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FarmaDigitalBackend.Models
{
    public class Producto
    {
        [Key]
        [Column("id_producto")]
        public int IdProducto { get; set; }

        [Required]
        [MaxLength(100)]
        [Column("nombre")]
        public string Nombre { get; set; }

        [Column("descripcion")]
        public string Descripcion { get; set; }

        [Required]
        [Column("precio", TypeName = "decimal(10,2)")]
        public decimal Precio { get; set; }

        [Required]
        [Column("stock")]
        public int Stock { get; set; }

        [Column("es_sensible")]
        public bool EsSensible { get; set; } = false;

        [Column("activo")]
        public bool Activo { get; set; }

        [Required]
        [MaxLength(50)]
        [Column("categoria")]
        public string Categoria { get; set; }

        [Column("creado_por")]
        public int CreadoPor { get; set; }

        [Column("creado_en")]
        public DateTime CreadoEn { get; set; } = DateTime.UtcNow;

        // Navegación
        [ForeignKey("CreadoPor")]
        public Usuario Usuario { get; set; }
        public ICollection<ItemCarrito> ItemsCarrito { get; set; }
        public ICollection<DetalleFactura> DetallesFactura { get; set; }
    }
}
