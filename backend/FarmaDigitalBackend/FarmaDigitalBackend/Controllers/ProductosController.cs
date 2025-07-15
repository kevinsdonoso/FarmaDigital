using FarmaDigitalBackend.Models;
using FarmaDigitalBackend.Service.Interface;
using Microsoft.AspNetCore.Mvc;

namespace FarmaDigitalBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductosController : ControllerBase
    {
        private readonly IProductoService _productoService;

        public ProductosController(IProductoService productoService)
        {
            _productoService = productoService;
        }

        /// <summary>
        /// Obtiene todos los productos
        /// </summary>
        /// <returns>Lista de productos</returns>
        [HttpGet]
        public async Task<ActionResult<List<Producto>>> Get()
        {
            try
            {
                var productos = await _productoService.ObtenerTodosAsync();
                return Ok(productos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { 
                    message = "Error interno del servidor",
                    error = ex.Message 
                });
            }
        }

        /// <summary>
        /// Obtiene un producto por ID
        /// </summary>
        /// <param name="id">ID del producto</param>
        /// <returns>Producto encontrado</returns>
        [HttpGet("{id}")]
        public async Task<ActionResult<Producto>> Get(int id)
        {
            try
            {
                if (id <= 0)
                    return BadRequest(new { message = "ID inválido" });

                var producto = await _productoService.ObtenerPorIdAsync(id);
                
                if (producto == null)
                    return NotFound(new { message = $"Producto con ID {id} no encontrado" });

                return Ok(producto);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { 
                    message = "Error interno del servidor",
                    error = ex.Message 
                });
            }
        }

        /// <summary>
        /// Crea un nuevo producto
        /// </summary>
        /// <param name="producto">Datos del producto</param>
        /// <returns>Producto creado</returns>
        [HttpPost]
        public async Task<ActionResult<Producto>> Post([FromBody] Producto producto)
        {
            try
            {
                if (producto == null)
                    return BadRequest(new { message = "Datos del producto son requeridos" });

                var nuevoProducto = await _productoService.CrearAsync(producto);
                
                return CreatedAtAction(
                    nameof(Get), 
                    new { id = nuevoProducto.Id }, 
                    nuevoProducto
                );
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { 
                    message = "Error interno del servidor",
                    error = ex.Message 
                });
            }
        }

        /// <summary>
        /// Actualiza un producto existente
        /// </summary>
        /// <param name="id">ID del producto</param>
        /// <param name="producto">Datos actualizados del producto</param>
        /// <returns>Producto actualizado</returns>
        [HttpPut("{id}")]
        public async Task<ActionResult<Producto>> Put(int id, [FromBody] Producto producto)
        {
            try
            {
                if (id <= 0)
                    return BadRequest(new { message = "ID inválido" });

                if (producto == null)
                    return BadRequest(new { message = "Datos del producto son requeridos" });

                if (id != producto.Id)
                    return BadRequest(new { message = "El ID del parámetro no coincide con el ID del producto" });

                var productoActualizado = await _productoService.ActualizarAsync(producto);
                return Ok(productoActualizado);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { 
                    message = "Error interno del servidor",
                    error = ex.Message 
                });
            }
        }

        /// <summary>
        /// Elimina un producto
        /// </summary>
        /// <param name="id">ID del producto</param>
        /// <returns>Resultado de la operación</returns>
        [HttpDelete("{id}")]
public async Task<ActionResult> Delete(int id)
{
    try
    {
        if (id <= 0)
            return BadRequest(new { message = "ID inválido" });

        var resultado = await _productoService.EliminarAsync(id);
        
        if (!resultado)
            return NotFound(new { message = $"Producto con ID {id} no encontrado" });

        return Ok(new { 
            message = "Producto desactivado exitosamente",
            info = "El producto ya no aparecerá en los listados pero se mantiene en el sistema"
        });
    }
    catch (ArgumentException ex)
    {
        return BadRequest(new { message = ex.Message });
    }
    catch (Exception ex)
    {
        return StatusCode(500, new { 
            message = "Error interno del servidor",
            error = ex.Message 
        });
    }
}
        /// <summary>
        /// Obtiene productos por categoría
        /// </summary>
        /// <param name="categoria">Nombre de la categoría</param>
        /// <returns>Lista de productos de la categoría</returns>
        [HttpGet("categoria/{categoria}")]
        public async Task<ActionResult<List<Producto>>> GetByCategoria(string categoria)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(categoria))
                    return BadRequest(new { message = "Categoría es requerida" });

                var productos = await _productoService.ObtenerPorCategoriaAsync(categoria);
                return Ok(productos);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { 
                    message = "Error interno del servidor",
                    error = ex.Message 
                });
            }
        }

        /// <summary>
        /// Obtiene productos sensibles
        /// </summary>
        /// <returns>Lista de productos sensibles</returns>
        [HttpGet("sensibles")]
        public async Task<ActionResult<List<Producto>>> GetProductosSensibles()
        {
            try
            {
                var productos = await _productoService.ObtenerProductosSensiblesAsync();
                return Ok(productos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { 
                    message = "Error interno del servidor",
                    error = ex.Message 
                });
            }
        }
    }
}