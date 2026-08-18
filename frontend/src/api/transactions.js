import apiClient from './client';

export const createTransaction = async (data) => {
  const response = await apiClient.post('/transactions', data);
  return response.data;
};

export const getTransactionById = async (id) => {
  const response = await apiClient.get(`/transactions/${id}`);
  return response.data;
};
