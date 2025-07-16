﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FarmaDigitalBackend.Models
{
    public class Usuario
    {
        [Key]
        [Column("id_usuario")]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        [Column("nombre")]
        public string Nombre { get; set; }

        [Required]
        [MaxLength(100)]
        [Column("correo")]
        public string Correo { get; set; }

        [Required]
        [Column("password_hash")]
        public string ContrasenaHash { get; set; }

        [ForeignKey("Rol")]
        [Column("id_rol")]
        public int IdRol { get; set; }

        [Column("mfa_activado")]
        public bool MfaActivado { get; set; } = false;

        [Column("creado_en")]
        public DateTime CreadoEn { get; set; } = DateTime.UtcNow;

        // Relaciones
        public Rol Rol { get; set; }
        public virtual ICollection<Factura> Facturas { get; set; }
        public virtual ICollection<Carrito> Carritos { get; set; }
        public virtual ICollection<Orden> Ordenes { get; set; }
        public virtual ICollection<LogAuditoria> LogsAuditoria { get; set; }
    }
}
