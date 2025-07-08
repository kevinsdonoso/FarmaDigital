using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FarmaDigitalBackend.Models
{
    public class Tarjeta
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("Usuario")]
        public int IdUsuario { get; set; }
        public Usuario Usuario { get; set; }

        [Required]
        [MaxLength(4)]
        public string Ultimos4 { get; set; }

        [Required]
        public string TokenTarjeta { get; set; } // En sistema real, cifrado AES o token

        [MaxLength(50)]
        public string Marca { get; set; }

        public DateTime FechaVencimiento { get; set; }

        public ICollection<Factura> Facturas { get; set; }
    }
}
