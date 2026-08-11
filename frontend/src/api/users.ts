import apiClient from './client';
import type { UserResponse, UserUpdate } from '../types';

export const getMyProfile = async (): Promise<UserResponse> => {
  const response = await apiClient.get<UserResponse>('/users/me');
  return response.data;
};

export const updateMyProfile = async (data: UserUpdate): Promise<UserResponse> => {
  const response = await apiClient.patch<UserResponse>('/users/me', data);
  return response.data;
};
