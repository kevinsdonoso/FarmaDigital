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
            // ✅ CONFIGURAR PRODUCTO - Solo propiedades básicas
            modelBuilder.Entity<Producto>(entity =>
            {
                entity.ToTable("Productos");
                entity.HasKey(e => e.IdProducto);

                entity.Property(e => e.IdProducto)
                    .HasColumnName("id_producto")
                    .ValueGeneratedOnAdd();

                entity.Property(e => e.Nombre)
                    .HasColumnName("nombre")
                    .HasMaxLength(100)
                    .IsRequired();

                entity.Property(e => e.Descripcion)
                    .HasColumnName("descripcion")
                    .HasMaxLength(500);

                entity.Property(e => e.Precio)
                    .HasColumnName("precio")
                    .HasColumnType("decimal(10,2)")
                    .IsRequired();

                entity.Property(e => e.Stock)
                    .HasColumnName("stock")
                    .IsRequired();

                entity.Property(e => e.EsSensible)
                    .HasColumnName("es_sensible")
                    .HasDefaultValue(false);

                entity.Property(e => e.Categoria)
                    .HasColumnName("categoria")
                    .HasMaxLength(50)
                    .IsRequired();

                entity.Property(e => e.CreadoEn)
                    .HasColumnName("creado_en")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(e => e.CreadoPor)
                    .HasColumnName("creado_por")
                    .IsRequired(false);

                entity.Property(e => e.Activo)
                    .HasColumnName("Activo")
                    .HasDefaultValue(true);

                // ✅ SIN RELACIONES - Solo configuración de propiedades
            });

            // ✅ CONFIGURAR USUARIO - Solo propiedades básicas
            modelBuilder.Entity<Usuario>(entity =>
            {
                entity.ToTable("Usuarios");
                entity.HasKey(e => e.IdUsuario);

                entity.Property(e => e.IdUsuario)
                    .HasColumnName("id_usuario")
                    .ValueGeneratedOnAdd();

                entity.Property(e => e.Dni)
                    .HasColumnName("dni")
                    .HasMaxLength(20)
                    .IsRequired();

                entity.Property(e => e.Nombre)
                    .HasColumnName("nombre")
                    .HasMaxLength(100)
                    .IsRequired();

                entity.Property(e => e.Correo)
                    .HasColumnName("correo")
                    .HasMaxLength(100)
                    .IsRequired();

                entity.Property(e => e.PasswordHash)
                    .HasColumnName("password_hash")
                    .IsRequired();

                entity.Property(e => e.IdRol)
                    .HasColumnName("id_rol");

                entity.Property(e => e.MfaActivado)
                    .HasColumnName("mfa_activado")
                    .HasDefaultValue(false);

                entity.Property(e => e.CreadoEn)
                    .HasColumnName("creado_en")
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                // ✅ SIN RELACIONES - Solo configuración de propiedades
            });

            // ✅ CONFIGURAR OTRAS ENTIDADES de manera similar (sin navegación)
            // Agregar configuraciones para Rol, Carrito, etc. solo con propiedades básicas

            base.OnModelCreating(modelBuilder);
        }
    }
}