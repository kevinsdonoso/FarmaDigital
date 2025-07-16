using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace FarmaDigitalBackend.Migrations
{
    /// <inheritdoc />
    public partial class InitialSetup : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AlertasSeguridad_Usuarios_IdUsuario",
                table: "AlertasSeguridad");

            migrationBuilder.DropForeignKey(
                name: "FK_DetallesFactura_Facturas_IdFactura",
                table: "DetallesFactura");

            migrationBuilder.DropForeignKey(
                name: "FK_DetallesFactura_Productos_IdProducto",
                table: "DetallesFactura");

            migrationBuilder.DropForeignKey(
                name: "FK_Facturas_Tarjetas_IdTarjetaUsada",
                table: "Facturas");

            migrationBuilder.DropForeignKey(
                name: "FK_Facturas_Usuarios_IdUsuario",
                table: "Facturas");

            migrationBuilder.DropForeignKey(
                name: "FK_LogsAuditoria_Usuarios_IdUsuario",
                table: "LogsAuditoria");

            migrationBuilder.DropForeignKey(
                name: "FK_Sesiones_Usuarios_IdUsuario",
                table: "Sesiones");

            migrationBuilder.DropForeignKey(
                name: "FK_Usuarios_Roles_IdRol",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "Ip",
                table: "Sesiones");

            migrationBuilder.DropColumn(
                name: "UserAgent",
                table: "Sesiones");

            migrationBuilder.DropColumn(
                name: "NivelSeveridad",
                table: "AlertasSeguridad");

            migrationBuilder.RenameColumn(
                name: "Nombre",
                table: "Usuarios",
                newName: "nombre");

            migrationBuilder.RenameColumn(
                name: "Dni",
                table: "Usuarios",
                newName: "dni");

            migrationBuilder.RenameColumn(
                name: "Correo",
                table: "Usuarios",
                newName: "correo");

            migrationBuilder.RenameColumn(
                name: "MfaActivado",
                table: "Usuarios",
                newName: "mfa_activado");

            migrationBuilder.RenameColumn(
                name: "IdRol",
                table: "Usuarios",
                newName: "id_rol");

            migrationBuilder.RenameColumn(
                name: "ContrasenaHash",
                table: "Usuarios",
                newName: "password_hash");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Usuarios",
                newName: "id_usuario");

            migrationBuilder.RenameIndex(
                name: "IX_Usuarios_Correo",
                table: "Usuarios",
                newName: "IX_Usuarios_correo");

            migrationBuilder.RenameIndex(
                name: "IX_Usuarios_IdRol",
                table: "Usuarios",
                newName: "IX_Usuarios_id_rol");

            migrationBuilder.RenameColumn(
                name: "IdUsuario",
                table: "Sesiones",
                newName: "id_usuario");

            migrationBuilder.RenameColumn(
                name: "FechaInicio",
                table: "Sesiones",
                newName: "fecha_expiracion");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Sesiones",
                newName: "id_sesion");

            migrationBuilder.RenameIndex(
                name: "IX_Sesiones_IdUsuario",
                table: "Sesiones",
                newName: "IX_Sesiones_id_usuario");

            migrationBuilder.RenameColumn(
                name: "NombreRol",
                table: "Roles",
                newName: "nombre_rol");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Roles",
                newName: "id_rol");

            migrationBuilder.RenameColumn(
                name: "Stock",
                table: "Productos",
                newName: "stock");

            migrationBuilder.RenameColumn(
                name: "Precio",
                table: "Productos",
                newName: "precio");

            migrationBuilder.RenameColumn(
                name: "Nombre",
                table: "Productos",
                newName: "nombre");

            migrationBuilder.RenameColumn(
                name: "Descripcion",
                table: "Productos",
                newName: "descripcion");

            migrationBuilder.RenameColumn(
                name: "EsSensible",
                table: "Productos",
                newName: "es_sensible");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Productos",
                newName: "id_producto");

            migrationBuilder.RenameColumn(
                name: "Accion",
                table: "LogsAuditoria",
                newName: "accion");

            migrationBuilder.RenameColumn(
                name: "IdUsuario",
                table: "LogsAuditoria",
                newName: "id_usuario");

            migrationBuilder.RenameColumn(
                name: "Modulo",
                table: "LogsAuditoria",
                newName: "direccion_ip");

            migrationBuilder.RenameColumn(
                name: "Fecha",
                table: "LogsAuditoria",
                newName: "creado_en");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "LogsAuditoria",
                newName: "id_log");

            migrationBuilder.RenameIndex(
                name: "IX_LogsAuditoria_IdUsuario",
                table: "LogsAuditoria",
                newName: "IX_LogsAuditoria_id_usuario");

            migrationBuilder.RenameColumn(
                name: "Total",
                table: "Facturas",
                newName: "total");

            migrationBuilder.RenameColumn(
                name: "ReferenciaPago",
                table: "Facturas",
                newName: "referencia_pago");

            migrationBuilder.RenameColumn(
                name: "IdUsuario",
                table: "Facturas",
                newName: "id_usuario");

            migrationBuilder.RenameColumn(
                name: "FechaEmision",
                table: "Facturas",
                newName: "fecha_emision");

            migrationBuilder.RenameColumn(
                name: "IdTarjetaUsada",
                table: "Facturas",
                newName: "TarjetaId");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Facturas",
                newName: "id_factura");

            migrationBuilder.RenameIndex(
                name: "IX_Facturas_IdUsuario",
                table: "Facturas",
                newName: "IX_Facturas_id_usuario");

            migrationBuilder.RenameIndex(
                name: "IX_Facturas_IdTarjetaUsada",
                table: "Facturas",
                newName: "IX_Facturas_TarjetaId");

            migrationBuilder.RenameColumn(
                name: "Subtotal",
                table: "DetallesFactura",
                newName: "subtotal");

            migrationBuilder.RenameColumn(
                name: "Cantidad",
                table: "DetallesFactura",
                newName: "cantidad");

            migrationBuilder.RenameColumn(
                name: "IdProducto",
                table: "DetallesFactura",
                newName: "id_producto");

            migrationBuilder.RenameColumn(
                name: "IdFactura",
                table: "DetallesFactura",
                newName: "id_factura");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "DetallesFactura",
                newName: "id_detalle_factura");

            migrationBuilder.RenameIndex(
                name: "IX_DetallesFactura_IdProducto",
                table: "DetallesFactura",
                newName: "IX_DetallesFactura_id_producto");

            migrationBuilder.RenameIndex(
                name: "IX_DetallesFactura_IdFactura",
                table: "DetallesFactura",
                newName: "IX_DetallesFactura_id_factura");

            migrationBuilder.RenameColumn(
                name: "Descripcion",
                table: "AlertasSeguridad",
                newName: "descripcion");

            migrationBuilder.RenameColumn(
                name: "TipoAlerta",
                table: "AlertasSeguridad",
                newName: "tipo_alerta");

            migrationBuilder.RenameColumn(
                name: "IdUsuario",
                table: "AlertasSeguridad",
                newName: "id_usuario");

            migrationBuilder.RenameColumn(
                name: "Fecha",
                table: "AlertasSeguridad",
                newName: "fecha_creacion");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "AlertasSeguridad",
                newName: "id_alerta");

            migrationBuilder.RenameIndex(
                name: "IX_AlertasSeguridad_IdUsuario",
                table: "AlertasSeguridad",
                newName: "IX_AlertasSeguridad_id_usuario");

            migrationBuilder.AlterColumn<string>(
                name: "dni",
                table: "Usuarios",
                type: "character varying(20)",
                maxLength: 20,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(10)",
                oldMaxLength: 10);

            migrationBuilder.AddColumn<DateTime>(
                name: "creado_en",
                table: "Usuarios",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<bool>(
                name: "activa",
                table: "Sesiones",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "direccion_ip",
                table: "Sesiones",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "fecha_creacion",
                table: "Sesiones",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "token",
                table: "Sesiones",
                type: "character varying(255)",
                maxLength: 255,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AlterColumn<string>(
                name: "nombre_rol",
                table: "Roles",
                type: "character varying(20)",
                maxLength: 20,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(50)",
                oldMaxLength: 50);

            migrationBuilder.AlterColumn<decimal>(
                name: "precio",
                table: "Productos",
                type: "numeric(10,2)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "numeric");

            migrationBuilder.AddColumn<string>(
                name: "categoria",
                table: "Productos",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "creado_en",
                table: "Productos",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "creado_por",
                table: "Productos",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AlterColumn<string>(
                name: "accion",
                table: "LogsAuditoria",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<int>(
                name: "id_usuario",
                table: "LogsAuditoria",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddColumn<string>(
                name: "descripcion",
                table: "LogsAuditoria",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AlterColumn<decimal>(
                name: "total",
                table: "Facturas",
                type: "numeric(10,2)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "numeric");

            migrationBuilder.AlterColumn<string>(
                name: "referencia_pago",
                table: "Facturas",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AddColumn<string>(
                name: "estado_pago",
                table: "Facturas",
                type: "character varying(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "id_orden",
                table: "Facturas",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<decimal>(
                name: "iva",
                table: "Facturas",
                type: "numeric(10,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<string>(
                name: "metodo_pago",
                table: "Facturas",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<decimal>(
                name: "subtotal",
                table: "Facturas",
                type: "numeric(10,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AlterColumn<decimal>(
                name: "subtotal",
                table: "DetallesFactura",
                type: "numeric(10,2)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "numeric");

            migrationBuilder.AddColumn<decimal>(
                name: "precio_unitario",
                table: "DetallesFactura",
                type: "numeric(10,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AlterColumn<string>(
                name: "tipo_alerta",
                table: "AlertasSeguridad",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<int>(
                name: "id_usuario",
                table: "AlertasSeguridad",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddColumn<string>(
                name: "direccion_ip",
                table: "AlertasSeguridad",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "nivel_riesgo",
                table: "AlertasSeguridad",
                type: "character varying(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "resuelta",
                table: "AlertasSeguridad",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateTable(
                name: "Carrito",
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
                    table.PrimaryKey("PK_Carrito", x => x.id_carrito);
                    table.ForeignKey(
                        name: "FK_Carrito_Usuarios_id_usuario",
                        column: x => x.id_usuario,
                        principalTable: "Usuarios",
                        principalColumn: "id_usuario",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TwoFactorAuths",
                columns: table => new
                {
                    id_two_factor = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    id_usuario = table.Column<int>(type: "integer", nullable: false),
                    secret_key = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    is_activated = table.Column<bool>(type: "boolean", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    backup_codes = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TwoFactorAuths", x => x.id_two_factor);
                    table.ForeignKey(
                        name: "FK_TwoFactorAuths_Usuarios_id_usuario",
                        column: x => x.id_usuario,
                        principalTable: "Usuarios",
                        principalColumn: "id_usuario",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ItemCarrito",
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
                    table.PrimaryKey("PK_ItemCarrito", x => x.id_item_carrito);
                    table.ForeignKey(
                        name: "FK_ItemCarrito_Carrito_id_carrito",
                        column: x => x.id_carrito,
                        principalTable: "Carrito",
                        principalColumn: "id_carrito",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ItemCarrito_Productos_id_producto",
                        column: x => x.id_producto,
                        principalTable: "Productos",
                        principalColumn: "id_producto",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Orden",
                columns: table => new
                {
                    id_orden = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    id_usuario = table.Column<int>(type: "integer", nullable: false),
                    id_carrito = table.Column<int>(type: "integer", nullable: true),
                    total = table.Column<decimal>(type: "numeric(10,2)", nullable: true),
                    metodo_pago = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    estado = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    creado_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Orden", x => x.id_orden);
                    table.ForeignKey(
                        name: "FK_Orden_Carrito_id_carrito",
                        column: x => x.id_carrito,
                        principalTable: "Carrito",
                        principalColumn: "id_carrito");
                    table.ForeignKey(
                        name: "FK_Orden_Usuarios_id_usuario",
                        column: x => x.id_usuario,
                        principalTable: "Usuarios",
                        principalColumn: "id_usuario",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Productos_creado_por",
                table: "Productos",
                column: "creado_por");

            migrationBuilder.CreateIndex(
                name: "IX_Facturas_id_orden",
                table: "Facturas",
                column: "id_orden");

            migrationBuilder.CreateIndex(
                name: "IX_Carrito_id_usuario",
                table: "Carrito",
                column: "id_usuario");

            migrationBuilder.CreateIndex(
                name: "IX_ItemCarrito_id_carrito",
                table: "ItemCarrito",
                column: "id_carrito");

            migrationBuilder.CreateIndex(
                name: "IX_ItemCarrito_id_producto",
                table: "ItemCarrito",
                column: "id_producto");

            migrationBuilder.CreateIndex(
                name: "IX_Orden_id_carrito",
                table: "Orden",
                column: "id_carrito");

            migrationBuilder.CreateIndex(
                name: "IX_Orden_id_usuario",
                table: "Orden",
                column: "id_usuario");

            migrationBuilder.CreateIndex(
                name: "IX_TwoFactorAuths_id_usuario",
                table: "TwoFactorAuths",
                column: "id_usuario",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_AlertasSeguridad_Usuarios_id_usuario",
                table: "AlertasSeguridad",
                column: "id_usuario",
                principalTable: "Usuarios",
                principalColumn: "id_usuario");

            migrationBuilder.AddForeignKey(
                name: "FK_DetallesFactura_Facturas_id_factura",
                table: "DetallesFactura",
                column: "id_factura",
                principalTable: "Facturas",
                principalColumn: "id_factura",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_DetallesFactura_Productos_id_producto",
                table: "DetallesFactura",
                column: "id_producto",
                principalTable: "Productos",
                principalColumn: "id_producto",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Facturas_Orden_id_orden",
                table: "Facturas",
                column: "id_orden",
                principalTable: "Orden",
                principalColumn: "id_orden",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Facturas_Tarjetas_TarjetaId",
                table: "Facturas",
                column: "TarjetaId",
                principalTable: "Tarjetas",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Facturas_Usuarios_id_usuario",
                table: "Facturas",
                column: "id_usuario",
                principalTable: "Usuarios",
                principalColumn: "id_usuario",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_LogsAuditoria_Usuarios_id_usuario",
                table: "LogsAuditoria",
                column: "id_usuario",
                principalTable: "Usuarios",
                principalColumn: "id_usuario");

            migrationBuilder.AddForeignKey(
                name: "FK_Productos_Usuarios_creado_por",
                table: "Productos",
                column: "creado_por",
                principalTable: "Usuarios",
                principalColumn: "id_usuario",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Sesiones_Usuarios_id_usuario",
                table: "Sesiones",
                column: "id_usuario",
                principalTable: "Usuarios",
                principalColumn: "id_usuario",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Usuarios_Roles_id_rol",
                table: "Usuarios",
                column: "id_rol",
                principalTable: "Roles",
                principalColumn: "id_rol",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AlertasSeguridad_Usuarios_id_usuario",
                table: "AlertasSeguridad");

            migrationBuilder.DropForeignKey(
                name: "FK_DetallesFactura_Facturas_id_factura",
                table: "DetallesFactura");

            migrationBuilder.DropForeignKey(
                name: "FK_DetallesFactura_Productos_id_producto",
                table: "DetallesFactura");

            migrationBuilder.DropForeignKey(
                name: "FK_Facturas_Orden_id_orden",
                table: "Facturas");

            migrationBuilder.DropForeignKey(
                name: "FK_Facturas_Tarjetas_TarjetaId",
                table: "Facturas");

            migrationBuilder.DropForeignKey(
                name: "FK_Facturas_Usuarios_id_usuario",
                table: "Facturas");

            migrationBuilder.DropForeignKey(
                name: "FK_LogsAuditoria_Usuarios_id_usuario",
                table: "LogsAuditoria");

            migrationBuilder.DropForeignKey(
                name: "FK_Productos_Usuarios_creado_por",
                table: "Productos");

            migrationBuilder.DropForeignKey(
                name: "FK_Sesiones_Usuarios_id_usuario",
                table: "Sesiones");

            migrationBuilder.DropForeignKey(
                name: "FK_Usuarios_Roles_id_rol",
                table: "Usuarios");

            migrationBuilder.DropTable(
                name: "ItemCarrito");

            migrationBuilder.DropTable(
                name: "Orden");

            migrationBuilder.DropTable(
                name: "TwoFactorAuths");

            migrationBuilder.DropTable(
                name: "Carrito");

            migrationBuilder.DropIndex(
                name: "IX_Productos_creado_por",
                table: "Productos");

            migrationBuilder.DropIndex(
                name: "IX_Facturas_id_orden",
                table: "Facturas");

            migrationBuilder.DropColumn(
                name: "creado_en",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "activa",
                table: "Sesiones");

            migrationBuilder.DropColumn(
                name: "direccion_ip",
                table: "Sesiones");

            migrationBuilder.DropColumn(
                name: "fecha_creacion",
                table: "Sesiones");

            migrationBuilder.DropColumn(
                name: "token",
                table: "Sesiones");

            migrationBuilder.DropColumn(
                name: "categoria",
                table: "Productos");

            migrationBuilder.DropColumn(
                name: "creado_en",
                table: "Productos");

            migrationBuilder.DropColumn(
                name: "creado_por",
                table: "Productos");

            migrationBuilder.DropColumn(
                name: "descripcion",
                table: "LogsAuditoria");

            migrationBuilder.DropColumn(
                name: "estado_pago",
                table: "Facturas");

            migrationBuilder.DropColumn(
                name: "id_orden",
                table: "Facturas");

            migrationBuilder.DropColumn(
                name: "iva",
                table: "Facturas");

            migrationBuilder.DropColumn(
                name: "metodo_pago",
                table: "Facturas");

            migrationBuilder.DropColumn(
                name: "subtotal",
                table: "Facturas");

            migrationBuilder.DropColumn(
                name: "precio_unitario",
                table: "DetallesFactura");

            migrationBuilder.DropColumn(
                name: "direccion_ip",
                table: "AlertasSeguridad");

            migrationBuilder.DropColumn(
                name: "nivel_riesgo",
                table: "AlertasSeguridad");

            migrationBuilder.DropColumn(
                name: "resuelta",
                table: "AlertasSeguridad");

            migrationBuilder.RenameColumn(
                name: "nombre",
                table: "Usuarios",
                newName: "Nombre");

            migrationBuilder.RenameColumn(
                name: "dni",
                table: "Usuarios",
                newName: "Dni");

            migrationBuilder.RenameColumn(
                name: "correo",
                table: "Usuarios",
                newName: "Correo");

            migrationBuilder.RenameColumn(
                name: "mfa_activado",
                table: "Usuarios",
                newName: "MfaActivado");

            migrationBuilder.RenameColumn(
                name: "id_rol",
                table: "Usuarios",
                newName: "IdRol");

            migrationBuilder.RenameColumn(
                name: "password_hash",
                table: "Usuarios",
                newName: "ContrasenaHash");

            migrationBuilder.RenameColumn(
                name: "id_usuario",
                table: "Usuarios",
                newName: "Id");

            migrationBuilder.RenameIndex(
                name: "IX_Usuarios_correo",
                table: "Usuarios",
                newName: "IX_Usuarios_Correo");

            migrationBuilder.RenameIndex(
                name: "IX_Usuarios_id_rol",
                table: "Usuarios",
                newName: "IX_Usuarios_IdRol");

            migrationBuilder.RenameColumn(
                name: "id_usuario",
                table: "Sesiones",
                newName: "IdUsuario");

            migrationBuilder.RenameColumn(
                name: "fecha_expiracion",
                table: "Sesiones",
                newName: "FechaInicio");

            migrationBuilder.RenameColumn(
                name: "id_sesion",
                table: "Sesiones",
                newName: "Id");

            migrationBuilder.RenameIndex(
                name: "IX_Sesiones_id_usuario",
                table: "Sesiones",
                newName: "IX_Sesiones_IdUsuario");

            migrationBuilder.RenameColumn(
                name: "nombre_rol",
                table: "Roles",
                newName: "NombreRol");

            migrationBuilder.RenameColumn(
                name: "id_rol",
                table: "Roles",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "stock",
                table: "Productos",
                newName: "Stock");

            migrationBuilder.RenameColumn(
                name: "precio",
                table: "Productos",
                newName: "Precio");

            migrationBuilder.RenameColumn(
                name: "nombre",
                table: "Productos",
                newName: "Nombre");

            migrationBuilder.RenameColumn(
                name: "descripcion",
                table: "Productos",
                newName: "Descripcion");

            migrationBuilder.RenameColumn(
                name: "es_sensible",
                table: "Productos",
                newName: "EsSensible");

            migrationBuilder.RenameColumn(
                name: "id_producto",
                table: "Productos",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "accion",
                table: "LogsAuditoria",
                newName: "Accion");

            migrationBuilder.RenameColumn(
                name: "id_usuario",
                table: "LogsAuditoria",
                newName: "IdUsuario");

            migrationBuilder.RenameColumn(
                name: "direccion_ip",
                table: "LogsAuditoria",
                newName: "Modulo");

            migrationBuilder.RenameColumn(
                name: "creado_en",
                table: "LogsAuditoria",
                newName: "Fecha");

            migrationBuilder.RenameColumn(
                name: "id_log",
                table: "LogsAuditoria",
                newName: "Id");

            migrationBuilder.RenameIndex(
                name: "IX_LogsAuditoria_id_usuario",
                table: "LogsAuditoria",
                newName: "IX_LogsAuditoria_IdUsuario");

            migrationBuilder.RenameColumn(
                name: "total",
                table: "Facturas",
                newName: "Total");

            migrationBuilder.RenameColumn(
                name: "referencia_pago",
                table: "Facturas",
                newName: "ReferenciaPago");

            migrationBuilder.RenameColumn(
                name: "id_usuario",
                table: "Facturas",
                newName: "IdUsuario");

            migrationBuilder.RenameColumn(
                name: "fecha_emision",
                table: "Facturas",
                newName: "FechaEmision");

            migrationBuilder.RenameColumn(
                name: "TarjetaId",
                table: "Facturas",
                newName: "IdTarjetaUsada");

            migrationBuilder.RenameColumn(
                name: "id_factura",
                table: "Facturas",
                newName: "Id");

            migrationBuilder.RenameIndex(
                name: "IX_Facturas_TarjetaId",
                table: "Facturas",
                newName: "IX_Facturas_IdTarjetaUsada");

            migrationBuilder.RenameIndex(
                name: "IX_Facturas_id_usuario",
                table: "Facturas",
                newName: "IX_Facturas_IdUsuario");

            migrationBuilder.RenameColumn(
                name: "subtotal",
                table: "DetallesFactura",
                newName: "Subtotal");

            migrationBuilder.RenameColumn(
                name: "cantidad",
                table: "DetallesFactura",
                newName: "Cantidad");

            migrationBuilder.RenameColumn(
                name: "id_producto",
                table: "DetallesFactura",
                newName: "IdProducto");

            migrationBuilder.RenameColumn(
                name: "id_factura",
                table: "DetallesFactura",
                newName: "IdFactura");

            migrationBuilder.RenameColumn(
                name: "id_detalle_factura",
                table: "DetallesFactura",
                newName: "Id");

            migrationBuilder.RenameIndex(
                name: "IX_DetallesFactura_id_producto",
                table: "DetallesFactura",
                newName: "IX_DetallesFactura_IdProducto");

            migrationBuilder.RenameIndex(
                name: "IX_DetallesFactura_id_factura",
                table: "DetallesFactura",
                newName: "IX_DetallesFactura_IdFactura");

            migrationBuilder.RenameColumn(
                name: "descripcion",
                table: "AlertasSeguridad",
                newName: "Descripcion");

            migrationBuilder.RenameColumn(
                name: "tipo_alerta",
                table: "AlertasSeguridad",
                newName: "TipoAlerta");

            migrationBuilder.RenameColumn(
                name: "id_usuario",
                table: "AlertasSeguridad",
                newName: "IdUsuario");

            migrationBuilder.RenameColumn(
                name: "fecha_creacion",
                table: "AlertasSeguridad",
                newName: "Fecha");

            migrationBuilder.RenameColumn(
                name: "id_alerta",
                table: "AlertasSeguridad",
                newName: "Id");

            migrationBuilder.RenameIndex(
                name: "IX_AlertasSeguridad_id_usuario",
                table: "AlertasSeguridad",
                newName: "IX_AlertasSeguridad_IdUsuario");

            migrationBuilder.AlterColumn<string>(
                name: "Dni",
                table: "Usuarios",
                type: "character varying(10)",
                maxLength: 10,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(20)",
                oldMaxLength: 20);

            migrationBuilder.AddColumn<string>(
                name: "Ip",
                table: "Sesiones",
                type: "character varying(45)",
                maxLength: 45,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "UserAgent",
                table: "Sesiones",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AlterColumn<string>(
                name: "NombreRol",
                table: "Roles",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(20)",
                oldMaxLength: 20);

            migrationBuilder.AlterColumn<decimal>(
                name: "Precio",
                table: "Productos",
                type: "numeric",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "numeric(10,2)");

            migrationBuilder.AlterColumn<string>(
                name: "Accion",
                table: "LogsAuditoria",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(100)",
                oldMaxLength: 100);

            migrationBuilder.AlterColumn<int>(
                name: "IdUsuario",
                table: "LogsAuditoria",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "Total",
                table: "Facturas",
                type: "numeric",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "numeric(10,2)");

            migrationBuilder.AlterColumn<string>(
                name: "ReferenciaPago",
                table: "Facturas",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(100)",
                oldMaxLength: 100);

            migrationBuilder.AlterColumn<decimal>(
                name: "Subtotal",
                table: "DetallesFactura",
                type: "numeric",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "numeric(10,2)");

            migrationBuilder.AlterColumn<string>(
                name: "TipoAlerta",
                table: "AlertasSeguridad",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(100)",
                oldMaxLength: 100);

            migrationBuilder.AlterColumn<int>(
                name: "IdUsuario",
                table: "AlertasSeguridad",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "NivelSeveridad",
                table: "AlertasSeguridad",
                type: "character varying(10)",
                maxLength: 10,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddForeignKey(
                name: "FK_AlertasSeguridad_Usuarios_IdUsuario",
                table: "AlertasSeguridad",
                column: "IdUsuario",
                principalTable: "Usuarios",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_DetallesFactura_Facturas_IdFactura",
                table: "DetallesFactura",
                column: "IdFactura",
                principalTable: "Facturas",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_DetallesFactura_Productos_IdProducto",
                table: "DetallesFactura",
                column: "IdProducto",
                principalTable: "Productos",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Facturas_Tarjetas_IdTarjetaUsada",
                table: "Facturas",
                column: "IdTarjetaUsada",
                principalTable: "Tarjetas",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Facturas_Usuarios_IdUsuario",
                table: "Facturas",
                column: "IdUsuario",
                principalTable: "Usuarios",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_LogsAuditoria_Usuarios_IdUsuario",
                table: "LogsAuditoria",
                column: "IdUsuario",
                principalTable: "Usuarios",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Sesiones_Usuarios_IdUsuario",
                table: "Sesiones",
                column: "IdUsuario",
                principalTable: "Usuarios",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Usuarios_Roles_IdRol",
                table: "Usuarios",
                column: "IdRol",
                principalTable: "Roles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
