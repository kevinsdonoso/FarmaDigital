using FarmaDigitalBackend.Models;
using FarmaDigitalBackend.Repositories.Interfaces;
using FarmaDigitalBackend.Service.Interface;

namespace FarmaDigitalBackend.Service
{
    public class ProductoService : IProductoService
    {
        private readonly IProductoRepository _productoRepository;
        // private readonly ILogger<ProductoService> _logger; // Para logging en el futuro
        // private readonly IAuditService _auditService; // Para auditoría cuando esté listo

        public ProductoService(IProductoRepository productoRepository)
        {
            _productoRepository = productoRepository;
        }

       public async Task<List<Producto>> ObtenerTodosAsync()
        {
            try
            {
                var productos = await _productoRepository.GetAllAsync();
                return productos.Where(p => p.Activo).ToList(); // ← FILTRAR SOLO ACTIVOS
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener los productos", ex);
            }
        }

        public async Task<Producto?> ObtenerPorIdAsync(int id)
        {
            try
            {
                if (id <= 0)
                    throw new ArgumentException("El ID debe ser mayor a 0");

                return await _productoRepository.GetByIdAsync(id);
            }
            catch (Exception ex)
            {
                // _logger?.LogError(ex, "Error al obtener producto por ID: {Id}", id);
                throw new Exception($"Error al obtener el producto con ID {id}", ex);
            }
        }

        public async Task<Producto> CrearAsync(Producto producto)
        {
            try
            {
                // Validaciones de negocio
                ValidarProducto(producto);

                // Validaciones específicas para crear
                if (string.IsNullOrEmpty(producto.Nombre))
                    throw new ArgumentException("El nombre del producto es requerido");

                if (string.IsNullOrEmpty(producto.Categoria))
                    throw new ArgumentException("La categoría es requerida");

                // Verificar si ya existe un producto con el mismo nombre
                var productosExistentes = await _productoRepository.GetAllAsync();
                if (productosExistentes.Any(p => p.Nombre.ToLower() == producto.Nombre.ToLower()))
                    throw new ArgumentException("Ya existe un producto con ese nombre");

                var nuevoProducto = await _productoRepository.CreateAsync(producto);

                // Auditoría cuando esté lista
                // await _auditService.LogAsync(
                //     usuarioId: producto.CreadoPorId,
                //     accion: "CREAR_PRODUCTO",
                //     descripcion: $"Creado producto: {producto.Nombre}",
                //     direccionIp: "127.0.0.1" // Se debe obtener del contexto HTTP
                // );

                return nuevoProducto;
            }
            catch (Exception ex)
            {
                // _logger?.LogError(ex, "Error al crear producto: {Nombre}", producto?.Nombre);
                throw new Exception("Error al crear el producto", ex);
            }
        }

                public async Task<Producto> ActualizarAsync(Producto producto)
        {
            try
            {
                // Validaciones de negocio
                ValidarProducto(producto);
        
                if (producto.Id <= 0)
                    throw new ArgumentException("El ID del producto es requerido");
        
                // Verificar que el producto existe
                var productoExistente = await _productoRepository.GetByIdAsync(producto.Id);
                if (productoExistente == null)
                    throw new ArgumentException("Producto no encontrado");
        
                // Verificar si ya existe otro producto con el mismo nombre
                var productosExistentes = await _productoRepository.GetAllAsync();
                if (productosExistentes.Any(p => p.Nombre.ToLower() == producto.Nombre.ToLower() && p.Id != producto.Id))
                    throw new ArgumentException("Ya existe otro producto con ese nombre");
        
                // ACTUALIZAR LOS CAMPOS DEL PRODUCTO EXISTENTE
                productoExistente.Nombre = producto.Nombre;
                productoExistente.Descripcion = producto.Descripcion;
                productoExistente.Precio = producto.Precio;
                productoExistente.Stock = producto.Stock;
                productoExistente.EsSensible = producto.EsSensible;
                productoExistente.Categoria = producto.Categoria;
                productoExistente.Activo = producto.Activo;
                // NO actualizar: CreadoEn, CreadoPorId, Id
        
                // ACTUALIZAR EL PRODUCTO EXISTENTE, NO EL NUEVO
                var productoActualizado = await _productoRepository.UpdateAsync(productoExistente);
        
                return productoActualizado;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al actualizar el producto: {ex.Message}", ex);
            }
        }
        public async Task<bool> EliminarAsync(int id)
{
    try
    {
        if (id <= 0)
            throw new ArgumentException("El ID debe ser mayor a 0");

        // Obtener el producto
        var producto = await _productoRepository.GetByIdAsync(id);
        if (producto == null)
            throw new ArgumentException("Producto no encontrado");

        // Verificar si ya está inactivo
        if (!producto.Activo)
            throw new ArgumentException("El producto ya está desactivado");

        // SOLO cambiar el estado a inactivo
        producto.Activo = false;
        await _productoRepository.UpdateAsync(producto);

        return true;
    }
    catch (Exception ex)
    {
        throw new Exception($"Error al desactivar el producto: {ex.Message}", ex);
    }
}
        
        // Actualizar método para obtener solo productos activos
        
        public async Task<List<Producto>> ObtenerPorCategoriaAsync(string categoria)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(categoria))
                    throw new ArgumentException("La categoría es requerida");

                return await _productoRepository.GetByCategoriaAsync(categoria);
            }
            catch (Exception ex)
            {
                // _logger?.LogError(ex, "Error al obtener productos por categoría: {Categoria}", categoria);
                throw new Exception($"Error al obtener productos de la categoría {categoria}", ex);
            }
        }

        public async Task<List<Producto>> ObtenerProductosSensiblesAsync()
        {
            try
            {
                return await _productoRepository.GetProductosSensiblesAsync();
            }
            catch (Exception ex)
            {
                // _logger?.LogError(ex, "Error al obtener productos sensibles");
                throw new Exception("Error al obtener productos sensibles", ex);
            }
        }

        #region Métodos privados de validación

        private void ValidarProducto(Producto producto)
        {
            if (producto == null)
                throw new ArgumentNullException(nameof(producto), "El producto no puede ser nulo");

            if (string.IsNullOrWhiteSpace(producto.Nombre))
                throw new ArgumentException("El nombre del producto es requerido");

            if (producto.Nombre.Length > 100)
                throw new ArgumentException("El nombre del producto no puede exceder 100 caracteres");

            if (producto.Precio <= 0)
                throw new ArgumentException("El precio debe ser mayor a 0");

            if (producto.Precio > 9999.99m)
                throw new ArgumentException("El precio no puede exceder $9,999.99");

            if (producto.Stock < 0)
                throw new ArgumentException("El stock no puede ser negativo");

            if (string.IsNullOrWhiteSpace(producto.Categoria))
                throw new ArgumentException("La categoría es requerida");

            if (producto.Categoria.Length > 50)
                throw new ArgumentException("La categoría no puede exceder 50 caracteres");

            if (!string.IsNullOrEmpty(producto.Descripcion) && producto.Descripcion.Length > 1000)
                throw new ArgumentException("La descripción no puede exceder 1000 caracteres");

            // Validar categorías permitidas
            var categoriasPermitidas = new[]
            {
                "Analgésicos", "Antiinflamatorios", "Antibióticos", "Endocrinología",
                "Cardiología", "Vitaminas", "Cuidado Personal", "Primeros Auxilios"
            };

            if (!categoriasPermitidas.Contains(producto.Categoria))
                throw new ArgumentException($"La categoría '{producto.Categoria}' no es válida. Categorías permitidas: {string.Join(", ", categoriasPermitidas)}");
        }

        #endregion
    }
}