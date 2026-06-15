import api from './api';

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/jwt/create/', { email, password });
    if (response.data.access) {
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
    }
    return response.data;
  },
  
  register: async (userData) => {
    const response = await api.post('/auth/users/', userData);
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },
  
  getCurrentUser: async () => {
    const response = await api.get('/auth/users/me/');
    return response.data;
  },
  
  updateProfile: async (userData) => {
    const response = await api.patch('/auth/users/me/', userData);
    return response.data;
  },
  
  changePassword: async (currentPassword, newPassword) => {
    const response = await api.post('/auth/users/set_password/', {
      current_password: currentPassword,
      new_password: newPassword,
    });
    return response.data;
  },
  
  resetPassword: async (email) => {
    const response = await api.post('/auth/users/reset_password/', { email });
    return response.data;
  },
};