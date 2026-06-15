import api from './api';

export const cartService = {
  // Get user's carts (GET /carts/)
  getUserCarts: async () => {
    const response = await api.get('/carts/');
    return response.data;
  },
  
  // Get specific cart by ID (GET /carts/{id}/)
  getCart: async (cartId) => {
    const response = await api.get(`/carts/${cartId}/`);
    return response.data;
  },
  
  // Create new cart (POST /carts/)
  createCart: async () => {
    const response = await api.post('/carts/', {});
    return response.data;
  },
  
  // Get cart items (GET /carts/{cart_pk}/items/)
  getCartItems: async (cartId) => {
    const response = await api.get(`/carts/${cartId}/items/`);
    return response.data;
  },
  
  // Add item to cart (POST /carts/{cart_pk}/items/)
  addItem: async (cartId, productId, quantity = 1) => {
    const response = await api.post(`/carts/${cartId}/items/`, {
      product_id: productId,
      quantity: quantity,
    });
    return response.data;
  },
  
  // Update cart item (PATCH /carts/{cart_pk}/items/{id}/)
  updateItem: async (cartId, itemId, quantity) => {
    const response = await api.patch(`/carts/${cartId}/items/${itemId}/`, {
      quantity: quantity,
    });
    return response.data;
  },
  
  // Remove item from cart (DELETE /carts/{cart_pk}/items/{id}/)
  removeItem: async (cartId, itemId) => {
    const response = await api.delete(`/carts/${cartId}/items/${itemId}/`);
    return response.data;
  },
};