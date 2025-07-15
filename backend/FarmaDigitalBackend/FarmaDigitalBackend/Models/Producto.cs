using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FarmaDigitalBackend.Models
{
    [Table("productos")]
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
        public string? Descripcion { get; set; }

        [Required]
        [Column("precio")]
        public decimal Precio { get; set; }

        [Required]
        [Column("stock")]
        public int Stock { get; set; }

        [Column("es_sensible")]
        public bool EsSensible { get; set; } = false;

        [Required]
        [MaxLength(50)]
        [Column("categoria")]
        public string Categoria { get; set; } = string.Empty;

        [Column("creado_por")]
        public int? CreadoPorId { get; set; }

        [Column("creado_en")]
        public DateTime CreadoEn { get; set; } = DateTime.UtcNow; // ← CAMBIAR A UTC

        [Column("activo")]
        public bool Activo { get; set; } = true;

        // Relaciones
        [ForeignKey("CreadoPorId")]
        public virtual Usuario? UsuarioCreador { get; set; }
        
        public virtual ICollection<ItemCarrito> ItemsCarrito { get; set; } = new List<ItemCarrito>();
        public virtual ICollection<DetalleFactura> DetallesFactura { get; set; } = new List<DetalleFactura>();
    }
}