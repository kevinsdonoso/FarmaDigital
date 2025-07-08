using Microsoft.EntityFrameworkCore;

using FarmaDigitalBackend.Models;
using System.Collections.Generic;
using System.Reflection.Emit;

namespace FarmaDigitalBackend.Data
{
    public class FarmaDbContext : DbContext
    {
        public FarmaDbContext(DbContextOptions<FarmaDbContext> options)
            : base(options)
        {
        }

        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Rol> Roles { get; set; }
        public DbSet<Producto> Productos { get; set; }
        public DbSet<Tarjeta> Tarjetas { get; set; }
        public DbSet<Factura> Facturas { get; set; }
        public DbSet<DetalleFactura> DetallesFactura { get; set; }
        public DbSet<Sesion> Sesiones { get; set; }
        public DbSet<IntentoLogin> IntentosLogin { get; set; }
        public DbSet<LogAuditoria> LogsAuditoria { get; set; }
        public DbSet<AlertaSeguridad> AlertasSeguridad { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder); // Si usas Identity, aquí se incluye

            modelBuilder.Entity<Usuario>()
                .HasIndex(u => u.Correo)
                .IsUnique();

            modelBuilder.Entity<Tarjeta>()
                .HasIndex(t => t.TokenTarjeta)
                .IsUnique();
        }
    }
}
