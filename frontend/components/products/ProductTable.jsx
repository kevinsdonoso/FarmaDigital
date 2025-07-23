'use client'
/**
 * Componente de tabla para mostrar productos con controles seguros de edición y eliminación.
 * - Sanitiza todos los datos antes de mostrarlos o procesarlos.
 * - Aplica rate limiting para prevenir spam y ataques automatizados.
 * - Valida los datos antes de editar o eliminar.
 * - El diseño es responsivo y accesible.
 *
 * Props:
 * @param {Array} productos - Lista de productos a mostrar.
 * @param {Function} onDeleteProduct - Handler para eliminar un producto.
 * @param {Function} onEditProduct - Handler para actualizar la lista tras editar.
 */

import React, { useState } from 'react';
import { Edit, Trash2, Package, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { updateProducto } from '@/lib/api';
// Seguridad: Importa función para sanitizar datos
import { sanitizeInput, checkRateLimit, validateUserInput } from '@/lib/security';

export default function ProductTable({ productos, onDeleteProduct, onEditProduct }) {
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, producto: null });
  const [editModal, setEditModal] = useState({ isOpen: false, producto: null });

  /**
  * Sanitiza los datos del producto antes de mostrar en la tabla.
  */
  const sanitizeProductForDisplay = (producto) => {
    if (!producto) return null;

    return {
      ...producto,
      idProducto: producto.idProducto || producto.id,
      nombre: sanitizeInput(producto.nombre || 'Sin nombre'),
      descripcion: sanitizeInput(producto.descripcion || 'Sin descripción'),
      categoria: sanitizeInput(producto.categoria || 'Sin categoría'),
      precio: Math.max(0, Number(producto.precio) || 0),
      stock: Math.max(0, Number(producto.stock) || 0),
      es_sensible: Boolean(producto.es_sensible || producto.esSensible)
    };
  };

  /**
   * Abre el modal de eliminación de forma segura (rate limiting y sanitización).
   */
  const handleDeleteClick = (producto) => {
    if (!checkRateLimit(`open_delete_modal_${producto.idProducto}`, 5, 30000)) {
      console.warn('Rate limit excedido para abrir modal de eliminación');
      return;
    }
    const sanitizedProduct = sanitizeProductForDisplay(producto);
    setDeleteModal({ isOpen: true, producto: sanitizedProduct });
  };

  /**
   * Abre el modal de edición de forma segura (rate limiting y sanitización).
   */
  const handleEditClick = (producto) => {
    if (!checkRateLimit(`open_edit_modal_${producto.idProducto}`, 5, 30000)) {
      console.warn('Rate limit excedido para abrir modal de edición');
      return;
    }

    const sanitizedProduct = sanitizeProductForDisplay(producto);
    setEditModal({ isOpen: true, producto: sanitizedProduct });
  };

  /**
   * Confirma la eliminación del producto validando el ID y sanitizando.
   */
  const confirmDelete = () => {
    if (deleteModal.producto && deleteModal.producto.idProducto) {
      // Validar ID antes de eliminar
      const sanitizedId = sanitizeInput(deleteModal.producto.idProducto.toString());

      if (!validateUserInput(sanitizedId, 'number')) {
        alert('ID de producto no válido para eliminación');
        return;
      }

      onDeleteProduct(sanitizedId);
      setDeleteModal({ isOpen: false, producto: null });
    }
  };

  /**
   * Guarda los cambios de edición de forma segura (rate limiting, validación y sanitización).
   */
  const handleEditSave = async (formData) => {
    if (!editModal.producto || !editModal.producto.idProducto) {
      alert('Error: Producto no válido para edición');
      return;
    }

    if (!checkRateLimit(`save_edit_${editModal.producto.idProducto}`, 3, 60000)) {
      alert('Demasiadas ediciones. Espera un momento.');
      return;
    }

    try {
      const productId = sanitizeInput(editModal.producto.idProducto.toString());

      if (!validateUserInput(productId, 'number')) {
        throw new Error('ID de producto no válido');
      }

      //Sanitizar daots del formulario
      const sanitizedFormData = {
        nombre: sanitizeInput(formData.nombre || '').trim(),
        descripcion: sanitizeInput(formData.descripcion || '').trim(),
        precio: Math.max(0, Number(formData.precio) || 0),
        stock: Math.max(0, parseInt(formData.stock) || 0),
        esSensible: Boolean(formData.esSensible),
        categoria: sanitizeInput(formData.categoria || ''),
        activo: true
      };

      // Validaciones adicionales
      if (!sanitizedFormData.nombre) {
        throw new Error('El nombre del producto es requerido');
      }

      if (!sanitizedFormData.descripcion) {
        throw new Error('La descripción del producto es requerida');
      }

      if (sanitizedFormData.precio <= 0) {
        throw new Error('El precio debe ser mayor a 0');
      }

      await updateProducto(productId, sanitizedFormData);

      setEditModal({ isOpen: false, producto: null });
      if (onEditProduct) {
        onEditProduct();
      }
    } catch (error) {
      alert('Error al actualizar producto: ' + sanitizeInput(error.message || 'Error desconocido'));
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Producto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoría
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Precio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {productos.map((producto) => {
              //agregamos los productos sanitizados 
              const productSafe = sanitizeProductForDisplay(producto);
              return (
                <tr key={productSafe.idProducto} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Package className="h-8 w-8 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {productSafe.nombre}
                        </div>
                        <div className="text-sm text-gray-500">
                          {productSafe.descripcion.length > 50
                            ? `${productSafe.descripcion.substring(0, 50)}...`
                            : productSafe.descripcion
                          }
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      {productSafe.categoria}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${productSafe.precio.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${productSafe.stock > 10 ? 'text-green-600' :
                        productSafe.stock > 0 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                      {productSafe.stock} unidades
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${productSafe.es_sensible
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                      }`}>
                      {productSafe.es_sensible ? 'Sensible' : 'Normal'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditClick(productSafe)}
                        className="flex items-center"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteClick(productSafe)}
                        className="flex items-center text-red-600 hover:text-red-800 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Eliminar
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal de Eliminación */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, producto: null })}
        title="Eliminar Producto"
        footer={
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setDeleteModal({ isOpen: false, producto: null })}
            >
              Cancelar
            </Button>
            <Button
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Eliminar
            </Button>
          </div>
        }
      >
        <div className="flex items-start space-x-3">
          <AlertTriangle className="h-6 w-6 text-red-600 mt-0.5" />
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              ¿Estás seguro?
            </h4>
            <p className="text-sm text-gray-600 mb-4">
              Esta acción no se puede deshacer. El producto{' '}
              <span className="font-semibold">{deleteModal.producto?.nombre}</span>{' '}
              será eliminado permanentemente del sistema.
            </p>
            <div className="bg-gray-100 rounded-md p-3">
              <div className="text-sm">
                <p><strong>Categoría:</strong> {deleteModal.producto?.categoria}</p>
                <p><strong>Stock actual:</strong> {deleteModal.producto?.stock} unidades</p>
                <p><strong>Precio:</strong> ${deleteModal.producto?.precio?.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* Modal de Edición */}
      <Modal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, producto: null })}
        title="Editar Producto"
      >
        <EditProductForm
          producto={editModal.producto}
          onSave={handleEditSave}
          onCancel={() => setEditModal({ isOpen: false, producto: null })}
        />
      </Modal>
    </>
  );
}

// Formulario de edicion
const EditProductForm = ({ producto, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    nombre: producto?.nombre || '',
    descripcion: producto?.descripcion || '',
    precio: producto?.precio || '',
    stock: producto?.stock || '',
    categoria: producto?.categoria || '',
    esSensible: producto?.es_sensible || false
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  //validacion del formulario 
  const validateForm = () => {
    const newErrors = {};

    // Validar nombre
    if (!validateUserInput(formData.nombre, 'text', { minLength: 2, maxLength: 100 })) {
      newErrors.nombre = 'El nombre debe tener entre 2 y 100 caracteres';
    }

    // Validar precio
    const precio = Number(formData.precio);
    if (!validateUserInput(precio, 'number', { min: 0.01, max: 999999 })) {
      newErrors.precio = 'El precio debe ser mayor a 0';
    }

    // Validar stock
    const stock = Number(formData.stock);
    if (!validateUserInput(stock, 'number', { min: 0, max: 999999 })) {
      newErrors.stock = 'El stock debe ser 0 o mayor';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * submit seguro
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      await onSave(formData);
    } catch (error) {
      console.error('Error en formulario:', error);
      alert('Error al guardar: ' + sanitizeInput(error.message || 'Error desconocido'));
    } finally {
      setLoading(false);
    }
  };

  /**
   * Maneja cambios 
   */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    // Sanitizar valor de entrada
    const sanitizedValue = type === 'checkbox' ? checked : sanitizeInput(value);
    // Límites de longitud
    if (name === 'nombre' && sanitizedValue.length > 100) return;
    if (name === 'descripcion' && sanitizedValue.length > 500) return;

    setFormData(prev => ({
      ...prev,
      [name]: sanitizedValue
    }));

    // Limpiar error cuando el usuario corrige
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
          Nombre del producto *
        </label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          disabled={loading}
          maxLength={100}
          className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent ${errors.nombre ? 'border-red-500' : 'border-gray-300'
            }`}
          required
        />
        {errors.nombre && (
          <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">{formData.nombre.length}/100 caracteres</p>
      </div>

      <div>
        <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">
          Descripción *
        </label>
        <textarea
          id="descripcion"
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          disabled={loading}
          rows={3}
          maxLength={500}
          className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent ${errors.descripcion ? 'border-red-500' : 'border-gray-300'
            }`}
          required
        />
        {errors.descripcion && (
          <p className="mt-1 text-sm text-red-600">{errors.descripcion}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">{formData.descripcion.length}/500 caracteres</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="precio" className="block text-sm font-medium text-gray-700 mb-1">
            Precio *
          </label>
          <input
            type="number"
            id="precio"
            name="precio"
            value={formData.precio}
            onChange={handleChange}
            disabled={loading}
            step="0.01"
            min="0.01"
            max="999999"
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent ${errors.precio ? 'border-red-500' : 'border-gray-300'
              }`}
            required
          />
          {errors.precio && (
            <p className="mt-1 text-sm text-red-600">{errors.precio}</p>
          )}
        </div>

        <div>
          <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
            Stock *
          </label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            disabled={loading}
            min="0"
            max="999999"
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent ${errors.stock ? 'border-red-500' : 'border-gray-300'
              }`}
            required
          />
          {errors.stock && (
            <p className="mt-1 text-sm text-red-600">{errors.stock}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-1">
          Categoría *
        </label>
        <select
          id="categoria"
          name="categoria"
          value={formData.categoria}
          onChange={handleChange}
          disabled={loading}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
          required
        >
          <option value="">Selecciona una categoría</option>
          <option value="Analgésicos">Analgésicos</option>
          <option value="Antiinflamatorios">Antiinflamatorios</option>
          <option value="Antibióticos">Antibióticos</option>
          <option value="Endocrinología">Endocrinología</option>
          <option value="Cardiología">Cardiología</option>
          <option value="Vitaminas">Vitaminas</option>
          <option value="Cuidado Personal">Cuidado Personal</option>
          <option value="Primeros Auxilios">Primeros Auxilios</option>
        </select>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="esSensible"
          name="esSensible"
          checked={formData.esSensible}
          onChange={handleChange}
          disabled={loading}
          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
        />
        <label htmlFor="esSensible" className="ml-2 block text-sm text-gray-700">
          Producto sensible
        </label>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="flex items-center"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Guardando...
            </>
          ) : (
            'Guardar Cambios'
          )}
        </Button>
      </div>
    </form>
  );
};