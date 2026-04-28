/**
 * main.jsx
 * Entry point aplikasi BahasaKu.
 * Import Bootstrap CSS dan Bootstrap Icons di sini agar tersedia global.
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// ── Bootstrap CSS & Icons ──────────────────────────────────────────────────
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

// ── Aplikasi ───────────────────────────────────────────────────────────────
import AppProviders from './providers/AppProviders';
import App          from './App';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </StrictMode>,
);
