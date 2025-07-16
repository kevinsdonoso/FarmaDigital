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
        public string Nombre { get; set; } = string.Empty;

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
        public string Categoria { get; set; } = string.Empty;

        [ForeignKey("UsuarioCreador")]
        [Column("creado_por")]
        public int? CreadoPorId { get; set; }

        [Column("creado_en")]
        public DateTime CreadoEn { get; set; } = DateTime.UtcNow;

        [Column("activo")]
        public bool Activo { get; set; } = true;

        // Relaciones
        public Usuario UsuarioCreador { get; set; }
        public virtual ICollection<ItemCarrito> ItemsCarrito { get; set; } = new List<ItemCarrito>();
        public virtual ICollection<DetalleFactura> DetallesFactura { get; set; } = new List<DetalleFactura>();
    }
}
