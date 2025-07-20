'use client';
import { create } from 'zustand';
import { fakeUsuarios } from '../lib/fakeData';
import { getToken } from '@/lib/auth';

const useAuth = create((set) => ({
  state: {
    user: null,
    isAuthenticated: false,
    loading: true, // <-- empieza en true
    token:getToken() ,
  },

  login: (userData) => set((state) => ({
    state: {
      ...state.state,
      user: userData,
      isAuthenticated: true,
      loading: false,
      token: getToken(),
    }
  })),

  logout: () => set((state) => ({
    state: {
      ...state.state,
      user: null,
      isAuthenticated: false,
      loading: false,
      token: null,
    }
  })),

  setLoading: (loading) => set((state) => ({
    state: {
      ...state.state,
      loading,
    }
  })),

  setToken: () => set((state) => ({
    state: {
      ...state.state,
      token: getToken(), // Siempre desde cookies
    }
  })),

  validateStoredToken: () => {
    const token = getToken();
    if (token) {
      set((state) => ({
        state: {
          ...state.state,
          token,
        }
      }));
    }
  },

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
