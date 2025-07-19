"use client";
import React, { useEffect, useState } from "react";
import { getProducts } from "@/lib/api";
import ProductCard from "@/components/products/ProductCard";

export default function DashboardPage() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const data = await getProducts();
        setProductos(data);
      } catch (error) {
        console.error("Error al cargar productos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  if (loading) return <div className="p-4">Cargando productos...</div>;

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Nuestro Catálogo</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {productos.map((producto) => (
          <ProductCard key={producto.idProducto} producto={producto} />
        ))}
      </div>
    </main>
  );
}
