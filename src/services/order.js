import api from './api';

export const orderService = {
  getAll: async () => {
    const response = await api.get('/orders/');
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/orders/${id}/`);
    return response.data;
  },
  
  create: async (orderData) => {
    const response = await api.post('/orders/', {
      cart_id: orderData.cart_id
    });
    return response.data;
  },
  
  update: async (id, orderData) => {
    const response = await api.patch(`/orders/${id}/`, orderData);
    return response.data;
  },
  
  cancel: async (orderId) => {
    const response = await api.post(`/orders/${orderId}/cancel/`);
    return response.data;
  },
  
  updateStatus: async (orderId, status) => {
    const response = await api.post(`/orders/${orderId}/update_status/`, { status });
    return response.data;
  },
  
  delete: async (orderId) => {
    const response = await api.delete(`/orders/${orderId}/`);
    return response.data;
  },
};