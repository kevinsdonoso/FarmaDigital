'use client'
import React, { useState } from 'react';
import { Edit, Trash2, Package, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { updateProducto } from '@/lib/api';

export default function ProductTable({ productos, onDeleteProduct, onEditProduct }) {
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, producto: null });
  const [editModal, setEditModal] = useState({ isOpen: false, producto: null });

  const handleDeleteClick = (producto) => {
    setDeleteModal({ isOpen: true, producto });
  };

  const handleEditClick = (producto) => {
    setEditModal({ isOpen: true, producto });
  };

  const confirmDelete = () => {
    if (deleteModal.producto) {
      // ✅ CAMBIAR A idProducto
      onDeleteProduct(deleteModal.producto.idProducto);
      setDeleteModal({ isOpen: false, producto: null });
    }
  };

  const handleEditSave = async (formData) => {
    if (editModal.producto) {
      try {
        // ✅ CAMBIAR A idProducto
        const productId = editModal.producto.idProducto;
        
        console.log('🔄 Editando producto ID:', productId, 'con datos:', formData);
        
        const apiData = {
          nombre: formData.nombre,
          descripcion: formData.descripcion,
          precio: parseFloat(formData.precio),
          stock: parseInt(formData.stock),
          esSensible: formData.esSensible, // Ya coincide con la API
          categoria: formData.categoria,
          activo: true
        };

        await updateProducto(productId, apiData);
        
        console.log('✅ Producto actualizado exitosamente');
        
        setEditModal({ isOpen: false, producto: null });
        if (onEditProduct) {
          onEditProduct();
        }
      } catch (error) {
        console.error('❌ Error al actualizar producto:', error);
        alert('Error al actualizar producto: ' + error.message);
      }
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
            {productos.map((producto) => (
              // ✅ CAMBIAR KEY A idProducto
              <tr key={producto.idProducto} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Package className="h-8 w-8 text-gray-400 mr-3" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {producto.nombre}
                      </div>
                      <div className="text-sm text-gray-500">
                        {producto.descripcion}
                      </div>
                      <div className="text-xs text-gray-400">
                        {/* ✅ CAMBIAR A idProducto */}
                        ID: {producto.idProducto}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                    {producto.categoria}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  ${producto.precio}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`text-sm font-medium ${
                    producto.stock > 10 ? 'text-green-600' : 
                    producto.stock > 0 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {producto.stock} unidades
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    // ✅ CAMBIAR A esSensible (ya coincide)
                    producto.esSensible 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {producto.esSensible ? 'Sensible' : 'Normal'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditClick(producto)}
                      className="flex items-center"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteClick(producto)}
                      className="flex items-center text-red-600 hover:text-red-800 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Eliminar
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
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
                {/* ✅ CAMBIAR A idProducto */}
                <p><strong>ID:</strong> {deleteModal.producto?.idProducto}</p>
                <p><strong>Categoría:</strong> {deleteModal.producto?.categoria}</p>
                <p><strong>Stock actual:</strong> {deleteModal.producto?.stock} unidades</p>
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

// Componente de formulario para editar producto
const EditProductForm = ({ producto, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    nombre: producto?.nombre || '',
    descripcion: producto?.descripcion || '',
    precio: producto?.precio || '',
    stock: producto?.stock || '',
    categoria: producto?.categoria || '',
    esSensible: producto?.esSensible || false // ✅ CAMBIAR A esSensible
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(formData);
    } catch (error) {
      console.error('Error en formulario:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Mostrar ID del producto para debug */}
      <div className="bg-gray-100 p-2 rounded text-sm text-gray-600">
        {/* ✅ CAMBIAR A idProducto */}
        Editando producto ID: {producto?.idProducto}
      </div>

      <div>
        <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
          Nombre del producto
        </label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          disabled={loading}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
          required
        />
      </div>

      <div>
        <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">
          Descripción
        </label>
        <textarea
          id="descripcion"
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          disabled={loading}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="precio" className="block text-sm font-medium text-gray-700 mb-1">
            Precio
          </label>
          <input
            type="number"
            id="precio"
            name="precio"
            value={formData.precio}
            onChange={handleChange}
            disabled={loading}
            step="0.01"
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
            required
          />
        </div>

        <div>
          <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
            Stock
          </label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            disabled={loading}
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-1">
          Categoría
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
          <option value="Analgésico">Analgésico</option>
          <option value="Antiinflamatorio">Antiinflamatorio</option>
          <option value="Ansiolítico">Ansiolítico</option>
          <option value="Antibiótico">Antibiótico</option>
          <option value="Vitaminas">Vitaminas</option>
          <option value="Cuidado Personal">Cuidado Personal</option>
          <option value="Primeros Auxilios">Primeros Auxilios</option>
        </select>
      </div>

       <div className="flex items-center">
        <input
          type="checkbox"
          id="esSensible"
          name="esSensible" // ✅ Cambiar comentario a formato de línea
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