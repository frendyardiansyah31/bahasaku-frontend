/**
 * AppProviders.jsx
 * Wrapper yang menggabungkan semua provider aplikasi.
 * Tambahkan provider baru (misal: QueryClientProvider, ThemeProvider)
 * di sini agar App.jsx tetap bersih.
 */

import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import useAuthStore from '../../features/auth/store/authStore';

export default function AppProviders({ children }) {
  const initAuth = useAuthStore((state) => state.initAuth);

  // Inisialisasi state autentikasi dari localStorage saat app pertama load.
  // Dipanggil sekali saat mount, sebelum render route apapun.
  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return <BrowserRouter>{children}</BrowserRouter>;
}
