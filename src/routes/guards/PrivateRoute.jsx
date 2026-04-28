/**
 * PrivateRoute.jsx
 * Guard untuk route yang memerlukan autentikasi.
 *
 * - Belum login              → redirect ke /login
 * - Sudah login tapi belum onboarding → redirect ke /onboarding
 *   (kecuali route itu sendiri adalah /onboarding)
 * - Sudah login & sudah onboarding → render children
 */

import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../features/auth/store/authStore';

export default function PrivateRoute({ children }) {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  // Belum login → redirect ke /login, simpan path asal untuk redirect kembali
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Belum onboarding & bukan di halaman onboarding → redirect ke /onboarding
  const isOnboardingRoute = location.pathname === '/onboarding';
  if (user && !user.is_onboarded && !isOnboardingRoute) {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
}
