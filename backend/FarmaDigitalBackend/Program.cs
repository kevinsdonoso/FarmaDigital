using System.Text;
using FarmaDigitalBackend.DependyInjection;
using FarmaDigitalBackend.Data;
using FarmaDigitalBackend.Services;
using FarmaDigitalBackend.Services.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Npgsql;
using FarmaDigitalBackend.Repositories;
using FarmaDigitalBackend.Repositories.Interfaces;

var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration;

var key = "FarmaDigital-JWT-Secret-Key-2024-Very-Long-And-Secure-Key-For-Production";

// ✅ Cargar y mostrar cadena de conexión
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
Console.WriteLine($"🌍 Entorno: {builder.Environment.EnvironmentName}");
Console.WriteLine($"🔗 Cadena de conexión: {connectionString}");

// ✅ Verificar conexión a la base de datos
try
{
    using var testConnection = new NpgsqlConnection(connectionString);
    await testConnection.OpenAsync();
    Console.WriteLine("✅ Conexión a la base de datos exitosa.");
    await testConnection.CloseAsync();
}
catch (Exception ex)
{
    Console.WriteLine($"❌ Error al conectar con la base de datos: {ex.Message}");
    throw;
}

// ✅ CORS (incluye Vercel)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
            "http://localhost:3000", "http://localhost:3001",
            "https://localhost:3000", "https://localhost:3001",
            "https://farma-digital.vercel.app"
        )
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials();
    });
});

// ✅ JWT
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

builder.Services.AddSingleton<IJwtService>(provider => new JwtService(key));

// ✅ Base de datos
builder.Services.AddDbContext<FarmaDbContext>(options =>
    options.UseNpgsql(connectionString));

builder.Services.AddHttpContextAccessor();

// REGISTRAR REPOSITORIO Y SERVICIO DE AUDITORÍA
builder.Services.AddScoped<ILogsAuditoriaRepository, LogsAuditoriaRepository>();
builder.Services.AddScoped<ILogAuditoriaService, LogAuditoriaService>();

// ✅ Inyección de dependencias
RepositoryIdentity.Inject(builder.Services);

// ✅ Controladores protegidos por defecto
builder.Services.AddControllers(options =>
{
    options.Filters.Add(new Microsoft.AspNetCore.Mvc.Authorization.AuthorizeFilter());
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// ✅ Swagger solo en desarrollo
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseSwagger();
app.UseSwaggerUI();

// ✅ Middleware
app.UseCors("AllowFrontend");
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// ✅ Aplicar migraciones automáticas al iniciar
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<FarmaDbContext>();
    dbContext.Database.Migrate();
}

app.Run();