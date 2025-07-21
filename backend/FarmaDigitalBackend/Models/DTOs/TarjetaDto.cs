using System.ComponentModel.DataAnnotations;

namespace FarmaDigitalBackend.Models.DTOs
{
    public class TarjetaDto
    {
        [Required]
        [StringLength(16, MinimumLength = 16)]
        public string NumeroTarjeta { get; set; } = string.Empty;

        [Required]
        [StringLength(7, MinimumLength = 7)]
        public string FechaExpiracion { get; set; } = string.Empty; // MM/YYYY

        [Required]
        [StringLength(3, MinimumLength = 3)]
        public string CVV { get; set; } = string.Empty;

        [Required]
        [StringLength(100, MinimumLength = 2)]
        public string NombreTitular { get; set; } = string.Empty;

        public bool EsPrincipal { get; set; } = false;

        public string? Codigo2FA { get; set; } // Nuevo campo
    }

    public class TarjetaResponseDto
    {
        public int IdTarjeta { get; set; }
        public string UltimosDigitos { get; set; } = string.Empty;
        public string TipoTarjeta { get; set; } = string.Empty;
        public string FechaExpiracion { get; set; } = string.Empty;
        public string NombreTitular { get; set; } = string.Empty;
        public bool EsPrincipal { get; set; }
        public bool Activa { get; set; }
    }
}