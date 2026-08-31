import apiClient from './client';

export const getProducts = async (limit = 20, offset = 0, includeInactive = false) => {
  const response = await apiClient.get('/products', {
    params: { limit, offset, ...(includeInactive ? { include_inactive: true } : {}) },
  });
  // Tangani format paginasi ({ data: [...], meta: {...} }) ataupun array langsung
  return response.data?.data ?? response.data;
};

export const getProductById = async (id) => {
  const response = await apiClient.get(`/products/${id}`);
  return response.data;
};

export const createProduct = async (data) => {
  const response = await apiClient.post('/products', data);
  return response.data;
};

export const updateProduct = async (id, data) => {
  const response = await apiClient.put(`/products/${id}`, data);
  return response.data;
};

export const deleteProduct = async (id) => {
  await apiClient.delete(`/products/${id}`);
};
