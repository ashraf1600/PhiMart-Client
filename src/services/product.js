import api from './api';

export const productService = {
  getAll: async (params = {}) => {
    const response = await api.get('/products/', { params });
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/products/${id}/`);
    return response.data;
  },
  
  getImages: async (productId) => {
    const response = await api.get(`/products/${productId}/images/`);
    return response.data;
  },
  
  getReviews: async (productId) => {
    const response = await api.get(`/products/${productId}/reviews/`);
    return response.data;
  },
  
  addReview: async (productId, rating, comment) => {
    const response = await api.post(`/products/${productId}/reviews/`, { 
      rating, 
      comment 
    });
    return response.data;
  },
  
  updateReview: async (productId, reviewId, rating, comment) => {
    const response = await api.patch(`/products/${productId}/reviews/${reviewId}/`, { 
      rating, 
      comment 
    });
    return response.data;
  },
  
  deleteReview: async (productId, reviewId) => {
    const response = await api.delete(`/products/${productId}/reviews/${reviewId}/`);
    return response.data;
  },
};