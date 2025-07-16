using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace FarmaDigitalBackend.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "roles",
                columns: table => new
                {
                    id_rol = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    nombre_rol = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_roles", x => x.id_rol);
                });

            migrationBuilder.CreateTable(
                name: "usuarios",
                columns: table => new
                {
                    id_usuario = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    nombre = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    correo = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    password_hash = table.Column<string>(type: "text", nullable: false),
                    id_rol = table.Column<int>(type: "integer", nullable: false),
                    mfa_activado = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    creado_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_usuarios", x => x.id_usuario);
                    table.ForeignKey(
                        name: "FK_usuarios_roles_id_rol",
                        column: x => x.id_rol,
                        principalTable: "roles",
                        principalColumn: "id_rol",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "carritos",
                columns: table => new
                {
                    id_carrito = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    id_usuario = table.Column<int>(type: "integer", nullable: false),
                    activo = table.Column<bool>(type: "boolean", nullable: false),
                    creado_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_carritos", x => x.id_carrito);
                    table.ForeignKey(
                        name: "FK_carritos_usuarios_id_usuario",
                        column: x => x.id_usuario,
                        principalTable: "usuarios",
                        principalColumn: "id_usuario",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "LogsAuditoria",
                columns: table => new
                {
                    id_log = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    id_usuario = table.Column<int>(type: "integer", nullable: false),
                    accion = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    descripcion = table.Column<string>(type: "text", nullable: false),
                    direccion_ip = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    creado_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LogsAuditoria", x => x.id_log);
                    table.ForeignKey(
                        name: "FK_LogsAuditoria_usuarios_id_usuario",
                        column: x => x.id_usuario,
                        principalTable: "usuarios",
                        principalColumn: "id_usuario",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "productos",
                columns: table => new
                {
                    id_producto = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    nombre = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    descripcion = table.Column<string>(type: "text", nullable: false),
                    precio = table.Column<decimal>(type: "numeric(10,2)", nullable: false),
                    stock = table.Column<int>(type: "integer", nullable: false),
                    es_sensible = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    categoria = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    creado_por = table.Column<int>(type: "integer", nullable: true),
                    creado_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    activo = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_productos", x => x.id_producto);
                    table.ForeignKey(
                        name: "FK_productos_usuarios_creado_por",
                        column: x => x.creado_por,
                        principalTable: "usuarios",
                        principalColumn: "id_usuario",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "ordenes",
                columns: table => new
                {
                    id_orden = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    id_usuario = table.Column<int>(type: "integer", nullable: false),
                    id_carrito = table.Column<int>(type: "integer", nullable: true),
                    total = table.Column<decimal>(type: "numeric", nullable: false),
                    metodo_pago = table.Column<string>(type: "text", nullable: false),
                    estado = table.Column<string>(type: "text", nullable: false),
                    creado_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ordenes", x => x.id_orden);
                    table.ForeignKey(
                        name: "FK_ordenes_carritos_id_carrito",
                        column: x => x.id_carrito,
                        principalTable: "carritos",
                        principalColumn: "id_carrito");
                    table.ForeignKey(
                        name: "FK_ordenes_usuarios_id_usuario",
                        column: x => x.id_usuario,
                        principalTable: "usuarios",
                        principalColumn: "id_usuario",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ItemsCarrito",
                columns: table => new
                {
                    id_item_carrito = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    id_carrito = table.Column<int>(type: "integer", nullable: false),
                    id_producto = table.Column<int>(type: "integer", nullable: false),
                    cantidad = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ItemsCarrito", x => x.id_item_carrito);
                    table.ForeignKey(
                        name: "FK_ItemsCarrito_carritos_id_carrito",
                        column: x => x.id_carrito,
                        principalTable: "carritos",
                        principalColumn: "id_carrito",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ItemsCarrito_productos_id_producto",
                        column: x => x.id_producto,
                        principalTable: "productos",
                        principalColumn: "id_producto",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "facturas",
                columns: table => new
                {
                    id_factura = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    id_orden = table.Column<int>(type: "integer", nullable: false),
                    id_usuario = table.Column<int>(type: "integer", nullable: false),
                    fecha_emision = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    subtotal = table.Column<decimal>(type: "numeric", nullable: false),
                    iva = table.Column<decimal>(type: "numeric", nullable: false),
                    total = table.Column<decimal>(type: "numeric", nullable: false),
                    metodo_pago = table.Column<string>(type: "text", nullable: false),
                    referencia_pago = table.Column<string>(type: "text", nullable: false),
                    estado_pago = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_facturas", x => x.id_factura);
                    table.ForeignKey(
                        name: "FK_facturas_ordenes_id_orden",
                        column: x => x.id_orden,
                        principalTable: "ordenes",
                        principalColumn: "id_orden",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_facturas_usuarios_id_usuario",
                        column: x => x.id_usuario,
                        principalTable: "usuarios",
                        principalColumn: "id_usuario",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DetallesFactura",
                columns: table => new
                {
                    id_detalle_factura = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    id_factura = table.Column<int>(type: "integer", nullable: false),
                    id_producto = table.Column<int>(type: "integer", nullable: false),
                    cantidad = table.Column<int>(type: "integer", nullable: false),
                    precio_unitario = table.Column<decimal>(type: "numeric", nullable: false),
                    subtotal = table.Column<decimal>(type: "numeric", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DetallesFactura", x => x.id_detalle_factura);
                    table.ForeignKey(
                        name: "FK_DetallesFactura_facturas_id_factura",
                        column: x => x.id_factura,
                        principalTable: "facturas",
                        principalColumn: "id_factura",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DetallesFactura_productos_id_producto",
                        column: x => x.id_producto,
                        principalTable: "productos",
                        principalColumn: "id_producto",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_carritos_id_usuario",
                table: "carritos",
                column: "id_usuario");

            migrationBuilder.CreateIndex(
                name: "IX_DetallesFactura_id_factura",
                table: "DetallesFactura",
                column: "id_factura");

            migrationBuilder.CreateIndex(
                name: "IX_DetallesFactura_id_producto",
                table: "DetallesFactura",
                column: "id_producto");

            migrationBuilder.CreateIndex(
                name: "IX_facturas_id_orden",
                table: "facturas",
                column: "id_orden");

            migrationBuilder.CreateIndex(
                name: "IX_facturas_id_usuario",
                table: "facturas",
                column: "id_usuario");

            migrationBuilder.CreateIndex(
                name: "IX_ItemsCarrito_id_carrito",
                table: "ItemsCarrito",
                column: "id_carrito");

            migrationBuilder.CreateIndex(
                name: "IX_ItemsCarrito_id_producto",
                table: "ItemsCarrito",
                column: "id_producto");

            migrationBuilder.CreateIndex(
                name: "IX_LogsAuditoria_id_usuario",
                table: "LogsAuditoria",
                column: "id_usuario");

            migrationBuilder.CreateIndex(
                name: "IX_ordenes_id_carrito",
                table: "ordenes",
                column: "id_carrito");

            migrationBuilder.CreateIndex(
                name: "IX_ordenes_id_usuario",
                table: "ordenes",
                column: "id_usuario");

            migrationBuilder.CreateIndex(
                name: "IX_productos_creado_por",
                table: "productos",
                column: "creado_por");

            migrationBuilder.CreateIndex(
                name: "IX_roles_nombre_rol",
                table: "roles",
                column: "nombre_rol",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_usuarios_correo",
                table: "usuarios",
                column: "correo",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_usuarios_id_rol",
                table: "usuarios",
                column: "id_rol");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DetallesFactura");

            migrationBuilder.DropTable(
                name: "ItemsCarrito");

            migrationBuilder.DropTable(
                name: "LogsAuditoria");

            migrationBuilder.DropTable(
                name: "facturas");

            migrationBuilder.DropTable(
                name: "productos");

            migrationBuilder.DropTable(
                name: "ordenes");

            migrationBuilder.DropTable(
                name: "carritos");

            migrationBuilder.DropTable(
                name: "usuarios");

            migrationBuilder.DropTable(
                name: "roles");
        }
    }
}
