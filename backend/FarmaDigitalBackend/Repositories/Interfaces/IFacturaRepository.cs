using FarmaDigitalBackend.Models;

namespace FarmaDigitalBackend.Repositories.Interfaces
{
    public interface IFacturaRepository
    {
        Task<Factura> CreateFacturaAsync(Factura factura);
        Task<Factura?> GetFacturaByIdAsync(int idFactura);
        Task<Factura?> GetFacturaByOrdenIdAsync(int idOrden);
        Task<List<Factura>> GetFacturasByUsuarioAsync(int idUsuario);
        Task<DetalleFactura> CreateDetalleFacturaAsync(DetalleFactura detalle);
        Task<List<DetalleFactura>> GetDetallesByFacturaAsync(int idFactura);
        Task<List<Factura>> GetAllFacturasAsync();
    }
}