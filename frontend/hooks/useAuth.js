'use client';
import { create } from 'zustand';
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
}
));

export { useAuth };
