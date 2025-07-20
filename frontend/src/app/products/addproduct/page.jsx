'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Package, Save, ArrowLeft, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { addProducto } from '@/lib/api';

export default function AddProduct() {
  const router = useRouter();
  const { state: authState } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    categoria: '',
    es_sensible: false
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es requerida';
    }

    if (!formData.precio || parseFloat(formData.precio) <= 0) {
      newErrors.precio = 'El precio debe ser mayor a 0';
    }

    if (!formData.stock || parseInt(formData.stock) < 0) {
      newErrors.stock = 'El stock debe ser mayor o igual a 0';
    }

    if (!formData.categoria.trim()) {
      newErrors.categoria = 'La categoría es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      const productoData = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        precio: formData.precio,
        stock: formData.stock,
        categoria: formData.categoria,
        es_sensible: formData.es_sensible,
        creado_por: authState.user?.id_usuario || null
      };

      const nuevoProducto = await addProducto(productoData);
      
      console.log('Producto creado:', nuevoProducto);
      alert('Producto agregado exitosamente!');
      router.push('/products');
      
    } catch (error) {
      console.error('Error al crear producto:', error);
      alert('Error al crear el producto: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // ... resto del componente igual
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Limpiar error cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => router.push('/products')}
            className="mb-4 flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a productos
          </Button>
          
          <div className="flex items-center">
            <Package className="h-8 w-8 text-primary mr-3" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Agregar Nuevo Producto
              </h1>
              <p className="text-gray-600 mt-1">
                Completa la información del medicamento
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nombre del producto */}
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del producto *
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.nombre ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ej: Paracetamol"
              />
              {errors.nombre && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.nombre}
                </p>
              )}
            </div>

            {/* Descripción */}
            <div>
              <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-2">
                Descripción *
              </label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                rows={4}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.descripcion ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Describe el medicamento, sus usos y propiedades..."
              />
              {errors.descripcion && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.descripcion}
                </p>
              )}
            </div>

            {/* Precio y Stock */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="precio" className="block text-sm font-medium text-gray-700 mb-2">
                  Precio *
                </label>
                <input
                  type="number"
                  id="precio"
                  name="precio"
                  value={formData.precio}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.precio ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                />
                {errors.precio && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.precio}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-2">
                  Stock inicial *
                </label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  min="0"
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.stock ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0"
                />
                {errors.stock && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.stock}
                  </p>
                )}
              </div>
            </div>

            {/* Categoría */}
            <div>
              <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-2">
                Categoría *
              </label>
              <select
                id="categoria"
                name="categoria"
                value={formData.categoria}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.categoria ? 'border-red-500' : 'border-gray-300'
                }`}
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
              {errors.categoria && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.categoria}
                </p>
              )}
            </div>

            {/* Producto sensible */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="es_sensible"
                name="es_sensible"
                checked={formData.es_sensible}
                onChange={handleInputChange}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="es_sensible" className="ml-2 block text-sm text-gray-700">
                Este es un producto sensible (requiere manejo especial)
              </label>
            </div>

            {/* Botones */}
            <div className="flex justify-end space-x-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/products')}
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
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Guardar Producto
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}