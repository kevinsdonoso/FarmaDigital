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

  const loadProductos = async () => {
    try {
      setLoading(true);

      setError(null);
      const data = await getProductos();
      setProductos(data);
    } catch (err) {
      setError('Error al cargar productos: ' + err.message);
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProductos = productos.filter(producto => {
    const matchesSearch = producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         producto.categoria.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === '' || producto.categoria === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDeleteProduct = async (id) => {
    try {
      await deleteProducto(id);
      // ✅ CAMBIAR A idProducto para el filtro
      setProductos(productos.filter(p => p.idProducto !== id));
    } catch (err) {
      alert('Error al eliminar producto: ' + err.message);
      console.error('Error deleting product:', err);
    }
  };

const handleEditProduct = async () => {
  // Solo recargar productos después de editar
  console.log('🔄 Recargando productos después de editar...');
  await loadProductos();
};

 const handleSaveEdit = async (id, productData) => {
    try {
      await updateProducto(id, productData);
      // Recargar productos después de editar
      await loadProductos();
      setIsEditModalOpen(false);
      setEditingProduct(null);
    } catch (err) {
      alert('Error al actualizar producto: ' + err.message);
      console.error('Error updating product:', err);
    }
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
              <p className="text-gray-600">No se encontraron productos</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}