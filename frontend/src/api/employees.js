import apiClient from './client';

export const getEmployees = async (params = {}) => {
  const response = await apiClient.get('/admin/employees', { params });
  return response.data;
};

export const getEmployeeById = async (id) => {
  const response = await apiClient.get(`/admin/employees/${id}`);
  return response.data;
};

export const createEmployee = async (data) => {
  const response = await apiClient.post('/admin/employees', data);
  return response.data;
};

export const updateEmployee = async (id, data) => {
  const response = await apiClient.put(`/admin/employees/${id}`, data);
  return response.data;
};

export const updateEmployeeRole = async (id, role) => {
  const response = await apiClient.patch(`/admin/employees/${id}/role`, { role });
  return response.data;
};

export const updateEmployeeStatus = async (id, status, isActive = null) => {
  const payload = { status };
  if (isActive !== null) payload.is_active = isActive;
  const response = await apiClient.patch(`/admin/employees/${id}/status`, payload);
  return response.data;
};

export const deleteEmployee = async (id) => {
  await apiClient.delete(`/admin/employees/${id}`);
};
