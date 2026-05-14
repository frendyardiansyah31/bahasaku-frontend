/**
 * App.jsx
 * Root komponen — hanya merender routing.
 */

import AppRoutes from './routes/AppRoutes';
import LanguageSwitcher from './shared/components/LanguageSwitcher';

export default function App() {
  return (
    <>
      <LanguageSwitcher />
      <AppRoutes />
    </>
  );
}
