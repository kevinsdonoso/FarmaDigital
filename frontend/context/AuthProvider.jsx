'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { isAuthenticated, getCurrentToken, getUserInfo, logout as authLogout } from '../lib/auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Verificar si hay un usuario autenticado al cargar la app
    const checkAuth = () => {
      try {
        if (isAuthenticated()) {
          const userInfo = getUserInfo();
          const token = getCurrentToken();
          
          setUser(userInfo);
          setIsLoggedIn(true);
          
          console.log('Usuario autenticado encontrado:', userInfo);
        } else {
          setUser(null);
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Error verificando autenticación:', error);
        setUser(null);
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (userInfo) => {
    setUser(userInfo);
    setIsLoggedIn(true);
  };

  const logout = () => {
    authLogout(); // Usar la función de logout del sistema de auth
    setUser(null);
    setIsLoggedIn(false);
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isLoggedIn,
    isAuthenticated: () => isAuthenticated(),
    getCurrentToken: () => getCurrentToken()
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
