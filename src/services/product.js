import api from './api';

export const productService = {
  getAll: async (params = {}) => {
    const response = await api.get('/products/', { params });
    const data = response.data;
    const products = data.results || data;
    
    // Ensure each product has a display_image for easy use in frontend
    if (Array.isArray(products)) {
      products.forEach(product => {
        if (!product.display_image) {
          if (product.main_image) {
            product.display_image = product.main_image;
          } else if (product.images && product.images.length > 0) {
            const img = product.images[0];
            product.display_image = typeof img === 'string' ? img : img.image;
          } else if (product.image_url) {
            product.display_image = product.image_url;
          } else if (product.image) {
            product.display_image = typeof product.image === 'string' ? product.image : null;
          }
        }
      });
    }
    
    return data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/products/${id}/`);
    const product = response.data;
    
    // Normalize image fields
    if (!product.display_image) {
      if (product.main_image) {
        product.display_image = product.main_image;
      } else if (product.images && product.images.length > 0) {
        const img = product.images[0];
        product.display_image = typeof img === 'string' ? img : img.image;
      } else if (product.image_url) {
        product.display_image = product.image_url;
      } else if (product.image) {
        product.display_image = typeof product.image === 'string' ? product.image : null;
      }
    }
    
    return product;
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
    try {
      const response = await api.post(`/products/${productId}/reviews/`, { 
        ratings: parseInt(rating, 10),  // FIXED: 'ratings' not 'rating'
        comment: comment.trim() 
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        // Throw the actual error response from Django
        throw error.response.data;
      }
      throw { detail: error.message || 'Network error' };
    }
  },
  
  updateReview: async (productId, reviewId, rating, comment) => {
    try {
      const response = await api.patch(`/products/${productId}/reviews/${reviewId}/`, { 
        ratings: parseInt(rating, 10),
        comment: comment.trim() 
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        throw error.response.data;
      }
      throw { detail: error.message || 'Network error' };
    }
  },
  
  deleteReview: async (productId, reviewId) => {
    const response = await api.delete(`/products/${productId}/reviews/${reviewId}/`);
    return response.data;
  },
};