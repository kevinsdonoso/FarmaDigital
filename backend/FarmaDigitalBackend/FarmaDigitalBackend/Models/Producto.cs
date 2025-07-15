using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FarmaDigitalBackend.Models
{
    public class Producto
    {
        [Key]
        [Column("id_producto")]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        [Column("nombre")]
        public string Nombre { get; set; }

        [Column("descripcion")]
        public string Descripcion { get; set; }

        [Required]
        [Column("precio")]
        [Range(0, 9999.99)]
        public decimal Precio { get; set; }

        [Required]
        [Column("stock")]
        [Range(0, int.MaxValue)]
        public int Stock { get; set; }

        [Column("es_sensible")]
        public bool EsSensible { get; set; } = false;

        [Required]
        [MaxLength(50)]
        [Column("categoria")]
        public string Categoria { get; set; }

        [ForeignKey("Usuario")]
        [Column("creado_por")]
        public int? CreadoPorId { get; set; }
        public Usuario UsuarioCreador { get; set; }

        [Column("creado_en")]
        public DateTime CreadoEn { get; set; } = DateTime.UtcNow;

        // Relaciones
        public ICollection<ItemCarrito> ItemsCarrito { get; set; }
        public ICollection<DetalleFactura> DetallesFactura { get; set; }
    }
}
