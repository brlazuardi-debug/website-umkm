import apiClient from './client';
import type { TransaksiResponse, TransaksiCreate } from '../types';

export const createTransaction = async (data: TransaksiCreate): Promise<TransaksiResponse> => {
  const response = await apiClient.post<TransaksiResponse>('/transactions', data);
  return response.data;
};

export const getTransactionById = async (id: string): Promise<TransaksiResponse> => {
  const response = await apiClient.get<TransaksiResponse>(`/transactions/${id}`);
  return response.data;
};
