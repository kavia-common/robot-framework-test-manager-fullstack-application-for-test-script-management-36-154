/**
 * Authentication Context
 * Manages user authentication state and provides auth utilities
 */

import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

// PUBLIC_INTERFACE
/**
 * Custom hook to access auth context
 * @returns {Object} Auth context value
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// PUBLIC_INTERFACE
/**
 * AuthProvider component to wrap the application
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for existing auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      const savedUser = localStorage.getItem('user');
      
      if (token && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
          // Verify token is still valid
          const userData = await authAPI.getMe();
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        } catch (err) {
          // Token invalid, clear auth
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          setUser(null);
        }
      }
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  /**
   * Login user
   * @param {string} username - Username
   * @param {string} password - Password
   */
  const login = async (username, password) => {
    try {
      setError(null);
      setLoading(true);
      const response = await authAPI.login(username, password);
      
      // Store token
      localStorage.setItem('authToken', response.access_token);
      
      // Fetch user info
      const userData = await authAPI.getMe();
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Login failed';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout user
   */
  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      // Continue with logout even if API call fails
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  /**
   * Check if user has a specific role
   * @param {string} role - Role name to check
   * @returns {boolean}
   */
  const hasRole = (role) => {
    return user?.roles?.includes(role) || false;
  };

  /**
   * Check if user is admin
   * @returns {boolean}
   */
  const isAdmin = () => {
    return hasRole('admin');
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    hasRole,
    isAdmin,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
