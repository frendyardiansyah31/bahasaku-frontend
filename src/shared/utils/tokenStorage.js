/**
 * tokenStorage.js
 * Helper untuk menyimpan, mengambil, dan menghapus token JWT di localStorage.
 * Catatan P2: Ganti ke httpOnly cookie untuk keamanan yang lebih baik.
 */

const KEY_ACCESS  = 'bahasaku_access';
const KEY_REFRESH = 'bahasaku_refresh';
const KEY_USER    = 'bahasaku_user';

/** Simpan access token dan refresh token ke localStorage */
export const saveTokens = (access, refresh) => {
  localStorage.setItem(KEY_ACCESS, access);
  localStorage.setItem(KEY_REFRESH, refresh);
};

/** Ambil access token dari localStorage */
export const getAccessToken = () => localStorage.getItem(KEY_ACCESS);

/** Ambil refresh token dari localStorage */
export const getRefreshToken = () => localStorage.getItem(KEY_REFRESH);

/** Simpan data user (object) ke localStorage */
export const saveUser = (user) =>
  localStorage.setItem(KEY_USER, JSON.stringify(user));

/** Ambil data user dari localStorage, kembalikan null jika tidak ada */
export const getUser = () => {
  const raw = localStorage.getItem(KEY_USER);
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

/** Hapus semua token dan data user dari localStorage (saat logout) */
export const clearTokens = () => {
  localStorage.removeItem(KEY_ACCESS);
  localStorage.removeItem(KEY_REFRESH);
  localStorage.removeItem(KEY_USER);
};
