import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useAuthStore from '../../auth/authStore';
import LanguageSwitcher from '../../../shared/components/LanguageSwitcher';
import styles from '../../../shared/styles/onboarding.module.css';

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

const LEVELS = [
  { code: 'A1' },
  { code: 'A2' },
];

const TOTAL_STEPS = 3;

const STEP_ICONS = {
  1: { emoji: '👋', cls: styles.stepIcon1 },
  2: { emoji: '🌏', cls: styles.stepIcon2 },
  3: { emoji: '🎯', cls: styles.stepIcon3 },
};

// ─── Sub-komponen ─────────────────────────────────────────────────────────────

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
        <LanguageSwitcher />
      </div>

      <div className={styles.card}>
        {/* Mobile: top bar di dalam card */}
        <div className={styles.mobileTop}>
          <div className={styles.brand}>
            <div className={styles.logo}>B</div>
            <span className={styles.brandName}>BahasaKu</span>
          </div>
          <StepDots current={current} />
          <LanguageSwitcher />
        </div>

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
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const onboardUser = useAuthStore((s) => s.onboardUser);
  const isLoading = useAuthStore((s) => s.isLoading);

  const [step, setStep] = useState(1);
  const [country, setCountry] = useState('');
  const [level, setLevel] = useState('');
  const [countrySearch, setCountrySearch] = useState('');
  const [apiError, setApiError] = useState(null);

  const userName = user?.name ?? t('onboarding.defaultName');

  const filteredCountries = COUNTRIES.filter((c) => {
    const displayName = t(`onboarding.countries.${c.name}`, c.name);
    return (
      displayName.toLowerCase().includes(countrySearch.toLowerCase()) ||
      c.name.toLowerCase().includes(countrySearch.toLowerCase())
    );
  });

  const handleSubmit = async () => {
    setApiError(null);
    try {
      await onboardUser({ country, initial_level: level });
      setStep(4);
    } catch (err) {
      setApiError(err.response?.data?.message ?? t('onboarding.apiError'));
    }
  };

  // ── Step 1: Greeting ─────────────────────────────────────────────────────────

  if (step === 1) {
    return (
      <OnboardingLayout current={1}>
        <div className={styles.stepTag}>
          {t('onboarding.stepTag', { current: 1, total: TOTAL_STEPS })}
        </div>
        <div className={styles.stepTitle}>
          {t('onboarding.step1Title', { name: userName })}
        </div>
        <div className={styles.stepSub}>{t('onboarding.step1Sub')}</div>
        <div className={styles.nav}>
          <span className={styles.progressText}>
            {t('onboarding.progressText', { current: 1, total: TOTAL_STEPS })}
          </span>
          <button className={styles.btnNext} onClick={() => setStep(2)}>
            {t('onboarding.btnNext')}
          </button>
        </div>
      </OnboardingLayout>
    );
  }

  // ── Step 2: Negara ───────────────────────────────────────────────────────────

  if (step === 2) {
    return (
      <OnboardingLayout current={2}>
        <div className={styles.stepTag}>
          {t('onboarding.stepTag', { current: 2, total: TOTAL_STEPS })}
        </div>
        <div className={styles.stepTitle}>{t('onboarding.step2Title')}</div>
        <div className={styles.stepSub}>{t('onboarding.step2Sub')}</div>

        <input
          className={styles.countrySearch}
          type="text"
          placeholder={t('onboarding.countrySearchPlaceholder')}
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
              {t(`onboarding.countries.${c.name}`, c.name)}
            </button>
          ))}
        </div>

        <div className={styles.nav}>
          <button className={styles.btnBack} onClick={() => setStep(1)}>
            {t('onboarding.btnBack')}
          </button>
          <button
            className={styles.btnNext}
            onClick={() => setStep(3)}
            disabled={!country}
          >
            {t('onboarding.btnNext')}
          </button>
        </div>
      </OnboardingLayout>
    );
  }

  // ── Step 3: Level ────────────────────────────────────────────────────────────

  if (step === 3) {
    return (
      <OnboardingLayout current={3}>
        <div className={styles.stepTag}>
          {t('onboarding.stepTag', { current: 3, total: TOTAL_STEPS })}
        </div>
        <div className={styles.stepTitle}>{t('onboarding.step3Title')}</div>
        <div className={styles.stepSub}>{t('onboarding.step3Sub')}</div>

        <div className={styles.levelList}>
          {LEVELS.map((l) => (
            <button
              key={l.code}
              className={`${styles.levelBtn} ${level === l.code ? styles.selected : ''}`}
              onClick={() => setLevel(l.code)}
            >
              <div className={styles.levelLeft}>
                <span className={styles.levelName}>
                  {t(`onboarding.levels.${l.code}.label`)}
                </span>
                <span className={styles.levelDesc}>
                  {t(`onboarding.levels.${l.code}.desc`)}
                </span>
              </div>
              <span className={styles.levelBadge}>{l.code}</span>
            </button>
          ))}
        </div>

        <div className={styles.nav}>
          <button className={styles.btnBack} onClick={() => setStep(2)}>
            {t('onboarding.btnBack')}
          </button>
          <button
            className={styles.btnNext}
            onClick={handleSubmit}
            disabled={!level || isLoading}
          >
            {isLoading ? t('onboarding.btnSaving') : t('onboarding.btnStartLearning')}
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

        <h2 className={styles.successTitle}>
          {t('onboarding.successTitle', { name: userName })}
        </h2>
        <p className={styles.successSubtitle}>{t('onboarding.successSubtitle')}</p>

        <div className={styles.summary}>
          <div className={styles.summaryRow}>
            <span className={styles.summaryKey}>{t('onboarding.summaryName')}</span>
            <span className={styles.summaryVal}>{userName}</span>
          </div>
          <div className={styles.summaryRow}>
            <span className={styles.summaryKey}>{t('onboarding.summaryCountry')}</span>
            <span className={styles.summaryVal}>
              {t(`onboarding.countries.${country}`, country)}
            </span>
          </div>
          <div className={styles.summaryRow}>
            <span className={styles.summaryKey}>{t('onboarding.summaryLevel')}</span>
            <span className={styles.summaryVal}>
              {t(`onboarding.levels.${level}.label`)} ({level})
            </span>
          </div>
        </div>

        <button className={styles.btnStart} onClick={() => navigate('/dashboard')}>
          {t('onboarding.btnStartPractice')}
        </button>
      </div>
    </OnboardingLayout>
  );
}
