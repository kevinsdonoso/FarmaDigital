using FarmaDigitalBackend.Data;
using FarmaDigitalBackend.DependyInjection;
using FarmaDigitalBackend.Repositories;
using FarmaDigitalBackend.Repositories.Interfaces;
using FarmaDigitalBackend.Service;
using FarmaDigitalBackend.Service.Interface;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Configuración de base de datos PostgreSQL
builder.Services.AddDbContext<FarmaDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Configuración de JWT (si la necesitas)
var jwtKey = builder.Configuration["JwtSettings:Key"] ?? "tu-clave-secreta-muy-larga-y-segura-aqui";
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };
    });

// Inyección de dependencias
RepositoryInjection.Inject(builder.Services);

// Servicios necesarios
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS para permitir cualquier origen (útil para desarrollo y testing)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// --------------------
// CAMBIO CLAVE AQUÍ:
// En vez de limitar Swagger y CORS solo a Development,
// los habilitamos siempre para poder usar Swagger incluso en Docker u otros entornos.
// Esto es importante porque normalmente el entorno en Docker no es "Development"
// y si no habilitas Swagger fuera del if, no podrás acceder a la UI.
// --------------------

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "FarmaDigital API V1");
    // c.RoutePrefix = string.Empty; // Si quieres que swagger esté en la raíz "/"
});

app.UseCors("AllowAll");

// Redirigir raíz "/" a Swagger UI para facilidad de acceso
app.MapGet("/", () => Results.Redirect("/swagger"));

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
