import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../auth/authStore';
import styles from '../onboarding.module.css';

// ─── Data Konstanta ───────────────────────────────────────────────────────────

const COUNTRIES = [
  { flag: '🇮🇩', name: 'Indonesia' },
  { flag: '🇲🇾', name: 'Malaysia' },
  { flag: '🇳🇱', name: 'Belanda' },
  { flag: '🇩🇪', name: 'Jerman' },
  { flag: '🇺🇸', name: 'Amerika Serikat' },
  { flag: '🇸🇬', name: 'Singapura' },
  { flag: '🇦🇺', name: 'Australia' },
  { flag: '🌏', name: 'Lainnya' },
];

// Hanya A1 dan A2 sesuai API spec
const LEVELS = [
  { code: 'A1', label: 'Pemula', desc: 'Baru mulai belajar Bahasa Indonesia' },
  { code: 'A2', label: 'Dasar', desc: 'Mengenal dasar, ingin lebih lancar' },
];

const TOTAL_STEPS = 3;

// Icon per step (mobile only — disembunyikan di desktop via CSS)
const STEP_ICONS = {
  1: { emoji: '👋', cls: styles.stepIcon1 },
  2: { emoji: '🌏', cls: styles.stepIcon2 },
  3: { emoji: '🎯', cls: styles.stepIcon3 },
};

// ─── Sub-komponen ─────────────────────────────────────────────────────────────

/** Step indicator berupa circles + lines — ditampilkan di desktop */
function StepBar({ current }) {
  const circleClass = (i) => {
    if (i < current) return `${styles.stepCircle} ${styles.done}`;
    if (i === current) return `${styles.stepCircle} ${styles.active}`;
    return `${styles.stepCircle} ${styles.idle}`;
  };

  return (
    <div className={styles.steps}>
      {[1, 2, 3].map((i) => (
        <div key={i} className={styles.stepItem}>
          <div className={circleClass(i)}>
            {i < current ? '✓' : i}
          </div>
          {i < 3 && (
            <div className={`${styles.stepLine} ${i < current ? styles.done : ''}`} />
          )}
        </div>
      ))}
    </div>
  );
}

/** Step indicator berupa pill dots — ditampilkan di mobile */
function StepDots({ current }) {
  const dotClass = (i) => {
    if (i < current) return `${styles.stepDot} ${styles.done}`;
    if (i === current) return `${styles.stepDot} ${styles.active}`;
    return styles.stepDot;
  };

  return (
    <div className={styles.stepDots}>
      {[1, 2, 3].map((i) => (
        <div key={i} className={dotClass(i)} />
      ))}
    </div>
  );
}

/**
 * Wrapper layout yang menangani perbedaan desktop vs mobile:
 * - Desktop: header brand + StepBar di atas card
 * - Mobile: mobileTop (brand + StepDots) di dalam card + step icon
 */
function OnboardingLayout({ current, children }) {
  const iconData = STEP_ICONS[current];

  return (
    <div className={styles.root}>
      {/* Desktop: header di atas card */}
      <div className={styles.header}>
        <div className={styles.brand}>
          <div className={styles.logo}>B</div>
          <span className={styles.brandName}>BahasaKu</span>
        </div>
        <StepBar current={current} />
      </div>

      <div className={styles.card}>
        {/* Mobile: top bar di dalam card */}
        <div className={styles.mobileTop}>
          <div className={styles.brand}>
            <div className={styles.logo}>B</div>
            <span className={styles.brandName}>BahasaKu</span>
          </div>
          <StepDots current={current} />
        </div>

        {/* Mobile: icon per step */}
        {iconData && (
          <div className={`${styles.stepIcon} ${iconData.cls}`}>
            {iconData.emoji}
          </div>
        )}

        {children}
      </div>
    </div>
  );
}

// ─── Halaman Utama ────────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const onboardUser = useAuthStore((s) => s.onboardUser);
  const isLoading = useAuthStore((s) => s.isLoading);

  const [step, setStep] = useState(1);
  const [country, setCountry] = useState('');
  const [level, setLevel] = useState('');
  const [countrySearch, setCountrySearch] = useState('');
  const [apiError, setApiError] = useState(null);

  const userName = user?.name ?? 'Pengguna';
  const selectedLevelObj = LEVELS.find((l) => l.code === level);

  const filteredCountries = COUNTRIES.filter((c) =>
    c.name.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const handleSubmit = async () => {
    setApiError(null);
    try {
      await onboardUser({ country, initial_level: level });
      setStep(4);
    } catch (err) {
      setApiError(err.response?.data?.message ?? 'Onboarding gagal. Silakan coba lagi.');
    }
  };

  // ── Step 1: Greeting ─────────────────────────────────────────────────────────

  if (step === 1) {
    return (
      <OnboardingLayout current={1}>
        <div className={styles.stepTag}>Langkah 1 dari {TOTAL_STEPS}</div>
        <div className={styles.stepTitle}>Halo, {userName}!</div>
        <div className={styles.stepSub}>
          Kami sudah mengenalmu. Sekarang mari lengkapi profilmu agar pengalaman belajarmu lebih personal.
        </div>
        <div className={styles.nav}>
          <span className={styles.progressText}>1 / {TOTAL_STEPS}</span>
          <button className={styles.btnNext} onClick={() => setStep(2)}>
            Lanjut →
          </button>
        </div>
      </OnboardingLayout>
    );
  }

  // ── Step 2: Negara ───────────────────────────────────────────────────────────

  if (step === 2) {
    return (
      <OnboardingLayout current={2}>
        <div className={styles.stepTag}>Langkah 2 dari {TOTAL_STEPS}</div>
        <div className={styles.stepTitle}>Dari mana asalmu?</div>
        <div className={styles.stepSub}>
          Ini membantu kami menyesuaikan konten dan konteks budaya dalam latihan.
        </div>

        <input
          className={styles.countrySearch}
          type="text"
          placeholder="Cari negara..."
          value={countrySearch}
          onChange={(e) => setCountrySearch(e.target.value)}
        />

        <div className={styles.countryGrid}>
          {filteredCountries.map((c) => (
            <button
              key={c.name}
              className={`${styles.countryBtn} ${country === c.name ? styles.selected : ''}`}
              onClick={() => setCountry(c.name)}
            >
              <span className={styles.countryFlag}>{c.flag}</span>
              {c.name}
            </button>
          ))}
        </div>

        <div className={styles.nav}>
          <button className={styles.btnBack} onClick={() => setStep(1)}>
            ← Kembali
          </button>
          <button
            className={styles.btnNext}
            onClick={() => setStep(3)}
            disabled={!country}
          >
            Lanjut →
          </button>
        </div>
      </OnboardingLayout>
    );
  }

  // ── Step 3: Level ────────────────────────────────────────────────────────────

  if (step === 3) {
    return (
      <OnboardingLayout current={3}>
        <div className={styles.stepTag}>Langkah 3 dari {TOTAL_STEPS}</div>
        <div className={styles.stepTitle}>Pilih level awalmu</div>
        <div className={styles.stepSub}>
          Jangan khawatir, kamu bisa ubah ini nanti dari profil.
        </div>

        <div className={styles.levelList}>
          {LEVELS.map((l) => (
            <button
              key={l.code}
              className={`${styles.levelBtn} ${level === l.code ? styles.selected : ''}`}
              onClick={() => setLevel(l.code)}
            >
              <div className={styles.levelLeft}>
                <span className={styles.levelName}>{l.label}</span>
                <span className={styles.levelDesc}>{l.desc}</span>
              </div>
              <span className={styles.levelBadge}>{l.code}</span>
            </button>
          ))}
        </div>

        <div className={styles.nav}>
          <button className={styles.btnBack} onClick={() => setStep(2)}>
            ← Kembali
          </button>
          <button
            className={styles.btnNext}
            onClick={handleSubmit}
            disabled={!level || isLoading}
          >
            {isLoading ? 'Menyimpan...' : 'Mulai Belajar →'}
          </button>
        </div>
      </OnboardingLayout>
    );
  }

  // ── Step 4: Success ──────────────────────────────────────────────────────────

  return (
    <OnboardingLayout current={4}>
      {apiError && (
        <div className={styles.alertError}>
          <i className="bi bi-exclamation-circle-fill" />
          {apiError}
        </div>
      )}

      <div className={styles.success}>
        <div className={styles.successIcon}>
          <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 17L12 23L26 9" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <h2 className={styles.successTitle}>Halo, {userName}!</h2>
        <p className={styles.successSubtitle}>
          Profilmu sudah siap. Yuk mulai latihan pertamamu hari ini dan jaga streakmu!
        </p>

        <div className={styles.summary}>
          <div className={styles.summaryRow}>
            <span className={styles.summaryKey}>Nama</span>
            <span className={styles.summaryVal}>{userName}</span>
          </div>
          <div className={styles.summaryRow}>
            <span className={styles.summaryKey}>Negara</span>
            <span className={styles.summaryVal}>{country}</span>
          </div>
          <div className={styles.summaryRow}>
            <span className={styles.summaryKey}>Level Awal</span>
            <span className={styles.summaryVal}>
              {selectedLevelObj ? `${selectedLevelObj.label} (${selectedLevelObj.code})` : level}
            </span>
          </div>
        </div>

        <button className={styles.btnStart} onClick={() => navigate('/dashboard')}>
          Mulai Latihan Pertama →
        </button>
      </div>
    </OnboardingLayout>
  );
}
