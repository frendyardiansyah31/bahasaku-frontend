/**
 * LoginPage.jsx
 * Desktop : split layout — panel kiri (branding) + panel kanan (form)
 * Mobile  : hero biru di atas + form di bawah (sesuai bahasaku_mobile_auth.html)
 */

import { LoginForm } from '../features/auth';
import styles from '../shared/styles/auth.module.css';

// ─── Panel Kiri (desktop only) ──────────────────────────────────────────────
function BrandPanel() {
  return (
    <div className={styles.brandPanel}>
      <div className={styles.logo}>
        <div className={styles.logoIcon}>🇮🇩</div>
        <span>BahasaKu</span>
      </div>

      <div className={styles.brandContent}>
        <h1 className={styles.brandTitle}>
          Selamat Datang <br />
          Kembali! 👋
        </h1>
        <p className={styles.brandSubtitle}>
          Lanjutkan perjalanan belajarmu. Streak-mu menunggu — jangan sampai
          putus hari ini!
        </p>

        <ul className={styles.featureList}>
          <li className={styles.featureItem}>
            <span className={styles.featureIcon}>🔥</span>
            Pertahankan streak belajar harianmu
          </li>
          <li className={styles.featureItem}>
            <span className={styles.featureIcon}>⚡</span>
            Latihan singkat 10–15 menit sehari sudah cukup
          </li>
          <li className={styles.featureItem}>
            <span className={styles.featureIcon}>📈</span>
            Lihat perkembangan kemampuan bahasa Indonesiamu
          </li>
          <li className={styles.featureItem}>
            <span className={styles.featureIcon}>🎯</span>
            Tantangan harian untuk mengasah kemampuanmu
          </li>
        </ul>
      </div>

      <p className={styles.brandFooter}>
        Bergabung bersama ribuan pelajar Bahasa Indonesia
      </p>
    </div>
  );
}

// ─── Hero Mobile Login (mobile only) ───────────────────────────────────────
function MobileLoginHero() {
  return (
    <div className={`${styles.mobileLoginHero} d-md-none`}>
      {/* Brand — ditampilkan di atas */}
      <div className={styles.lgnBrand}>
        <div className={styles.lgnLogo}>B</div>
        <span className={styles.lgnBrandName}>BahasaKu</span>
      </div>

      {/* Body — judul, streak, dots hari */}
      <div className={styles.lgnHeroBody}>
        <h2 className={styles.lgnHeroTitle}>Selamat datang kembali</h2>
        <p className={styles.lgnHeroSubtitle}>Lanjutkan perjalanan belajarmu</p>
        <div className={styles.lgnStreak}>
          <span>🔥</span>
          4 hari streak — jangan putus!
        </div>
        <div className={styles.lgnDots}>
          <div className={`${styles.lgnDot} ${styles.lgnDotDone}`}>S</div>
          <div className={`${styles.lgnDot} ${styles.lgnDotDone}`}>S</div>
          <div className={`${styles.lgnDot} ${styles.lgnDotDone}`}>R</div>
          <div className={`${styles.lgnDot} ${styles.lgnDotDone}`}>K</div>
          <div className={`${styles.lgnDot} ${styles.lgnDotToday}`}>J</div>
          <div className={`${styles.lgnDot} ${styles.lgnDotEmpty}`}>S</div>
          <div className={`${styles.lgnDot} ${styles.lgnDotEmpty}`}>M</div>
        </div>
      </div>
    </div>
  );
}

// ─── Halaman Utama ─────────────────────────────────────────────────────────
export default function LoginPage() {
  return (
    <div className={styles.authWrapper}>
      {/* Panel kiri branding — hanya tampil di desktop (≥ 768px) */}
      <BrandPanel />

      {/* Panel kanan — full width di mobile, 55% di desktop */}
      <div className={styles.formPanel}>
        {/* Hero biru — hanya tampil di mobile (< 768px) */}
        <MobileLoginHero />

        <div className={styles.formContainer}>
          {/* Judul & subjudul — hanya tampil di desktop (mobile sudah ada di MobileLoginHero) */}
          <div className="d-none d-md-block">
            <h2 className={styles.formTitle}>Masuk ke BahasaKu</h2>
            <p className={styles.formSubtitle}>
              Masukkan email dan kata sandi untuk melanjutkan.
            </p>
          </div>

          <LoginForm />
        </div>
      </div>
    </div>
  );
}
