/*using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FarmaDigitalBackend.Models
{
    public class IntentoLogin
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("Usuario")]
        public int IdUsuario { get; set; }
        public Usuario Usuario { get; set; }

        public DateTime Fecha { get; set; } = DateTime.UtcNow;

        public bool Exito { get; set; }

        [MaxLength(45)]
        public string Ip { get; set; }
    }
}
*/