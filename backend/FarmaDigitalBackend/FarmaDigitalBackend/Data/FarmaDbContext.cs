// filepath: c:\Users\kelfi\OneDrive\Documentos\FarmaDigital\backend\FarmaDigitalBackend\FarmaDigitalBackend\Data\FarmaDbContext.cs
using Microsoft.EntityFrameworkCore;
using FarmaDigitalBackend.Models;

namespace FarmaDigitalBackend.Data
{
    public class FarmaDbContext : DbContext
    {
        public FarmaDbContext(DbContextOptions<FarmaDbContext> options)
            : base(options)
        {
        }

        public DbSet<Rol> Roles { get; set; }
        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Producto> Productos { get; set; }
        public DbSet<Carrito> Carritos { get; set; }
        public DbSet<ItemCarrito> ItemsCarrito { get; set; }
        public DbSet<Orden> Ordenes { get; set; }
        public DbSet<Factura> Facturas { get; set; }
        public DbSet<DetalleFactura> DetallesFactura { get; set; }
        public DbSet<LogAuditoria> LogsAuditoria { get; set; }
        public DbSet<AlertaSeguridad> AlertasSeguridad { get; set; }
        public DbSet<TwoFactorAuth> TwoFactorAuths { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Usuario>()
                .HasIndex(u => u.Correo)
                .IsUnique();

            modelBuilder.Entity<Tarjeta>()
                .HasIndex(t => t.TokenTarjeta)
                .IsUnique();

            // Configuración para TwoFactorAuth
            modelBuilder.Entity<TwoFactorAuth>()
                .HasOne(t => t.Usuario)
                .WithOne()
                .HasForeignKey<TwoFactorAuth>(t => t.IdUsuario);
        }
    }
}