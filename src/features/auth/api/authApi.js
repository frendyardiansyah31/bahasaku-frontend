/**
 * authApi.js
 * Semua pemanggilan API yang berkaitan dengan autentikasi.
 * Fungsi-fungsi di sini hanya bertanggung jawab mengirim request ke backend.
 * Logika bisnis (simpan token, update state) ada di authStore.
 */

import axiosInstance from '../../../shared/api/axiosInstance';

/**
 * Daftar akun baru.
 * @param {{ first_name, last_name, email, password, password_confirm }} data
 */
export const register = (data) =>
  axiosInstance.post('/api/auth/register/', data);

/**
 * Masuk ke aplikasi dengan email dan password.
 * Response: { access, refresh, user }
 * @param {{ email, password }} data
 */
export const login = (data) =>
  axiosInstance.post('/api/auth/login/', data);

/**
 * Perbarui access token menggunakan refresh token.
 * Response: { access }
 * @param {string} refresh
 */
export const refreshToken = (refresh) =>
  axiosInstance.post('/api/auth/token/refresh/', { refresh });

/**
 * Keluar dari aplikasi dan invalidasi refresh token di server.
 * @param {string} refresh
 */
export const logout = (refresh) =>
  axiosInstance.post('/api/auth/logout/', { refresh });
