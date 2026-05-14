/**
 * main.jsx
 * Entry point aplikasi BahasaKu.
 * Import Bootstrap CSS dan Bootstrap Icons di sini agar tersedia global.
 * Inisialisasi auth state dari localStorage sebelum render pertama.
 */

import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

// ── Bootstrap CSS & Icons ──────────────────────────────────────────────────
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

// ── Global app styles & i18n ────────────────────────────────────────────────
import './i18n';
import './shared/styles/global.css';

// ── Aplikasi ───────────────────────────────────────────────────────────────
import useAuthStore from './modules/auth/authStore';
import App from './App';

function Root() {
  const initAuth = useAuthStore((state) => state.initAuth);

  // Cek token di localStorage sekali saat app pertama load,
  // sebelum route manapun dirender.
  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);
