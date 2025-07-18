'use client'
import { create } from 'zustand';
import { fakeUsuarios } from '../lib/fakeData';

const useAuth = create((set) => ({
  state: {
    user: null,
    isAuthenticated: false,
    loading: false,
    token: null,
  },
  
  login: (userData) => set((state) => ({
    state: {
      ...state.state,
      user: userData,
      isAuthenticated: true,
      loading: false,
    }
  })),
  
  logout: () => set((state) => {
    localStorage.removeItem('token');
    return {
      state: {
        ...state.state,
        user: null,
        isAuthenticated: false,
        loading: false,
        token: null,
      }
    };
  }),
  
  setLoading: (loading) => set((state) => ({
    state: {
      ...state.state,
      loading,
    }
  })),

  setToken: (token) => set((state) => ({
    state: {
      ...state.state,
      token,
    }
  })),

  // Función para validar token almacenado
  validateStoredToken: () => {
    const token = localStorage.getItem('token');
    if (token) {
      // Aquí puedes agregar validación del token si es necesario
      set((state) => ({
        state: {
          ...state.state,
          token,
        }
      }));
    }
  },

  // Función para cambiar entre diferentes usuarios fake (mantener para desarrollo)
  switchUser: (userId) => set((state) => {
    const fakeUser = fakeUsuarios.find(u => u.id_usuario === userId);
    if (fakeUser) {
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