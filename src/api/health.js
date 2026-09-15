import apiClient from './client';

// Health check prod hanya tersedia di root (`GET /health`),
// bukan di bawah `/api/v1` — jadi bangun URL absolut dari origin baseURL.
export const getHealth = async () => {
  let url = '/health';
  try {
    url = `${new URL(apiClient.defaults.baseURL).origin}/health`;
  } catch {
    url = '/health';
  }
  const response = await apiClient.get(url);
  return response.data;
};
