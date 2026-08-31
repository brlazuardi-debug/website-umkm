import apiClient from './client';

export const getCarts = async (params = {}) => {
  const response = await apiClient.get('/admin/carts', { params });
  return response.data;
};

export const getCartById = async (id) => {
  const response = await apiClient.get(`/admin/carts/${id}`);
  return response.data;
};

export const updateCartStatus = async (id, status) => {
  const response = await apiClient.patch(`/admin/carts/${id}`, { status });
  return response.data;
};

export const deleteCart = async (id) => {
  await apiClient.delete(`/admin/carts/${id}`);
};
