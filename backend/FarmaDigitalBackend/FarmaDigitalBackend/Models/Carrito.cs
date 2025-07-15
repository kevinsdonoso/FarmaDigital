using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FarmaDigitalBackend.Models
{
    public class Carrito
    {
        [Key]
        [Column("id_carrito")]
        public int Id { get; set; }

        [Required]
        [ForeignKey("Usuario")]
        [Column("id_usuario")]
        public int IdUsuario { get; set; }

        public Usuario Usuario { get; set; }

        [Column("activo")]
        public bool Activo { get; set; } = true;

        [Column("creado_en")]
        public DateTime CreadoEn { get; set; } = DateTime.UtcNow;

        public ICollection<ItemCarrito> ItemsCarrito { get; set; }
        public ICollection<Orden> Ordenes { get; set; }
    }
}
