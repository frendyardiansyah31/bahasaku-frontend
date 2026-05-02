/**
 * RegisterPage.jsx
 * Desktop : split layout — panel kiri (branding) + panel kanan (form)
 * Mobile  : hero biru di atas + form di bawah (sesuai bahasaku_mobile_register_v2.html)
 */

import RegisterForm from '../components/RegisterForm';
import styles from '../auth.module.css';

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
          Kuasai Bahasa Indonesia, <br />
          Raih Prestasi Terbaikmu
        </h1>
        <p className={styles.brandSubtitle}>
          Platform latihan bahasa yang adaptif, menyenangkan, dan berbasis data
          untuk membantu kamu mencapai level kemahiran impian.
        </p>

        <ul className={styles.featureList}>
          <li className={styles.featureItem}>
            <span className={styles.featureIcon}>📚</span>
            Materi terstruktur dari A1 hingga C2
          </li>
          <li className={styles.featureItem}>
            <span className={styles.featureIcon}>🔥</span>
            Streak harian untuk menjaga konsistensi belajar
          </li>
          <li className={styles.featureItem}>
            <span className={styles.featureIcon}>🏆</span>
            Sistem XP dan pencapaian yang memotivasimu
          </li>
          <li className={styles.featureItem}>
            <span className={styles.featureIcon}>📊</span>
            Progress yang terukur dan visualisasi kemajuan
          </li>
        </ul>
      </div>

      <p className={styles.brandFooter}>
        Bergabung bersama ribuan pelajar Bahasa Indonesia
      </p>
    </div>
  );
}

// ─── Hero Mobile (mobile only, menggantikan panel kiri) ────────────────────
// Desain mengacu pada bahasaku_mobile_register_v2.html
function MobileHero() {
  return (
    <div className={`${styles.mobileHero} d-md-none`}>
      {/* Brand */}
      <div className={styles.mobileHeroBrand}>
        <div className={styles.mobileHeroLogoIcon}>B</div>
        <span className={styles.mobileHeroBrandName}>BahasaKu</span>
      </div>

      <h2 className={styles.mobileHeroTitle}>Buat akun baru</h2>
      <p className={styles.mobileHeroSubtitle}>
        Data negara &amp; level diatur setelah daftar
      </p>

      {/* Progress steps — step 1 aktif karena kita sedang di halaman register */}
      <div className={styles.mobileSteps}>
        <div className={styles.mobileStep}>
          <div className={`${styles.mobileStepNum} ${styles.done}`}>1</div>
          <span className={`${styles.mobileStepText} ${styles.done}`}>Buat akun</span>
        </div>
        <div className={styles.mobileStep}>
          <div className={styles.mobileStepNum}>2</div>
          <span className={styles.mobileStepText}>Atur profil &amp; level</span>
        </div>
        <div className={styles.mobileStep}>
          <div className={styles.mobileStepNum}>3</div>
          <span className={styles.mobileStepText}>Mulai latihan</span>
        </div>
      </div>
    </div>
  );
}

// ─── Halaman Utama ─────────────────────────────────────────────────────────
export default function RegisterPage() {
  return (
    <div className={styles.authWrapper}>
      {/* Panel kiri branding — hanya tampil di desktop (≥ 768px) */}
      <BrandPanel />

      {/* Panel kanan — full width di mobile, 55% di desktop */}
      <div className={styles.formPanel}>
        {/* Hero biru — hanya tampil di mobile (< 768px) */}
        <MobileHero />

        <div className={styles.formContainer}>
          {/* Judul & subjudul — hanya tampil di desktop (mobile sudah ada di MobileHero) */}
          <div className="d-none d-md-block">
            <h2 className={styles.formTitle}>Buat Akun Baru</h2>
            <p className={styles.formSubtitle}>
              Daftar gratis dan mulai perjalanan belajarmu hari ini.
            </p>
          </div>

          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
