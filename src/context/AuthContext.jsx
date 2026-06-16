import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/auth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const userData = await authService.getCurrentUser();
          setUser(userData);
          setIsAdmin(userData.is_staff || userData.is_superuser || false);
        } catch (error) {
          console.error('Failed to load user:', error);
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const login = async (email, password) => {
    await authService.login(email, password);
    const userData = await authService.getCurrentUser();
    setUser(userData);
    setIsAdmin(userData.is_staff || userData.is_superuser || false);
    return userData;
  };

  const register = async (userData) => {
    const response = await authService.register(userData);
    return response;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAdmin(false);
  };

  const updateUser = async (userData) => {
    const updatedUser = await authService.updateProfile(userData);
    setUser(updatedUser);
    setIsAdmin(updatedUser.is_staff || updatedUser.is_superuser || false);
    return updatedUser;
  };

  const changePassword = async (currentPassword, newPassword) => {
    await authService.changePassword(currentPassword, newPassword);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      updateUser, 
      changePassword,
      loading,
      isAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
};