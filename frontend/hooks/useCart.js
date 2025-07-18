'use client'
import { create } from 'zustand';
import { fakeItemsCarrito, fakeProductos } from '../lib/fakeData';

const useCart = create((set) => ({
  state: {
    items: [
      // Simulamos algunos items en el carrito usando los datos fake
      {
        id: 1,
        id_producto: 1,
        nombre: "Paracetamol",
        precio: 2.5,
        quantity: 2
      }
    ],
    total: 5.0,
  },
  addItem: (item) => set((state) => {
    const existingItem = state.state.items.find(i => i.id === item.id);
    if (existingItem) {
      return {
        state: {
          ...state.state,
          items: state.state.items.map(i => 
            i.id === item.id 
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          ),
        }
      };
    }
    return {
      state: {
        ...state.state,
        items: [...state.state.items, item],
      }
    };
  }),
  removeItem: (id) => set((state) => ({
    state: {
      ...state.state,
      items: state.state.items.filter(item => item.id !== id),
    }
  })),
  clearCart: () => set((state) => ({
    state: {
      ...state.state,
      items: [],
      total: 0,
    }
  })),
}));

export { useCart };
