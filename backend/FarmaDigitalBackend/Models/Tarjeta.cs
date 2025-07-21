using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FarmaDigitalBackend.Models
{
    [Table("Tarjetas")]
    public class Tarjeta
    {
        [Key]
        [Column("id_tarjeta")]
        public int IdTarjeta { get; set; }

        [Required]
        [Column("id_usuario")]
        public int IdUsuario { get; set; }

        [Required]
        [MaxLength(4)]
        [Column("ultimos_digitos")]
        public string UltimosDigitos { get; set; } = string.Empty;

        [Required]
        [Column("numero_encriptado")]
        public string NumeroEncriptado { get; set; } = string.Empty;

        [Required]
        [MaxLength(20)]
        [Column("tipo_tarjeta")]
        public string TipoTarjeta { get; set; } = string.Empty; // Visa, MasterCard, etc.

        [Required]
        [MaxLength(7)]
        [Column("fecha_expiracion")]
        public string FechaExpiracion { get; set; } = string.Empty; // MM/YYYY

        [Required]
        [MaxLength(50)]
        [Column("nombre_titular")]
        public string NombreTitular { get; set; } = string.Empty;

        [Column("es_principal")]
        public bool EsPrincipal { get; set; } = false;

        [Column("activa")]
        public bool Activa { get; set; } = true;

        [Column("creada_en")]
        public DateTime CreadaEn { get; set; } = DateTime.UtcNow;
    }
}