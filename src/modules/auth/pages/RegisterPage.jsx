import { useTranslation } from 'react-i18next';
import RegisterForm from '../components/RegisterForm';
import styles from '../auth.module.css';

// ─── Panel Kiri (desktop only) ──────────────────────────────────────────────
function BrandPanel() {
  const { t } = useTranslation();
  return (
    <div className={styles.brandPanel}>
      <div className={styles.logo}>
        <div className={styles.logoIcon}>🇮🇩</div>
        <span>BahasaKu</span>
      </div>

      <div className={styles.brandContent}>
        <h1 className={styles.brandTitle} dangerouslySetInnerHTML={{ __html: t('register.brandTitle') }} />
        <p className={styles.brandSubtitle}>
          {t('register.brandSubtitle')}
        </p>

        <ul className={styles.featureList}>
          <li className={styles.featureItem}>
            <span className={styles.featureIcon}>📚</span>
            {t('register.feature1')}
          </li>
          <li className={styles.featureItem}>
            <span className={styles.featureIcon}>🔥</span>
            {t('register.feature2')}
          </li>
          <li className={styles.featureItem}>
            <span className={styles.featureIcon}>🏆</span>
            {t('register.feature3')}
          </li>
          <li className={styles.featureItem}>
            <span className={styles.featureIcon}>📊</span>
            {t('register.feature4')}
          </li>
        </ul>
      </div>

      <p className={styles.brandFooter}>
        {t('register.brandFooter')}
      </p>
    </div>
  );
}

// ─── Hero Mobile (mobile only, menggantikan panel kiri) ────────────────────
function MobileHero() {
  const { t } = useTranslation();
  return (
    <div className={`${styles.mobileHero} d-md-none`}>
      {/* Brand */}
      <div className={styles.mobileHeroBrand}>
        <div className={styles.mobileHeroLogoIcon}>B</div>
        <span className={styles.mobileHeroBrandName}>BahasaKu</span>
      </div>

      <h2 className={styles.mobileHeroTitle}>{t('register.mobileTitle')}</h2>
      <p className={styles.mobileHeroSubtitle}>
        {t('register.mobileSubtitle')}
      </p>

      {/* Progress steps — step 1 aktif karena kita sedang di halaman register */}
      <div className={styles.mobileSteps}>
        <div className={styles.mobileStep}>
          <div className={`${styles.mobileStepNum} ${styles.done}`}>1</div>
          <span className={`${styles.mobileStepText} ${styles.done}`}>{t('register.step1')}</span>
        </div>
        <div className={styles.mobileStep}>
          <div className={styles.mobileStepNum}>2</div>
          <span className={styles.mobileStepText}>{t('register.step2')}</span>
        </div>
        <div className={styles.mobileStep}>
          <div className={styles.mobileStepNum}>3</div>
          <span className={styles.mobileStepText}>{t('register.step3')}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Halaman Utama ─────────────────────────────────────────────────────────
export default function RegisterPage() {
  const { t } = useTranslation();
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
            <h2 className={styles.formTitle}>{t('register.formTitle')}</h2>
            <p className={styles.formSubtitle}>
              {t('register.formSubtitle')}
            </p>
          </div>

          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
