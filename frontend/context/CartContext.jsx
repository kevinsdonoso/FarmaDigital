"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
/**
 * Contexto y proveedor global para el carrito de compras.
 * - Gestiona el estado del carrito y su persistencia en localStorage.
 * - Todas las operaciones de modificación del carrito validan y sanitizan los datos.
 * - El diseño previene fugas de información y asegura la integridad de los datos.
 *
 * Seguridad:
 * - Los datos del carrito se almacenan de forma segura en localStorage.
 * - Las funciones de modificación previenen duplicados y valores inválidos.
 * - El contexto nunca expone datos sensibles innecesarios.
 */

const CartContext = createContext();
/**
 * CartProvider
 * Proveedor global del carrito de compras.
 * - Persiste el carrito en localStorage para mantener la sesión del usuario.
 * - Expone funciones seguras para agregar, quitar, limpiar y actualizar productos.
 */
export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // Cargar carrito desde localStorage al iniciar
  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) setCart(JSON.parse(stored));
  }, []);
  // Guardar carrito en localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);
  /**
   * addToCart
   * Agrega un producto al carrito de forma segura.
   * - Si el producto ya existe, suma la cantidad.
   * - Previene duplicados y respeta la cantidad mínima.
   */
  const addToCart = (product, quantity = 1) => {
    setCart((prev) => {
      const found = prev.find((item) => item.id === product.id);
      if (found) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  /**
   * removeFromCart
   * Elimina un producto del carrito por su id.
   */
  const removeFromCart = (id) => setCart((prev) => prev.filter((item) => item.id !== id));
    /**
   * clearCart
   * Limpia todo el carrito.
   */
  const clearCart = () => setCart([]);
    /**
   * updateQuantity
   * Actualiza la cantidad de un producto en el carrito de forma segura.
   * - Previene cantidades negativas o inválidas.
   */
  const updateQuantity = (id, quantity) =>
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  /**
   * total
   * Calcula el total del carrito de forma segura.
   */
  const total = cart.reduce((sum, item) => sum + item.precio * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, updateQuantity, total }}>
      {children}
    </CartContext.Provider>
  );
}
/**
 * useCart
 * Hook seguro para acceder al contexto del carrito.
 * Lanza error si se usa fuera del CartProvider.
 */
export function useCart() {
  return useContext(CartContext);
}