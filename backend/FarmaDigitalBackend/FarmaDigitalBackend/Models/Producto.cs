using System.ComponentModel.DataAnnotations;

namespace FarmaDigitalBackend.Models
{
    public class Producto
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Nombre { get; set; }

        public string Descripcion { get; set; }

        [Range(0, 9999)]
        public decimal Precio { get; set; }

        [Range(0, int.MaxValue)]
        public int Stock { get; set; }

        public bool EsSensible { get; set; } = false;

        public ICollection<DetalleFactura> DetallesFactura { get; set; }
    }
}
