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
import PublicRoute  from './PublicRoute';
import PrivateRoute from './PrivateRoute';
import notFoundStyles from '../shared/styles/notFound.module.css';

// Pages — import lazy jika ingin code splitting
import RegisterPage   from '../modules/auth/pages/RegisterPage';
import LoginPage      from '../modules/auth/pages/LoginPage';
import OnboardingPage from '../modules/onboarding/pages/OnboardingPage';
import DashboardPage  from '../modules/dashboard/pages/DashboardPage';
import TopicsPage     from '../modules/topics/pages/TopicsPage';
import QuizPage       from '../modules/quiz/pages/QuizPage';
const QuizIndexPage  = () => <div className="p-4"><h1>Latihan Soal</h1></div>;
const AdminPage      = () => <div className="p-4"><h1>Admin Panel</h1></div>;
const NotFoundPage   = () => (
  <div className={notFoundStyles.wrapper}>
    <h1 className={notFoundStyles.title}>404</h1>
    <p>Halaman tidak ditemukan.</p>
    <a href="/" className={notFoundStyles.link}>Kembali ke Beranda</a>
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
        path="/quiz"
        element={
          <PrivateRoute>
            <QuizIndexPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/quiz/:topicId"
        element={
          <PrivateRoute>
            <QuizPage />
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
