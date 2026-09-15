import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'https://umkmvarca.renaldi.my.id/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Menyimpan getter token Clerk terbaru agar interceptor (yang hanya
// didaftarkan SEKALI saat module load) selalu membaca fungsi terbaru
// tanpa menumpuk interceptor setiap kali login/logout.
let getClerkToken = null;

// Daftarkan auth interceptor tepat satu kali saat module di-load.
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

// Mengarahkan interceptor ke getter token Clerk terbaru. Aman dipanggil
// setiap login/logout karena hanya memutasi ref bersama — tidak ada
// interceptor baru yang ditambahkan.
export const setAuthTokenInterceptor = (getToken) => {
  getClerkToken = getToken;
};

// Response Interceptor untuk penanganan status code error global
// (tanpa alert agar tidak memblokir UI; biarkan halaman menampilkan error state)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (status === 401) {
      console.warn('Unauthorized request - redirecting to login');
    } else if (status === 403) {
      console.error('Akses Ditolak (403): Tidak memiliki izin.');
    } else if (status === 422) {
      console.warn('Validasi input gagal (422):', error.response?.data);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
