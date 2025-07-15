'use client'
import React from 'react';
import { Filter } from 'lucide-react';

export default function ProductFilter({ filterCategory, setFilterCategory, productos }) {
  // Obtener categorías únicas
  const categories = [...new Set(productos.map(p => p.categoria))];

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
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
          >
            <option value="">Todas las categorías</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <button
            onClick={() => setFilterCategory('')}
            className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Limpiar filtros
          </button>
        </div>
      </div>
    </div>
  );
}