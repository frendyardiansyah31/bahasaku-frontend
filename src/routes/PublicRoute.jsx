/**
 * PublicRoute.jsx
 * Guard untuk route yang hanya boleh diakses oleh tamu (belum login).
 * Contoh: /register, /login.
 *
 * - Sudah login → redirect ke /dashboard
 * - Belum login → render children
 */

import { Navigate } from 'react-router-dom';
import useAuthStore from '../modules/auth/authStore';

export default function PublicRoute({ children }) {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
