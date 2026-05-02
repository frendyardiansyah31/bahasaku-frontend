/**
 * http.js
 * Axios instance terpusat dengan interceptor JWT.
 *
 * Request interceptor  → otomatis attach Authorization header
 * Response interceptor → jika 401, coba refresh token, lalu retry
 *                        jika refresh gagal, logout + redirect /login
 */

import axios from 'axios';
import {
  getAccessToken,
  getRefreshToken,
  saveTokens,
  clearTokens,
} from './storage';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// ─── State untuk proses refresh ────────────────────────────────────────────
// Flag agar hanya ada satu request refresh yang berjalan pada satu waktu
let isRefreshing = false;

// Antrian request yang menunggu hasil refresh
let failedQueue = [];

/**
 * Setelah refresh selesai, proses semua request yang tertunda.
 * @param {Error|null} error - null jika refresh berhasil
 * @param {string|null} token - access token baru
 */
const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  failedQueue = [];
};

// ─── Request Interceptor ────────────────────────────────────────────────────
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    // Lampirkan token hanya jika ada, agar endpoint publik tetap bisa diakses
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ─── Response Interceptor ───────────────────────────────────────────────────
axiosInstance.interceptors.response.use(
  // Respons sukses: langsung teruskan
  (response) => response,

  // Respons error: tangani 401 dengan refresh token
  async (error) => {
    const originalRequest = error.config;

    // Hanya tangani 401 dan hindari infinite loop (_retry flag)
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Jika sedang refresh, masukkan request ini ke antrian
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return axiosInstance(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    const refresh = getRefreshToken();

    // Jika tidak ada refresh token, langsung logout
    if (!refresh) {
      clearTokens();
      window.location.href = '/login';
      return Promise.reject(error);
    }

    try {
      // Gunakan axios biasa (bukan instance) agar tidak masuk interceptor lagi
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/token/refresh/`,
        { refresh },
      );

      // Simpan access token baru, pertahankan refresh token lama
      saveTokens(data.access, refresh);
      processQueue(null, data.access);

      originalRequest.headers.Authorization = `Bearer ${data.access}`;
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      clearTokens();
      window.location.href = '/login';
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default axiosInstance;
