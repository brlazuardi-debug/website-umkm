import apiClient from './client';
import type { ProdukResponse, ProdukCreate, ProdukUpdate } from '../types';

export const getProducts = async (limit: number = 20, offset: number = 0): Promise<ProdukResponse[]> => {
  const response = await apiClient.get<ProdukResponse[]>('/products', {
    params: { limit, offset },
  });
  return response.data;
};

export const getProductById = async (id: string): Promise<ProdukResponse> => {
  const response = await apiClient.get<ProdukResponse>(`/products/${id}`);
  return response.data;
};

export const createProduct = async (data: ProdukCreate): Promise<ProdukResponse> => {
  const response = await apiClient.post<ProdukResponse>('/products', data);
  return response.data;
};

export const updateProduct = async (id: string, data: ProdukUpdate): Promise<ProdukResponse> => {
  const response = await apiClient.put<ProdukResponse>(`/products/${id}`, data);
  return response.data;
};

export const deleteProduct = async (id: string): Promise<void> => {
  await apiClient.delete(`/products/${id}`);
};
