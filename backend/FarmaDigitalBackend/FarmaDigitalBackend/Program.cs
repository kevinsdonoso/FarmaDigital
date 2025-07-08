using FarmaDigitalBackend.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// 📌 Cargar configuración por entorno (importante para Docker)
builder.Configuration
    .SetBasePath(Directory.GetCurrentDirectory())
    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
    .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: true)
    .AddEnvironmentVariables();

// ➕ Servicio de conexión a PostgreSQL
builder.Services.AddDbContext<FarmaDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// ➕ Controladores con vistas (para MVC) + API REST
builder.Services.AddControllersWithViews();
builder.Services.AddControllers(); // Esto permite usar [ApiController]

// ➕ Swagger para testeo de endpoints
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ⚠️ Servicios de seguridad opcionales (AuthService, JWT, etc.)
// ❌ Eliminar línea de configuración distribuida
// try { builder.AddServiceDefaults(); } catch { }

var app = builder.Build();

// 🌐 Swagger solo en desarrollo
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthentication(); // ← solo si implementas JWT o Identity
app.UseAuthorization();

// 👉 Rutas MVC por defecto
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

// 👉 Rutas para API REST
app.MapControllers();

// ❌ Eliminar línea que no compila
// try { app.MapDefaultEndpoints(); } catch { }

app.Run();
