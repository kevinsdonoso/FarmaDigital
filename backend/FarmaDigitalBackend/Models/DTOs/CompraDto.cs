using System.ComponentModel.DataAnnotations;

namespace FarmaDigitalBackend.Models.DTOs
{
    public class ItemCompraDto
    {
        [Required]
        public int IdProducto { get; set; }

        [Required]
        [Range(1, int.MaxValue)]
        public int Cantidad { get; set; }
    }

    public class CompraDto
    {
        public List<ItemCompraDto> Productos { get; set; } = new();

        public string MetodoPago { get; set; } = ""; // "nueva_tarjeta" o "tarjeta_existente"

        public TarjetaDto? NuevaTarjeta { get; set; }

        public bool GuardarTarjeta { get; set; }

        public int? IdTarjeta { get; set; }

        public string? Codigo2FA { get; set; } // Nuevo: código de doble factor
    }

    public class CompraResponseDto
    {
        public int IdOrden { get; set; }
        public int IdFactura { get; set; }
        public string NumeroFactura { get; set; } = string.Empty;
        public decimal Total { get; set; }
        public string Estado { get; set; } = string.Empty;
        public DateTime FechaCompra { get; set; }
        public string Mensaje { get; set; } = string.Empty;
    }
}