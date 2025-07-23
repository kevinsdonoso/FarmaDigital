using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;
using System;
using System.Security.Claims;
using FarmaDigitalBackend.Services.Interfaces;
using FarmaDigitalBackend.Models;

namespace FarmaDigitalBackend.Middleware
{
    public class AuditMiddleware
    {
        private readonly RequestDelegate _next;

        public AuditMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context, ILogAuditoriaService auditService)
        {
            // Ejecuta el controlador primero
            await _next(context);

            // Extraer datos del token JWT después de la ejecución
            var user = context.User;
            var nombre = user.FindFirst("nombre")?.Value ?? user.Identity?.Name;
            var correo = user.FindFirst(ClaimTypes.Email)?.Value ?? user.FindFirst("email")?.Value;
            var rol = user.FindFirst(ClaimTypes.Role)?.Value ?? user.FindFirst("role")?.Value;
            var idUsuarioStr = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            int? idUsuario = null;
            if (int.TryParse(idUsuarioStr, out var idParsed))
                idUsuario = idParsed;

            string ip = context.Request.Headers["X-Forwarded-For"].FirstOrDefault()
                ?? context.Request.Headers["X-Real-IP"].FirstOrDefault()
                ?? (context.Connection.RemoteIpAddress?.ToString() == "::1" ? "127.0.0.1" : context.Connection.RemoteIpAddress?.ToString());

            var accionPersonalizada = context.Items["AuditAccion"] as string;
            var descripcionPersonalizada = context.Items["AuditDescripcion"] as string;

            var accion = !string.IsNullOrEmpty(accionPersonalizada)
                ? accionPersonalizada
                : context.Request.Method + " " + context.Request.Path;
            var descripcion = !string.IsNullOrEmpty(descripcionPersonalizada)
                ? descripcionPersonalizada
                : $"Solicitud a {accion}";

     
            var fecha = DateTime.UtcNow;

            
            if (user?.Identity?.IsAuthenticated == true &&
                (context.Request.Method == "POST" || context.Request.Method == "PUT" || context.Request.Method == "DELETE"))
            {
           
                // Usar 'ip' en el registro de auditoría
                await auditService.RegistrarAsync(idUsuario, nombre, correo, rol, accion, descripcion, ip, fecha);
            }
        }
    }
}
