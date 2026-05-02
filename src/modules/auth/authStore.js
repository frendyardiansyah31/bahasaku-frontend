/**
 * authStore.js
 * Zustand store untuk manajemen state autentikasi global.
 *
 * State  : user, isAuthenticated, isLoading, error
 * Actions: registerUser, loginUser, logoutUser, initAuth, clearError
 */

import { create } from 'zustand';
import * as authApi from './authService';
import * as onboardingApi from '../onboarding/onboardingService';
import {
  saveTokens,
  getAccessToken,
  getRefreshToken,
  saveUser,
  getUser,
  clearTokens,
} from '../../shared/storage';

/**
 * Ekstrak payload dari JWT tanpa library tambahan.
 * Kembalikan null jika token tidak valid.
 */
const decodeJwt = (token) => {
  try {
    const base64Payload = token.split('.')[1];
    return JSON.parse(atob(base64Payload));
  } catch {
    return null;
  }
};

/**
 * Parse error dari Django REST Framework ke string yang bisa ditampilkan.
 * DRF bisa mengembalikan: { detail }, { field: [msg] }, { non_field_errors: [msg] }
 */
const parseDrfError = (error, fallback) => {
  const data = error.response?.data;
  if (!data) return fallback;

  // Format: { detail: "..." }
  if (typeof data.detail === 'string') return data.detail;

  // Format: { field: ["error1", "error2"], ... }
  const messages = Object.values(data)
    .flat()
    .filter((v) => typeof v === 'string');

  return messages.length > 0 ? messages.join(' ') : fallback;
};

// ─── Store ──────────────────────────────────────────────────────────────────
const useAuthStore = create((set, get) => ({
  /** Data user yang sedang login, atau null jika belum login */
  user: null,
  /** true jika user sudah login dan token masih valid */
  isAuthenticated: false,
  /** true saat sedang memproses request API */
  isLoading: false,
  /** Pesan error terakhir, atau null jika tidak ada error */
  error: null,

  // ─── Actions ────────────────────────────────────────────────────────────

  /**
   * Cek token di localStorage saat pertama kali app dimuat.
   * Dipanggil di main.jsx agar state terhidrasi sebelum render.
   */
  initAuth: () => {
    const token = getAccessToken();
    if (!token) {
      set({ isAuthenticated: false, user: null });
      return;
    }

    const decoded = decodeJwt(token);
    const tokenMasihValid = decoded && decoded.exp * 1000 > Date.now();

    if (tokenMasihValid) {
      // Ambil data user yang tersimpan dari localStorage
      const user = getUser();
      set({ isAuthenticated: true, user });
    } else {
      // Token kedaluwarsa, bersihkan storage
      clearTokens();
      set({ isAuthenticated: false, user: null });
    }
  },

  /**
   * Daftarkan akun baru.
   * Asumsi: endpoint register mengembalikan { access, refresh, user }.
   * Jika backend tidak mengembalikan token, sesuaikan di sini.
   */
  registerUser: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const { data: responseData } = await authApi.register(data);
      const { access, refresh, user } = responseData;

      saveTokens(access, refresh);
      saveUser(user);
      set({ user, isAuthenticated: true, isLoading: false });
      return user;
    } catch (err) {
      const message = parseDrfError(err, 'Pendaftaran gagal. Silakan coba lagi.');
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  /**
   * Login dengan email dan password.
   * Simpan token dan data user setelah berhasil.
   */
  loginUser: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const { data: responseData } = await authApi.login(data);
      const { access, refresh, user } = responseData;

      saveTokens(access, refresh);
      saveUser(user);
      set({ user, isAuthenticated: true, isLoading: false });
      return user;
    } catch (err) {
      const message = parseDrfError(err, 'Email atau password salah.');
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  /**
   * Logout: invalidasi token di server, hapus storage, reset state.
   * Tetap logout meski request ke server gagal.
   */
  logoutUser: async () => {
    const refresh = getRefreshToken();
    try {
      if (refresh) await authApi.logout(refresh);
    } catch {
      // Abaikan error — user tetap harus bisa logout
    } finally {
      clearTokens();
      set({ user: null, isAuthenticated: false, error: null });
    }
  },

  /**
   * Kirim data onboarding (country + initial_level) ke server.
   * Setelah berhasil, update user di state dan localStorage.
   */
  onboardUser: async ({ country, initial_level }) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await onboardingApi.onboard({ country, initial_level });
      const { user } = data;
      saveUser(user);
      set({ user, isLoading: false });
      return user;
    } catch (err) {
      const message = parseDrfError(err, 'Onboarding gagal. Silakan coba lagi.');
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  /** Hapus pesan error (berguna saat user pindah halaman atau menutup alert) */
  clearError: () => set({ error: null }),
}));

export default useAuthStore;
