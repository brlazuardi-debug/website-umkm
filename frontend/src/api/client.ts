import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Holds the most recent Clerk token getter so the (single, registered-once)
// request interceptor always reads a fresh function without stacking interceptors.
let getClerkToken: (() => Promise<string | null>) | null = null;

// Register the auth interceptor exactly once at module load.
apiClient.interceptors.request.use(
  async (config) => {
    if (getClerkToken) {
      try {
        const token = await getClerkToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (err) {
        console.error('Gagal menyisipkan token Clerk:', err);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Point the interceptor at the latest Clerk token getter. Safe to call on every
// sign-in/out because it only mutates the shared ref — no new interceptor is added.
export const setAuthTokenInterceptor = (getToken: () => Promise<string | null>): void => {
  getClerkToken = getToken;
};

// Response Interceptor untuk penanganan status code error global
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (status === 401) {
      // Unauthorized -> arahkan kembali ke login/root jika diperlukan
      console.warn('Unauthorized request - redirecting to login');
      // Anda bisa memicu redirect ke login di sini jika tidak dalam proses re-autentikasi
    } else if (status === 403) {
      console.error('Akses Ditolak (403): Tidak memiliki izin.');
      alert('Akses Ditolak: Anda tidak memiliki izin untuk mengakses halaman ini.');
    } else if (status === 422) {
      console.warn('Validasi input gagal (422):', error.response?.data);
    }
    return Promise.reject(error);
  }
);
export default apiClient;
