/**
 * App.jsx
 * Root komponen — hanya merender routing.
 * Logika provider ada di AppProviders, logika route ada di AppRoutes.
 */

import AppRoutes from '../routes/AppRoutes';

export default function App() {
  return <AppRoutes />;
}
