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
        // public DbSet<LogAuditoria> LogsAuditoria { get; set; } // Comentado temporalmente

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configurar tabla productos
                   // En el DbContext, agregar la configuración para el campo activo
                // En OnModelCreating, agregar:
        modelBuilder.Entity<Producto>(entity =>
        {
            entity.ToTable("productos");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id_producto");
            entity.Property(e => e.Nombre).HasColumnName("nombre").HasMaxLength(100);
            entity.Property(e => e.Descripcion).HasColumnName("descripcion");
            entity.Property(e => e.Precio).HasColumnName("precio").HasColumnType("numeric(10,2)");
            entity.Property(e => e.Stock).HasColumnName("stock");
            entity.Property(e => e.EsSensible).HasColumnName("es_sensible").HasDefaultValue(false);
            entity.Property(e => e.Categoria).HasColumnName("categoria").HasMaxLength(50);
            entity.Property(e => e.CreadoPorId).HasColumnName("creado_por");
            entity.Property(e => e.CreadoEn).HasColumnName("creado_en")
                .HasConversion(
                    v => v.ToUniversalTime(), // ← CONVERTIR A UTC AL GUARDAR
                    v => DateTime.SpecifyKind(v, DateTimeKind.Utc) // ← ESPECIFICAR UTC AL LEER
                );
            entity.Property(e => e.Activo).HasColumnName("activo").HasDefaultValue(true);
        // AGREGAR RELACIÓN CON USUARIO
        entity.HasOne(p => p.UsuarioCreador)
            .WithMany()
            .HasForeignKey(p => p.CreadoPorId)
            .OnDelete(DeleteBehavior.SetNull);
    });
        
       
            // Configurar tabla usuarios
            modelBuilder.Entity<Usuario>(entity =>
            {
                entity.ToTable("usuarios");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasColumnName("id_usuario");
                entity.Property(e => e.Nombre).HasColumnName("nombre").HasMaxLength(100);
                entity.Property(e => e.Correo).HasColumnName("correo").HasMaxLength(100);
                entity.Property(e => e.ContrasenaHash).HasColumnName("password_hash");
                entity.Property(e => e.IdRol).HasColumnName("id_rol");
                entity.Property(e => e.MfaActivado).HasColumnName("mfa_activado").HasDefaultValue(false);
                entity.Property(e => e.CreadoEn).HasColumnName("creado_en").HasDefaultValueSql("CURRENT_TIMESTAMP");
            });

            // Configurar tabla roles
            modelBuilder.Entity<Rol>(entity =>
            {
                entity.ToTable("roles");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasColumnName("id_rol");
                entity.Property(e => e.NombreRol).HasColumnName("nombre_rol").HasMaxLength(20);
            });

            // Configurar tablas adicionales
            modelBuilder.Entity<Carrito>().ToTable("carritos");
             // Cambiar las relaciones:
        // ItemCarrito -> Producto: CASCADE para limpiar carritos
        modelBuilder.Entity<ItemCarrito>()
            .HasOne(i => i.Producto)
            .WithMany(p => p.ItemsCarrito)
            .HasForeignKey(i => i.IdProducto)
            .OnDelete(DeleteBehavior.Cascade);
        
        

            modelBuilder.Entity<Orden>().ToTable("ordenes");
            modelBuilder.Entity<Factura>().ToTable("facturas");
           // DetalleFactura -> Producto: RESTRICT para preservar facturas
        modelBuilder.Entity<DetalleFactura>()
            .HasOne(d => d.Producto)
            .WithMany(p => p.DetallesFactura)
            .HasForeignKey(d => d.IdProducto)
            .OnDelete(DeleteBehavior.Restrict); // ← CAMBIAR A RESTRICT

            // Configurar índices únicos
            modelBuilder.Entity<Rol>()
                .HasIndex(r => r.NombreRol)
                .IsUnique();

            modelBuilder.Entity<Usuario>()
                .HasIndex(u => u.Correo)
                .IsUnique();
        }
    }
}