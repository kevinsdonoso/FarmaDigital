using FarmaDigitalBackend.Models;
using FarmaDigitalBackend.Models.DTOs;
using FarmaDigitalBackend.Repositories.Interfaces;
using FarmaDigitalBackend.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Text.RegularExpressions;

namespace FarmaDigitalBackend.Services
{
    public class TarjetaService : ITarjetaService
    {
        private readonly ITarjetaRepository _tarjetaRepository;
        private readonly IUserContextService _userContextService;
        private readonly ITwoFactorRepository _twoFactorRepository;
        private readonly ITwoFactorService _twoFactorService;

        public TarjetaService(ITarjetaRepository tarjetaRepository, IUserContextService userContextService, ITwoFactorRepository twoFactorRepository, ITwoFactorService twoFactorService)
        {
            _tarjetaRepository = tarjetaRepository;
            _userContextService = userContextService;
            _twoFactorRepository = twoFactorRepository;
            _twoFactorService = twoFactorService;
        }

        public async Task<IActionResult> GetTarjetasUsuarioAsync()
        {
            try
            {
                var userId = _userContextService.GetCurrentUserId();
                var tarjetas = await _tarjetaRepository.GetTarjetasByUsuarioAsync(userId);

                var tarjetasDto = tarjetas.Select(t => new TarjetaResponseDto
                {
                    IdTarjeta = t.IdTarjeta,
                    UltimosDigitos = t.UltimosDigitos,
                    TipoTarjeta = t.TipoTarjeta,
                    FechaExpiracion = t.FechaExpiracion,
                    NombreTitular = t.NombreTitular,
                    EsPrincipal = t.EsPrincipal,
                    Activa = t.Activa
                }).ToList();

                return new OkObjectResult(new { success = true, data = tarjetasDto });
            }
            catch (UnauthorizedAccessException ex)
            {
                return new UnauthorizedObjectResult(new { success = false, message = ex.Message });
            }
            catch (Exception)
            {
                return new ObjectResult(new { success = false, message = "Error interno del servidor" })
                {
                    StatusCode = 500
                };
            }
        }

        public async Task<IActionResult> GuardarTarjetaAsync(TarjetaDto tarjetaDto)
        {
            try
            {
                var userId = _userContextService.GetCurrentUserId();
                var twoFactor = await _twoFactorRepository.GetByUserIdAsync(userId);
                if (twoFactor == null || string.IsNullOrEmpty(twoFactor.SecretKey))
                    return new BadRequestObjectResult(new { success = false, message = "No se encontró configuración de doble factor" });

                var twoFactorResult = await _twoFactorService.ValidateCode(twoFactor.SecretKey, tarjetaDto.Codigo2FA);
                if (!twoFactorResult)
                    return new BadRequestObjectResult(new { success = false, message = "Código de doble factor inválido" });

                // Validar tarjeta
                var validacionResult = ValidarTarjeta(tarjetaDto);
                if (validacionResult != null)
                    return validacionResult;

                var tarjeta = new Tarjeta
                {
                    IdUsuario = userId,
                    UltimosDigitos = tarjetaDto.NumeroTarjeta.Substring(12),
                    NumeroEncriptado = EncryptionService.Encrypt(tarjetaDto.NumeroTarjeta),
                    TipoTarjeta = DetectarTipoTarjeta(tarjetaDto.NumeroTarjeta),
                    FechaExpiracion = tarjetaDto.FechaExpiracion,
                    NombreTitular = tarjetaDto.NombreTitular.Trim().ToUpper(),
                    EsPrincipal = tarjetaDto.EsPrincipal
                };

                var tarjetaGuardada = await _tarjetaRepository.CreateTarjetaAsync(tarjeta);

                var responseDto = new TarjetaResponseDto
                {
                    IdTarjeta = tarjetaGuardada.IdTarjeta,
                    UltimosDigitos = tarjetaGuardada.UltimosDigitos,
                    TipoTarjeta = tarjetaGuardada.TipoTarjeta,
                    FechaExpiracion = tarjetaGuardada.FechaExpiracion,
                    NombreTitular = tarjetaGuardada.NombreTitular,
                    EsPrincipal = tarjetaGuardada.EsPrincipal,
                    Activa = tarjetaGuardada.Activa
                };

                return new OkObjectResult(new { success = true, data = responseDto, message = "Tarjeta guardada exitosamente" });
            }
            catch (UnauthorizedAccessException ex)
            {
                return new UnauthorizedObjectResult(new { success = false, message = ex.Message });
            }
            catch (Exception)
            {
                return new ObjectResult(new { success = false, message = "Error interno del servidor" })
                {
                    StatusCode = 500
                };
            }
        }

        public async Task<IActionResult> EliminarTarjetaAsync(int idTarjeta)
        {
            try
            {
                var userId = _userContextService.GetCurrentUserId();
                var eliminada = await _tarjetaRepository.DeleteTarjetaAsync(idTarjeta, userId);

                if (!eliminada)
                {
                    return new NotFoundObjectResult(new { success = false, message = "Tarjeta no encontrada" });
                }

                return new OkObjectResult(new { success = true, message = "Tarjeta eliminada exitosamente" });
            }
            catch (UnauthorizedAccessException ex)
            {
                return new UnauthorizedObjectResult(new { success = false, message = ex.Message });
            }
            catch (Exception)
            {
                return new ObjectResult(new { success = false, message = "Error interno del servidor" })
                {
                    StatusCode = 500
                };
            }
        }

        public async Task<IActionResult> ValidarTarjetaExistenteAsync(int idTarjeta, string cvv)
        {
            try
            {
                var userId = _userContextService.GetCurrentUserId();
                var tarjeta = await _tarjetaRepository.GetTarjetaByIdAsync(idTarjeta, userId);

                if (tarjeta == null)
                {
                    return new BadRequestObjectResult(new { success = false, message = "Tarjeta no encontrada" });
                }

                if (!ValidarCVV(cvv))
                {
                    return new BadRequestObjectResult(new { success = false, message = "CVV inválido" });
                }

                return new OkObjectResult(new { success = true, message = "Tarjeta validada correctamente" });
            }
            catch (UnauthorizedAccessException ex)
            {
                return new UnauthorizedObjectResult(new { success = false, message = ex.Message });
            }
            catch (Exception)
            {
                return new ObjectResult(new { success = false, message = "Error interno del servidor" })
                {
                    StatusCode = 500
                };
            }
        }

        private IActionResult? ValidarTarjeta(TarjetaDto tarjeta)
        {
            // Validar número de tarjeta (Algoritmo de Luhn)
            if (!ValidarNumeroTarjeta(tarjeta.NumeroTarjeta))
                return new BadRequestObjectResult(new { success = false, message = "Número de tarjeta inválido" });

            // Validar fecha de expiración
            if (!ValidarFechaExpiracion(tarjeta.FechaExpiracion))
                return new BadRequestObjectResult(new { success = false, message = "Fecha de expiración inválida" });

            // Validar CVV
            if (!ValidarCVV(tarjeta.CVV))
                return new BadRequestObjectResult(new { success = false, message = "CVV inválido" });

            // Validar nombre
            if (string.IsNullOrWhiteSpace(tarjeta.NombreTitular))
                return new BadRequestObjectResult(new { success = false, message = "Nombre del titular es requerido" });

            return null; // Todo válido
        }

        private bool ValidarNumeroTarjeta(string numero)
        {
            if (string.IsNullOrWhiteSpace(numero) || numero.Length != 16)
                return false;

            // Algoritmo de Luhn
            int suma = 0;
            bool alternar = false;

            for (int i = numero.Length - 1; i >= 0; i--)
            {
                if (!char.IsDigit(numero[i]))
                    return false;

                int n = int.Parse(numero[i].ToString());

                if (alternar)
                {
                    n *= 2;
                    if (n > 9)
                        n = (n % 10) + 1;
                }

                suma += n;
                alternar = !alternar;
            }

            return (suma % 10) == 0;
        }

        private bool ValidarFechaExpiracion(string fecha)
        {
            if (!Regex.IsMatch(fecha, @"^(0[1-9]|1[0-2])\/\d{4}$"))
                return false;

            var partes = fecha.Split('/');
            var mes = int.Parse(partes[0]);
            var año = int.Parse(partes[1]);

            var fechaExpiracion = new DateTime(año, mes, DateTime.DaysInMonth(año, mes));
            return fechaExpiracion >= DateTime.Now;
        }

        private bool ValidarCVV(string cvv)
        {
            return !string.IsNullOrWhiteSpace(cvv) && 
                   cvv.Length == 3 && 
                   cvv.All(char.IsDigit);
        }

        private string DetectarTipoTarjeta(string numero)
        {
            if (numero.StartsWith("4"))
                return "Visa";
            if (numero.StartsWith("5") || numero.StartsWith("2"))
                return "MasterCard";
            if (numero.StartsWith("3"))
                return "American Express";
            
            return "Desconocida";
        }
    }
}