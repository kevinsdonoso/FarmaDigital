using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FarmaDigitalBackend.Models
{
    public class TwoFactorAuth
    {
        [Key]
        [Column("id_two_factor")]
        public int IdTwoFactor { get; set; }
        
        [Required]
        [Column("id_usuario")]
        public int IdUsuario { get; set; }
        
        [Required]
        [Column("secret_key")]
        [MaxLength(32)]
        public string SecretKey { get; set; }
        
        [Column("is_activated")]
        public bool IsActivated { get; set; } = false;
        
        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        [Column("backup_codes")]
        [MaxLength(500)]
        public string? BackupCodes { get; set; }
        
        // Navegación
        [ForeignKey("IdUsuario")]
        public Usuario Usuario { get; set; }
    }
}