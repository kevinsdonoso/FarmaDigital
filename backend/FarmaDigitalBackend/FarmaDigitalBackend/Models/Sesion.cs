using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FarmaDigitalBackend.Models
{
    public class Sesion
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("Usuario")]
        public int IdUsuario { get; set; }
        public Usuario Usuario { get; set; }

        public DateTime FechaInicio { get; set; }

        [MaxLength(45)]
        public string Ip { get; set; }

        public string UserAgent { get; set; }
    }
}
