'use client'
import { create } from 'zustand';
import { fakeUsuarios } from '../lib/fakeData';

const useAuth = create((set) => ({
  state: {
    user: {
      id_usuario: 1,
      nombre: "Juan Perez",
      correo: "juan@example.com",
      role: "cliente" // Mapeamos id_rol 1 a "cliente"
    }, // Usuario fake inicial para simular estar logueado
    isAuthenticated: true,
    loading: false,
  },
  login: (userData) => set((state) => ({
    state: {
      ...state.state,
      user: userData,
      isAuthenticated: true,
      loading: false,
    }
  })),
  logout: () => set((state) => ({
    state: {
      ...state.state,
      user: null,
      isAuthenticated: false,
      loading: false,
    }
  })),
  setLoading: (loading) => set((state) => ({
    state: {
      ...state.state,
      loading,
    }
  })),
  // Función para cambiar entre diferentes usuarios fake
  switchUser: (userId) => set((state) => {
    const fakeUser = fakeUsuarios.find(u => u.id_usuario === userId);
    if (fakeUser) {
      // Mapear id_rol a nombre de rol
      const roleMap = {
        1: 'cliente',
        2: 'vendedor', 
        3: 'auditor'
      };
      
      return {
        state: {
          ...state.state,
          user: {
            id_usuario: fakeUser.id_usuario,
            nombre: fakeUser.nombre,
            correo: fakeUser.correo,
            role: roleMap[fakeUser.id_rol]
          },
          isAuthenticated: true
        }
      };
    }
    return state;
  })
}));

export { useAuth };