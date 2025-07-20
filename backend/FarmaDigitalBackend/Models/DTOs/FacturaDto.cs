namespace FarmaDigitalBackend.Models.DTOs
{
    public class FacturaDetalleDto
    {
        public int IdFactura { get; set; }
        public string NumeroFactura { get; set; } = string.Empty;
        public DateTime FechaEmision { get; set; }
        public string NombreCliente { get; set; } = string.Empty;
        public string EmailCliente { get; set; } = string.Empty;
        public decimal Subtotal { get; set; }
        public decimal Impuestos { get; set; }
        public decimal Total { get; set; }
        public string Estado { get; set; } = string.Empty;
        public List<FacturaItemDto> Items { get; set; } = new();
    }

    public class FacturaItemDto
    {
        public string NombreProducto { get; set; } = string.Empty;
        public int Cantidad { get; set; }
        public decimal PrecioUnitario { get; set; }
        public decimal Subtotal { get; set; }
    }

    public class FacturaResumenDto
    {
        public int IdFactura { get; set; }
        public string NumeroFactura { get; set; } = string.Empty;
        public DateTime FechaEmision { get; set; }
        public decimal Total { get; set; }
        public string Estado { get; set; } = string.Empty;
    }
}