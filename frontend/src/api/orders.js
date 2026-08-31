import apiClient from './client';

export const getOrders = async (params = {}) => {
  const response = await apiClient.get('/admin/orders', { params });
  return response.data;
};

export const getOrderById = async (id) => {
  const response = await apiClient.get(`/admin/orders/${id}`);
  return response.data;
};

export const updateOrderStatus = async (id, status) => {
  const response = await apiClient.patch(`/admin/orders/${id}/status`, { status });
  return response.data;
};
