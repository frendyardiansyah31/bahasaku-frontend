/**
 * AppRoutes.jsx
 * Konfigurasi routing utama aplikasi BahasaKu menggunakan React Router v6.
 *
 * Pembagian route:
 * - PublicRoute  → hanya untuk tamu (/login, /register)
 * - PrivateRoute → butuh autentikasi (/dashboard, /topics, /onboarding, dll.)
 * - Route bebas  → /404, dst.
 */

import { Routes, Route, Navigate } from 'react-router-dom';
import PublicRoute  from './guards/PublicRoute';
import PrivateRoute from './guards/PrivateRoute';

// Pages — import lazy jika ingin code splitting
import RegisterPage from '../pages/RegisterPage';
import LoginPage    from '../pages/LoginPage';

// ── Placeholder pages (implementasi di iterasi berikutnya) ─────────────────
const DashboardPage  = () => <div style={{ padding: '2rem', fontFamily: 'Sora, sans-serif' }}><h1>Dashboard</h1><p>Selamat datang!</p></div>;
const OnboardingPage = () => <div style={{ padding: '2rem', fontFamily: 'Sora, sans-serif' }}><h1>Onboarding</h1><p>Mari setup profilmu.</p></div>;
const TopicsPage     = () => <div style={{ padding: '2rem', fontFamily: 'Sora, sans-serif' }}><h1>Topik</h1></div>;
const AdminPage      = () => <div style={{ padding: '2rem', fontFamily: 'Sora, sans-serif' }}><h1>Admin Panel</h1></div>;
const NotFoundPage   = () => (
  <div style={{ padding: '4rem', textAlign: 'center', fontFamily: 'Sora, sans-serif' }}>
    <h1 style={{ fontSize: '5rem', color: '#124663' }}>404</h1>
    <p>Halaman tidak ditemukan.</p>
    <a href="/" style={{ color: '#124663' }}>Kembali ke Beranda</a>
  </div>
);

// ─── Komponen Routing ──────────────────────────────────────────────────────
export default function AppRoutes() {
  return (
    <Routes>
      {/* ── Route Publik (hanya untuk tamu) ─────────────────── */}
      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />

      {/* ── Route Private (butuh autentikasi) ───────────────── */}
      <Route
        path="/onboarding"
        element={
          <PrivateRoute>
            <OnboardingPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/topics"
        element={
          <PrivateRoute>
            <TopicsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <PrivateRoute>
            <AdminPage />
          </PrivateRoute>
        }
      />

      {/* ── Redirect root ke /dashboard ─────────────────────── */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* ── 404 ─────────────────────────────────────────────── */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
