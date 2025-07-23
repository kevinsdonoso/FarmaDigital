'use client'
import React from 'react';
import { Filter } from 'lucide-react';

// ✨ AGREGAR IMPORTS DE SEGURIDAD
import { sanitizeInput, checkRateLimit } from '@/lib/security';

export default function ProductFilter({ filterCategory, setFilterCategory, productos }) {
  // ✨ OBTENER CATEGORÍAS ÚNICAS DE FORMA SEGURA
  const categories = [...new Set(
    productos
      .map(p => sanitizeInput(p.categoria || ''))
      .filter(cat => cat.trim() !== '')
  )];

  // ✨ FUNCIÓN SEGURA PARA CAMBIAR FILTRO
  const handleCategoryChange = (e) => {
    const value = sanitizeInput(e.target.value);
    
    // Rate limiting para filtros
    if (!checkRateLimit('category_filter', 20, 10000)) {
      return;
    }

    // Validar que la categoría seleccionada sea válida
    if (value === '' || categories.includes(value)) {
      setFilterCategory(value);
    }
  };

  // ✨ FUNCIÓN SEGURA PARA LIMPIAR FILTROS
  const handleClearFilters = () => {
    // Rate limiting para limpiar filtros
    if (!checkRateLimit('clear_filters', 10, 30000)) {
      return;
    }
    
    setFilterCategory('');
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <Filter className="h-5 w-5 text-gray-400 mr-2" />
          <span className="text-sm font-medium text-gray-700">Filtrar por:</span>
        </div>

        <div className="flex space-x-4">
          <select
            value={filterCategory}
            onChange={handleCategoryChange}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
          >
            <option value="">Todas las categorías</option>
            {/* ✨ RENDERIZAR CATEGORÍAS SANITIZADAS */}
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <button
            onClick={handleClearFilters}
            className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Limpiar filtros
          </button>
        </div>

        {/* ✨ MOSTRAR CONTADOR DE RESULTADOS */}
        <div className="text-sm text-gray-500">
          {productos.length} producto{productos.length !== 1 ? 's' : ''} total{productos.length !== 1 ? 'es' : ''}
        </div>
      </div>
    </div>
  );
}