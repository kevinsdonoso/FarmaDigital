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

        public AuthService(IUsuarioRepository userRepository, ITwoFactorRepository twoFactorRepository,
                          IJwtService jwtService, ITwoFactorService twoFactorService, ILogAuditoriaService logAuditoriaService, IUserContextService userContextService)
        {
            _userRepository = userRepository;
            _twoFactorRepository = twoFactorRepository;
            _jwtService = jwtService;
            _twoFactorService = twoFactorService;
            _logService = logAuditoriaService;
            _userContextService = userContextService;
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

    var ip = _userContextService.GetClientIp(); 
    await _logService.RegistrarAsync(
        user.IdUsuario,
        "registro",
        $"Registro exitoso de usuario: {user.Nombre} ({user.Correo})",
        ip
    );

    return new OkObjectResult(new { success = true });
}

        public async Task<IActionResult> LoginUser(UserCredentials credentials)
        {
            var user = await _userRepository.GetUserByDniOrEmail(credentials.Username);
            if (user == null || !BCrypt.Net.BCrypt.Verify(credentials.Password, user.PasswordHash))
            {
                var saip = _userContextService.GetClientIp();
                await _logService.RegistrarAsync(
                    null,
                    "login_fallido",
                    $"Intento fallido con usuario '{credentials.Username}'",
                    saip
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
                var dosfaInvalidoip = _userContextService.GetClientIp();
                await _logService.RegistrarAsync(
                    user.IdUsuario,
                    "codigo_2fa_invalido",
                    $"Intento fallido: código 2FA inválido para {user.Correo}",
                    dosfaInvalidoip
                );

                return new UnauthorizedObjectResult(new { error = "Código 2FA inválido" });
            }


            var token = _jwtService.GenerateToken(user);

            var ip = _userContextService.GetClientIp(); // asegúrate de tener acceso al contexto

            await _logService.RegistrarAsync(
                user.IdUsuario,
                "login_exitoso",
                $"Inicio de sesión exitoso para {user.Nombre}",
                ip
            );
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
            // Si no envió código, devolver QR
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

            // Si envió código, activar 2FA y hacer login
            var twoFactor = await _twoFactorRepository.GetByUserIdAsync(user.IdUsuario);
            var isValid = await _twoFactorService.ValidateCode(twoFactor.SecretKey, credentials.TwoFactorCode);
            
            if (!isValid)
            {
                var dosfaInvalidoip = _userContextService.GetClientIp();
                await _logService.RegistrarAsync(
                    user.IdUsuario,
                    "codigo_2fa_invalido",
                    $"Intento fallido: código 2FA inválido para {user.Correo}",
                    dosfaInvalidoip
                );

                return new UnauthorizedObjectResult(new { error = "Código 2FA inválido" });
            }

            // Activar 2FA
            user.MfaActivado = true;
            await _userRepository.UpdateUser(user);

            twoFactor.IsActivated = true;
            await _twoFactorRepository.Update(twoFactor);

            var ip = _userContextService.GetClientIp();

            await _logService.RegistrarAsync(
                user.IdUsuario,
                "2fa_activado_despues_de_registro",
                $"Usuario {user.Correo} activó 2FA por primera vez",
                ip
            );
            await _logService.RegistrarAsync(
                user.IdUsuario,
                "primer_login_exitoso",
                $"Primer inicio de sesión exitoso para {user.Nombre}",
                ip
            );

            // Generar token
            var token = _jwtService.GenerateToken(user);
            return new OkObjectResult(new {
                access_token = token.AccessToken
            });
        }
    }
}