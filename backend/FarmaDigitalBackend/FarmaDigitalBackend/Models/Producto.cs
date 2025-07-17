using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FarmaDigitalBackend.Models
{
    [Table("Productos")]
    public class Producto
    {
        [Key]
        [Column("id_producto")]
        public int IdProducto { get; set; }

        [Required]
        [Column("nombre")]
        public string Nombre { get; set; }

        [Column("descripcion")]
        public string? Descripcion { get; set; }

        [Required]
        [Column("precio")]
        public decimal Precio { get; set; }

        [Required]
        [Column("stock")]
        public int Stock { get; set; }

        [Column("es_sensible")]
        public bool EsSensible { get; set; }

        [Required]
        [Column("categoria")]
        public string Categoria { get; set; }

        [Column("creado_en")]
        public DateTime CreadoEn { get; set; }

        // ✅ IMPORTANTE: Solo un entero, NO una relación
        [Column("creado_por")]
        public int? CreadoPor { get; set; }

        [Column("Activo")]
        public bool Activo { get; set; }

        // ✅ NO incluir propiedades de navegación como:
        // public Usuario? Usuario { get; set; }
        // public virtual Usuario? CreatedByUser { get; set; }
    }
}