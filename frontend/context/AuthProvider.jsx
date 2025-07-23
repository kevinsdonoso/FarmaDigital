'use client';
/**
 * Contexto y proveedor de autenticación para la aplicación.
 * - Gestiona el estado de usuario autenticado y su sesión.
 * - Utiliza funciones centralizadas para verificar, obtener y limpiar datos sensibles.
 * - El diseño previene fugas de información y asegura el ciclo de vida de la sesión.
 *
 * Seguridad:
 * - Todas las operaciones de login/logout usan funciones centralizadas que sanitizan y eliminan tokens.
 * - El contexto nunca expone datos sensibles innecesarios.
 */
import React, { createContext, useContext, useEffect, useState } from 'react';
import { isAuthenticated, getCurrentToken, getUserInfo, logout as authLogout } from '@/lib/auth';

const AuthContext = createContext();
/**
 * AuthProvider
 * Proveedor global de autenticación.
 * - Verifica el usuario autenticado al cargar la app.
 * - Expone funciones seguras para login y logout.
 */
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
 /**
   * login
   * Actualiza el estado de usuario autenticado de forma segura.
   * @param {Object} userInfo - Datos del usuario autenticado
   */
  const login = (userInfo) => {
    setUser(userInfo);
    setIsLoggedIn(true);
  };
  /**
   * logout
   * Llama a la función centralizada para limpiar la sesión y tokens.
   * Elimina datos sensibles y actualiza el estado global.
   */
  const logout = () => {
    authLogout(); 
    setUser(null);
    setIsLoggedIn(false);
  };
// Valor expuesto por el contexto
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
/**
 * useAuth
 * Hook seguro para acceder al contexto de autenticación.
 * Lanza error si se usa fuera del AuthProvider.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
