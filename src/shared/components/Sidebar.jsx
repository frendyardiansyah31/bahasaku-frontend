import { NavLink } from 'react-router-dom';
import useAuthStore from '../../modules/auth/authStore';
import styles from '../styles/sidebar.module.css';

const getInitials = (name = '') =>
  name.split(' ').filter(Boolean).map((n) => n[0]).join('').slice(0, 2).toUpperCase() || '?';

const NAV_ITEMS = [
  {
    to: '/dashboard',
    label: 'Dashboard',
    icon: (
      <svg className={styles.navIcon} viewBox="0 0 16 16" fill="none">
        <rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor" />
        <rect x="9" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.5" />
        <rect x="1" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.5" />
        <rect x="9" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.5" />
      </svg>
    ),
  },
  {
    to: '/topics',
    label: 'Daftar Topik',
    icon: (
      <svg className={styles.navIcon} viewBox="0 0 16 16" fill="none">
        <path d="M2 3h12M2 8h8M2 13h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    to: '/history',
    label: 'Riwayat Sesi',
    icon: (
      <svg className={styles.navIcon} viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 5v3.5l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    to: '/progress',
    label: 'Progress',
    icon: (
      <svg className={styles.navIcon} viewBox="0 0 16 16" fill="none">
        <path d="M2 12V4l5 5 3-4 4 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    to: '/profile',
    label: 'Profil',
    icon: (
      <svg className={styles.navIcon} viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M2 14c0-3 2.7-5 6-5s6 2 6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
];

/**
 * Shared sidebar component used by all protected pages.
 * @param {string} [levelText] - e.g. "B1 · Menengah" from dashboard API.
 *   Falls back to user.initial_level from authStore if not provided.
 */
export default function Sidebar({ levelText }) {
  const user = useAuthStore((s) => s.user);
  const logoutUser = useAuthStore((s) => s.logoutUser);
  const displayLevel = levelText ?? user?.initial_level ?? '—';

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarBrand}>
        <div className={styles.logo}>B</div>
        <span className={styles.brandName}>BahasaKu</span>
      </div>

      <nav>
        {NAV_ITEMS.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `${styles.navItem}${isActive ? ` ${styles.navActive}` : ''}`
            }
          >
            {icon}
            {label}
          </NavLink>
        ))}
      </nav>

      <div className={styles.sidebarBottom}>
        <div className={styles.userRow}>
          <div className={styles.avatar}>{getInitials(user?.name)}</div>
          <div>
            <div className={styles.userName}>{user?.name}</div>
            <div className={styles.userLevel}>{displayLevel}</div>
          </div>
        </div>
        <button className={styles.logoutBtn} onClick={() => logoutUser()}>
          Keluar
        </button>
      </div>
    </aside>
  );
}
