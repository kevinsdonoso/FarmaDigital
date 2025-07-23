using System.Text;
using FarmaDigitalBackend.DependyInjection;
using FarmaDigitalBackend.Data;
using FarmaDigitalBackend.Services;
using FarmaDigitalBackend.Services.Interfaces;
using FarmaDigitalBackend.Repositories;
using FarmaDigitalBackend.Repositories.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Npgsql;

var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration;
var connectionString = configuration.GetConnectionString("DefaultConnection");

// ✅ Clave secreta para JWT desde variable de entorno
var key = configuration["JwtSecret"] ?? throw new Exception("JWT secret missing");

/// Configuración de CORS para permitir solicitudes desde el frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
            "http://localhost:3000",
            "http://localhost:3001",
            "https://localhost:3000",
            "https://localhost:3001",
            "https://farma-digital-git-main-kevin-donosos-projects.vercel.app",
            "https://farma-digital.vercel.app"
        )
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials();
    });
});

/// Configuración de autenticación JWT.
builder.Services.AddAuthentication(x =>
{
    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(x =>
{
    x.RequireHttpsMetadata = false;
    x.SaveToken = true;
    x.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(key)),
        ValidateIssuer = false,
        ValidateAudience = false,
        ClockSkew = TimeSpan.Zero
    };
});

/// Servicio JWT singleton con la clave secreta.
builder.Services.AddSingleton<IJwtService>(provider =>
    new JwtService(key));

/// Configuración de la base de datos PostgreSQL.
builder.Services.AddDbContext<FarmaDbContext>(options =>
    options.UseNpgsql(connectionString));

builder.Services.AddHttpContextAccessor();

/// Registro de repositorios y servicios de auditoría.
builder.Services.AddScoped<ILogsAuditoriaRepository, LogsAuditoriaRepository>();
builder.Services.AddScoped<ILogAuditoriaService, LogAuditoriaService>();

/// Inyección de dependencias personalizada.
RepositoryIdentity.Inject(builder.Services);

/// Configuración global de controladores con autorización por defecto.
builder.Services.AddControllers(options =>
{
    options.Filters.Add(new Microsoft.AspNetCore.Mvc.Authorization.AuthorizeFilter());
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// ✅ Encabezados reenviados para HTTPS detrás de proxy (Railway)
app.UseForwardedHeaders(new ForwardedHeadersOptions
{
    ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
});

/// Swagger solo en entorno de desarrollo
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

/// Middleware
app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();
app.UseHttpsRedirection();

// Middleware de auditoría
app.UseMiddleware<FarmaDigitalBackend.Middleware.AuditMiddleware>();

/// Mapeo de controladores.
app.MapControllers();

/// Aplicar migraciones automáticamente al iniciar
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<FarmaDbContext>();
    dbContext.Database.Migrate();
    Console.WriteLine("Migraciones aplicadas correctamente (si había alguna pendiente).");
}

app.Run();
