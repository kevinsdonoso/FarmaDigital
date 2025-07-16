using FarmaDigitalBackend.Models;
using FarmaDigitalBackend.Models.Authentication;
using FarmaDigitalBackend.Services.Interfaces;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace FarmaDigitalBackend.Services  // ✅ Cambiar namespace
{
    public class JwtService : IJwtService
    {
        private readonly string _key;

        public JwtService(string key)
        {
            _key = key;
        }

        public TokenResponse GenerateToken(Usuario user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenType = "Bearer";
            var expire = DateTime.UtcNow.AddHours(10);
            var tokenKey = Encoding.ASCII.GetBytes(_key);

            var permissions = PermissionService.GetPermissionsByRole(user.Rol.NombreRol);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Claims = new Dictionary<string, object>
                {
                    { "userId", user.IdUsuario },
                    { "dni", user.Dni },
                    { "email", user.Correo },
                    { "fullname", user.Nombre },
                    { "role", user.Rol.NombreRol },
                    { "permissions", string.Join(";", permissions.Select(p => $"{p.Module}:{p.Action}:{p.Resource}")) }
                },
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.IdUsuario.ToString()),
                    new Claim(ClaimTypes.Name, user.Nombre),
                    new Claim(ClaimTypes.Email, user.Correo),
                    new Claim(ClaimTypes.Role, user.Rol.NombreRol)
                }),
                Expires = expire,
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(tokenKey),
                    SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            var userInfo = new UserInfo
            {
                UserId = user.IdUsuario,
                Nombre = user.Nombre,
                Correo = user.Correo,
                Rol = user.Rol.NombreRol,
                Permissions = permissions.Select(p => $"{p.Module}:{p.Action}:{p.Resource}").ToList()
            };

            return new TokenResponse(tokenString, expire, tokenType, userInfo);
        }

        public bool ValidateToken(string token)
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.ASCII.GetBytes(_key);
                
                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ClockSkew = TimeSpan.Zero
                }, out SecurityToken validatedToken);

                return true;
            }
            catch
            {
                return false;
            }
        }
    }
}