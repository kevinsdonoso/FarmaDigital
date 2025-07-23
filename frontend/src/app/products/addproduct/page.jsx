'use client'
/**
 * Página para agregar productos de forma segura.
 * - Valida y sanitiza todos los campos antes de enviar.
 * - Aplica rate limiting para prevenir spam y abuso.
 * - El diseño previene fugas de información y asegura la integridad de los datos.
 *
 * Seguridad:
 * - Todos los datos se validan y sanitizan antes de enviarse al backend.
 * - El formulario previene manipulación y abuso de datos.
 * - Los errores se muestran de forma segura y nunca exponen información sensible.
 * - El botón de logout elimina la sesión y datos sensibles.
 */
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Package, Save, ArrowLeft, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { addProducto , getUserFromToken } from '@/lib/api';
import LogoutButton from '@/components/ui/LogoutButton';
import { useRouteGuard } from '@/hooks/useRouteGuard';

import { sanitizeInput, checkRateLimit, validateUserInput } from '@/lib/security';
import { useSecureForm } from '@/hooks/useSecureForm';

export default function AddProduct() {
  const router = useRouter();
  const { state: authState } = useAuth();
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const status = useRouteGuard({ allowedRoles: [2] }); // Solo vendedores
  // Hook seguro para manejar el formulario
  const {formData,errors,setErrors,handleChange
  } = useSecureForm({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    categoria: '',
    es_sensible: false,
    creado_por: getUserFromToken()?.id_usuario
  });

  /**
   * validateForm
   * Validación segura de todos los campos antes de enviar.
   */
  const validateForm = () => {
    const newErrors = {};
    // Validar nombre
    if (!validateUserInput(formData.nombre, 'text', { minLength: 2, maxLength: 100 })) {
      newErrors.nombre = 'El nombre debe tener entre 2 y 100 caracteres';
    }  
    // Validar descripción
    if (!validateUserInput(formData.descripcion, 'text', { minLength: 10, maxLength: 500 })) {
      newErrors.descripcion = 'La descripción debe tener entre 10 y 500 caracteres';
    }
    // Validar precio
    const precio = Number(formData.precio);
    if (!validateUserInput(precio, 'number', { min: 0.01, max: 999999 })) {
      newErrors.precio = 'El precio debe ser mayor a 0 y menor a 999,999';
    }
    // Validar stock
    const stock = Number(formData.stock);
    if (!validateUserInput(stock, 'number', { min: 0, max: 999999 })) {
      newErrors.stock = 'El stock debe ser mayor o igual a 0 y menor a 999,999';
    }
    // Validar categoría
    const categoriasValidas = [
      'Analgésicos', 'Antiinflamatorios', 'Antibióticos', 'Endocrinología',
      'Cardiología', 'Vitaminas', 'Cuidado Personal', 'Primeros Auxilios'
    ];
    if (!categoriasValidas.includes(formData.categoria)) {
      newErrors.categoria = 'Selecciona una categoría válida';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * handleSubmit
   * Envía el formulario de forma segura.
   * - Valida y sanitiza los datos antes de enviar.
   * - Aplica rate limiting para prevenir spam.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Rate limiting para prevenir spam de creación
    if (!checkRateLimit('add_product', 5, 300000)) {
      alert('Demasiados productos creados. Espera 5 minutos.');
      return;
    }
    if (!validateForm()) return;
    setLoading(true);
    try {
      // Sanitizar todos los campos antes de enviar
      const productoData = {
        nombre: sanitizeInput(formData.nombre.trim()),
        descripcion: sanitizeInput(formData.descripcion.trim()),
        precio: Math.round(Number(formData.precio) * 100) / 100, // Redondear a 2 decimales
        stock: Math.floor(Number(formData.stock)), // Solo enteros
        categoria: sanitizeInput(formData.categoria),
        es_sensible: Boolean(formData.es_sensible),
        creado_por: getUserFromToken()?.id_usuario
      };
      // Validación final antes de enviar
      if (!productoData.nombre || !productoData.descripcion || !productoData.categoria) {
        throw new Error('Todos los campos obligatorios deben estar completos');
      }
      const nuevoProducto = await addProducto(productoData);
      
      setSuccessMsg('¡Producto agregado exitosamente!');
      setTimeout(() => setSuccessMsg(''), 3000); // Oculta el mensaje después de 3s
    router.push('/products');
  } catch (error) {
      alert('Error al crear el producto: ' + sanitizeInput(error.message || 'Error desconocido'));
    } finally {
      setLoading(false);
    }
  };

  /**
   * handleInputChange
   * Manejo seguro de inputs y validaciones en tiempo real.
   */
  const handleInputChange = (e) => {
    const { name, value} = e.target;
    // Validaciones adicionales en tiempo real
    handleChange(e);

    // Validaciones adicionales en tiempo real
    if (name === 'nombre' && value.length > 100) {
      setErrors(prev => ({ ...prev, nombre: 'Máximo 100 caracteres' }));
      return;
    }

    if (name === 'descripcion' && value.length > 500) {
      setErrors(prev => ({ ...prev, descripcion: 'Máximo 500 caracteres' }));
      return;
    }

    if (name === 'precio') {
      const precio = Number(value);
      if (precio < 0 || precio > 999999) {
        setErrors(prev => ({ ...prev, precio: 'Precio fuera de rango válido' }));
        return;
      }
    }

    if (name === 'stock') {
      const stock = Number(value);
      if (stock < 0 || stock > 999999) {
        setErrors(prev => ({ ...prev, stock: 'Stock fuera de rango válido' }));
        return;
      }
    }
    // Limpiar error cuando el usuario corrige
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Returns condicionales según estado y seguridad
  if (status === "loading") return <div>Cargando...</div>;
  if (status === "unauthorized") return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex justify-end mb-4">
        <LogoutButton />
      </div> 
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
        {successMsg && (
          <div className="mb-4 px-4 py-2 bg-green-100 border border-green-300 text-green-800 rounded-lg text-center font-medium shadow">
            {successMsg}
          </div>
        )}
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
                onChange={handleChange}
                maxLength={100}
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
              <p className="mt-1 text-xs text-gray-500">
                {formData.nombre.length}/100 caracteres
              </p>
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
                maxLength={500}
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
              <p className="mt-1 text-xs text-gray-500">
                {formData.descripcion.length}/500 caracteres
              </p>
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
                  min="0.01"
                  max="999999"
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
                  max="999999"
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