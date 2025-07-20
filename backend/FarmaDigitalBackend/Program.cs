using System.Text;
using FarmaDigitalBackend.DependyInjection;
using FarmaDigitalBackend.Data;
using FarmaDigitalBackend.Services;
using FarmaDigitalBackend.Services.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Npgsql;

var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration;

// ✅ Carga la cadena de conexión desde configuración (entorno o appsettings)
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

Console.WriteLine($"🌐 Entorno ASPNETCORE_ENVIRONMENT: {builder.Environment.EnvironmentName}");
Console.WriteLine($"🔗 Cadena de conexión cargada: {connectionString}");

// ✅ Verificar conexión a PostgreSQL antes de continuar
try
{
    using var testConnection = new NpgsqlConnection(connectionString);
    await testConnection.OpenAsync();
    Console.WriteLine("✅ Conexión a la base de datos establecida exitosamente.");
    await testConnection.CloseAsync();
}
catch (Exception ex)
{
    Console.WriteLine($"❌ Error al conectar con la base de datos: {ex.Message}");
    throw;
}

var key = "FarmaDigital-JWT-Secret-Key-2024-Very-Long-And-Secure-Key-For-Production";

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://localhost:3001", "https://localhost:3000", "https://localhost:3001")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// JWT Authentication
builder.Services.AddAuthentication(x =>
{
    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(x =>
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

builder.Services.AddSingleton<IJwtService>(provider =>
    new JwtService(key));

// DB Context
builder.Services.AddDbContext<FarmaDbContext>(options =>
    options.UseNpgsql(connectionString));

// Dependency Injection
RepositoryIdentity.Inject(builder.Services);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// ✅ Habilita Swagger SIEMPRE
app.UseSwagger();
app.UseSwaggerUI();

app.UseCors("AllowFrontend");

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// ✅ Ejecutar migraciones automáticamente
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<FarmaDbContext>();
    dbContext.Database.Migrate();
}

app.Run();
