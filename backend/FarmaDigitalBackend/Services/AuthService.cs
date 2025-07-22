using FarmaDigitalBackend.Models;
using FarmaDigitalBackend.Models.Authentication;
using FarmaDigitalBackend.Repositories.Interfaces;
using FarmaDigitalBackend.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using BCrypt.Net;

namespace FarmaDigitalBackend.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUsuarioRepository _userRepository;
        private readonly ITwoFactorRepository _twoFactorRepository;
        private readonly IJwtService _jwtService;
        private readonly ITwoFactorService _twoFactorService;
        private readonly ILogAuditoriaService _logService;
        private readonly IUserContextService _userContextService;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public AuthService(IUsuarioRepository userRepository, ITwoFactorRepository twoFactorRepository,
                          IJwtService jwtService, ITwoFactorService twoFactorService, ILogAuditoriaService logAuditoriaService, IUserContextService userContextService,
                          IHttpContextAccessor httpContextAccessor)
        {
            _userRepository = userRepository;
            _twoFactorRepository = twoFactorRepository;
            _jwtService = jwtService;
            _twoFactorService = twoFactorService;
            _logService = logAuditoriaService;
            _userContextService = userContextService;
            _httpContextAccessor = httpContextAccessor;
        }

public async Task<IActionResult> RegisterUser(UserRegistration registration)
{
    if (await _userRepository.DniExists(registration.Dni))
        return new BadRequestObjectResult(new { error = "DNI ya registrado" });

    if (await _userRepository.EmailExists(registration.Correo))
        return new BadRequestObjectResult(new { error = "Email ya registrado" });

    var user = new Usuario
    {
        Dni = registration.Dni,
        Nombre = registration.Nombre,
        Correo = registration.Correo,
        PasswordHash = BCrypt.Net.BCrypt.HashPassword(registration.Password),
        IdRol = registration.IdRol,
        MfaActivado = false
    };

    await _userRepository.CreateUser(user);

    return new OkObjectResult(new { success = true });
}

        public async Task<IActionResult> LoginUser(UserCredentials credentials)
        {
            var user = await _userRepository.GetUserByDniOrEmail(credentials.Username);
            if (user == null || !BCrypt.Net.BCrypt.Verify(credentials.Password, user.PasswordHash))
            {
            var ip = _userContextService.GetClientIp();
            await _logService.RegistrarAsync(
                idUsuario: null,
                nombre: credentials.Username, 
                correo: credentials.Username, 
                rol: "desconocido",           
                accion: "intento_login_fallido",
                descripcion: $"Intento fallido de login con usuario '{credentials.Username}'",
                ip: ip,
                fecha: DateTime.UtcNow
            );
                return new UnauthorizedObjectResult(new { error = "Credenciales inválidas" });
            }
                
            if (!user.MfaActivado)
            {
                return await HandleFirstLogin(user, credentials);
            }

            if (string.IsNullOrEmpty(credentials.TwoFactorCode))
                return new BadRequestObjectResult(new { requires2FA = true });

            var twoFactor = await _twoFactorRepository.GetByUserIdAsync(user.IdUsuario);
            var isValid = await _twoFactorService.ValidateCode(twoFactor.SecretKey, credentials.TwoFactorCode);
            
            if (!isValid)
            {
                // Registrar log manual para código 2FA inválido
                var ip = _userContextService.GetClientIp();
                await _logService.RegistrarAsync(
                    idUsuario: user.IdUsuario,
                    nombre: user.Nombre,
                    correo: user.Correo,
                    rol: "desconocido",
                    accion: "codigo_2fa_invalido",
                    descripcion: $"Código 2FA inválido para el usuario '{user.Correo}'",
                    ip: ip,
                    fecha: DateTime.UtcNow
                );
                // ...también setear para el middleware si el usuario está autenticado
                _httpContextAccessor.HttpContext.Items["AuditAccion"] = "codigo_2fa_invalido";
                _httpContextAccessor.HttpContext.Items["AuditDescripcion"] = $"Código 2FA inválido para el usuario '{user.Correo}'";
                return new UnauthorizedObjectResult(new { error = "Código 2FA inválido" });
            }


            var token = _jwtService.GenerateToken(user);

            _httpContextAccessor.HttpContext.Items["AuditAccion"] = "login_exitoso";
            _httpContextAccessor.HttpContext.Items["AuditDescripcion"] = "Login exitoso para el usuario ...";

            return new OkObjectResult(new
            {
                access_token = token.AccessToken,
                token_type = token.TokenType,
                expires_in = token.ExpiresIn,
                user_info = token.UserInfo
            });
        }

        private async Task<IActionResult> HandleFirstLogin(Usuario user, UserCredentials credentials)
        {
            if (string.IsNullOrEmpty(credentials.TwoFactorCode))
            {
                var secretKey = await _twoFactorService.GenerateSecretKey();
                var qrCode = await _twoFactorService.GenerateQrCode(user.Correo, secretKey);

                var existingTwoFactor = await _twoFactorRepository.GetByUserIdAsync(user.IdUsuario);
                if (existingTwoFactor != null)
                {
                    existingTwoFactor.SecretKey = secretKey;
                    await _twoFactorRepository.Update(existingTwoFactor);
                }
                else
                {
                    await _twoFactorRepository.Create(new TwoFactorAuth
                    {
                        IdUsuario = user.IdUsuario,
                        SecretKey = secretKey,
                        IsActivated = false
                    });
                }

                return new OkObjectResult(new {
                    requires2FA = true,
                    qrCode = qrCode
                });
            }

            var twoFactor = await _twoFactorRepository.GetByUserIdAsync(user.IdUsuario);
            var isValid = await _twoFactorService.ValidateCode(twoFactor.SecretKey, credentials.TwoFactorCode);
            
            if (!isValid)
            {
              
                var ip = _userContextService.GetClientIp();
                await _logService.RegistrarAsync(
                    idUsuario: user.IdUsuario,
                    nombre: user.Nombre,
                    correo: user.Correo,
                    rol: "desconocido",
                    accion: "codigo_2fa_invalido",
                    descripcion: $"Código 2FA inválido para el usuario '{user.Correo}'",
                    ip: ip,
                    fecha: DateTime.UtcNow
                );
                _httpContextAccessor.HttpContext.Items["AuditAccion"] = "codigo_2fa_invalido";
                _httpContextAccessor.HttpContext.Items["AuditDescripcion"] = $"Código 2FA inválido para el usuario '{user.Correo}'";
                return new UnauthorizedObjectResult(new { error = "Código 2FA inválido" });
            }


            user.MfaActivado = true;
            await _userRepository.UpdateUser(user);

            twoFactor.IsActivated = true;
            await _twoFactorRepository.Update(twoFactor);

            _httpContextAccessor.HttpContext.Items["AuditAccion"] = "primer_login_exitoso";
            _httpContextAccessor.HttpContext.Items["AuditDescripcion"] = "Primer login exitoso y activación de 2FA para el usuario ...";


            // Generar token
            var token = _jwtService.GenerateToken(user);
            return new OkObjectResult(new {
                access_token = token.AccessToken
            });
        }
    }
}