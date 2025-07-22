'use client'
import React, { useState, useEffect } from 'react';
import { Package, Plus, Search } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { getProductos, deleteProducto, updateProducto } from '@/lib/api';
import ProductTable from '@/components/products/ProductTable';
import ProductFilter from './ProductFilter';
import Link from 'next/link';
import Header from "@/components/ui/Header";
import { useRouteGuard } from "@/hooks/useRouteGuard";

// ✨ AGREGAR IMPORTS DE SEGURIDAD
import { sanitizeInput, checkRateLimit, validateUserInput } from '@/lib/security';

export default function Products() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [error, setError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const status = useRouteGuard({ allowedRoles: [2] }); // Solo vendedores

  useEffect(() => {
    loadProductos();
  }, []);

    // ✨ FUNCIÓN PARA SANITIZAR PRODUCTOS
  const sanitizeProductsData = (productosData) => {
    if (!Array.isArray(productosData)) return [];
    
    return productosData.map(producto => ({
      ...producto,
      idProducto: producto.idProducto || producto.id,
      nombre: sanitizeInput(producto.nombre || ''),
      descripcion: sanitizeInput(producto.descripcion || ''),
      categoria: sanitizeInput(producto.categoria || ''),
      precio: Math.max(0, Number(producto.precio) || 0),
      stock: Math.max(0, Number(producto.stock) || 0),
      es_sensible: Boolean(producto.es_sensible)
    }));
  };

  const loadProductos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await getProductos();
      
      // ✨ SANITIZAR DATOS DE PRODUCTOS
      const sanitizedData = sanitizeProductsData(data);
      setProductos(sanitizedData);
      
    } catch (err) {
      console.error('Error loading products:', err);
      setError(sanitizeInput(err.message || 'Error al cargar productos'));
    } finally {
      setLoading(false);
    }
  };

// ✨ FILTRADO SEGURO CON SANITIZACIÓN
  const filteredProductos = productos.filter(producto => {
    // Sanitizar término de búsqueda
    const sanitizedSearchTerm = sanitizeInput(searchTerm.toLowerCase());
    const sanitizedFilterCategory = sanitizeInput(filterCategory);
    
    const matchesSearch = producto.nombre.toLowerCase().includes(sanitizedSearchTerm) ||
                         producto.categoria.toLowerCase().includes(sanitizedSearchTerm);
    const matchesCategory = sanitizedFilterCategory === '' || producto.categoria === sanitizedFilterCategory;
    return matchesSearch && matchesCategory;
  });

  // ✨ FUNCIÓN SEGURA PARA ELIMINAR PRODUCTO
  const handleDeleteProduct = async (id) => {
    // Rate limiting para prevenir spam de eliminaciones
    if (!checkRateLimit(`delete_product_${id}`, 3, 60000)) {
      alert('Demasiadas eliminaciones. Espera un momento.');
      return;
    }

    // Validar ID
    const sanitizedId = sanitizeInput(id);
    if (!validateUserInput(sanitizedId, 'number')) {
      alert('ID de producto no válido');
      return;
    }

    if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      return;
    }

    
    if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      return;
    }

    try {
      await deleteProducto(sanitizedId);
      setProductos(productos.filter(p => p.idProducto !== sanitizedId));
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('Error al eliminar producto: ' + sanitizeInput(err.message || 'Error desconocido'));
    }
  };

// ✨ FUNCIÓN SEGURA PARA EDITAR
  const handleEditProduct = async () => {
    // Rate limiting para recargas
    if (!checkRateLimit('reload_products', 10, 30000)) {
      console.warn('Rate limit excedido para recargar productos');
      return;
    }

    console.log('🔄 Recargando productos después de editar...');
    await loadProductos();
  };


 // ✨ FUNCIÓN SEGURA PARA GUARDAR EDICIÓN
  const handleSaveEdit = async (id, productData) => {
    // Rate limiting para ediciones
    if (!checkRateLimit(`edit_product_${id}`, 5, 60000)) {
      alert('Demasiadas ediciones. Espera un momento.');
      return;
    }

    // Validar ID
    const sanitizedId = sanitizeInput(id);
    if (!validateUserInput(sanitizedId, 'number')) {
      alert('ID de producto no válido');
      return;
    }

    // ✨ SANITIZAR DATOS DEL PRODUCTO
    const sanitizedProductData = {
      nombre: sanitizeInput(productData.nombre || ''),
      descripcion: sanitizeInput(productData.descripcion || ''),
      categoria: sanitizeInput(productData.categoria || ''),
      precio: Math.max(0, Number(productData.precio) || 0),
      stock: Math.max(0, Number(productData.stock) || 0),
      es_sensible: Boolean(productData.es_sensible)
    };

    // Validar datos requeridos
    if (!sanitizedProductData.nombre.trim()) {
      alert('El nombre del producto es requerido');
      return;
    }

    try {
      await updateProducto(sanitizedId, sanitizedProductData);
      await loadProductos();
      setIsEditModalOpen(false);
      setEditingProduct(null);
    } catch (err) {
      console.error('Error updating product:', err);
      alert('Error al actualizar producto: ' + sanitizeInput(err.message || 'Error desconocido'));
    }
  };


// ✨ FUNCIÓN SEGURA PARA MANEJAR BÚSQUEDA
  const handleSearchChange = (e) => {
    const value = e.target.value;
    
    // Limitar longitud de búsqueda
    if (value.length > 100) {
      return;
    }

    // Rate limiting para búsquedas
    if (!checkRateLimit('product_search', 20, 10000)) {
      return;
    }

    setSearchTerm(value);
  };

  const handleCloseEdit = () => {
    setIsEditModalOpen(false);
    setEditingProduct(null);
  };
  // AHORA SÍ, LOS RETURNS CONDICIONALES
  if (status === "loading") return <div>Cargando...</div>;
  if (status === "unauthorized") return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Cargando productos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="h-12 w-12 text-red-500 mx-auto mb-4" />
          {/* ✨ ERROR SANITIZADO */}
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={loadProductos}>
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header 
        title="Gestión de Productos" 
        showUserSwitcher={true} 
      />
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Gestión de Productos
            </h1>
          </div>
          <Link href="/products/addproduct">
            <Button className="flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              Agregar Producto
            </Button>
          </Link>
        </div>

        {/* Filtros y búsqueda */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <ProductFilter
            filterCategory={filterCategory}
            setFilterCategory={setFilterCategory}
            productos={productos}
          />
        </div>

        {/* Tabla de productos */}
        <ProductTable
          productos={filteredProductos}
          onDeleteProduct={handleDeleteProduct}
          onEditProduct={handleEditProduct} // Solo para recargar
        />
          {filteredProductos.length === 0 && !loading && (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                {searchTerm ? 'No se encontraron productos que coincidan con tu búsqueda' : 'No se encontraron productos'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}