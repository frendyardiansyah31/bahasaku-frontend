import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useAuthStore from '../authStore';
import styles from '../auth.module.css';

// ─── Nilai awal state form ─────────────────────────────────────────────────
const INITIAL_FORM = {
  email: '',
  password: '',
  remember: false,
};

// ─── Validasi Client-Side ──────────────────────────────────────────────────
const validate = (form, t) => {
  const errors = {};

  if (!form.email.trim()) {
    errors.email = t('login.errors.emailRequired');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = t('login.errors.emailInvalid');
  }

  if (!form.password) errors.password = t('login.errors.passwordRequired');

  return errors;
};

// ─── Logika redirect setelah login ────────────────────────────────────────
const getRedirectPath = (user) => {
  if (!user.is_onboarded) return '/onboarding';
  if (user.role === 'admin') return '/admin';
  return '/dashboard';
};

// ─── Ikon Google (SVG inline) ──────────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

// ─── Komponen ──────────────────────────────────────────────────────────────
export default function LoginForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { loginUser, isLoading, error, clearError } = useAuthStore();

  const [form, setForm] = useState(INITIAL_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // ── Handler perubahan input ────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }

    if (error) clearError();
  };

  // ── Submit form ────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validate(form, t);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    try {
      const user = await loginUser({ email: form.email, password: form.password });
      navigate(getRedirectPath(user));
    } catch {
      // Error sudah dihandle di store
    }
  };

  const invalidClass = (field) => (fieldErrors[field] ? styles.isInvalid : '');

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* ── Error dari API ──────────────────────────────────────── */}
      {error && (
        <div className={styles.alertError} role="alert">
          <i className="bi bi-exclamation-circle-fill" />
          <span>{error}</span>
        </div>
      )}

      {/* ── Email ───────────────────────────────────────────────── */}
      <div className={styles.inputGroup}>
        <label className={styles.inputLabel} htmlFor="email">
          {t('login.emailLabel')}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={handleChange}
          placeholder={t('login.emailPlaceholder')}
          className={`${styles.inputField} ${invalidClass('email')}`}
        />
        {fieldErrors.email && (
          <p className={styles.fieldError}>{fieldErrors.email}</p>
        )}
      </div>

      {/* ── Kata Sandi ──────────────────────────────────────────── */}
      <div className={styles.inputGroup}>
        <div className="d-flex justify-content-between align-items-center mb-1">
          <label className={`${styles.inputLabel} ${styles.inputLabelInline}`} htmlFor="password">
            {t('login.passwordLabel')}
          </label>
          <a href="/forgot-password" className={`${styles.authLink} ${styles.authLinkSm}`}>
            {t('login.forgotPassword')}
          </a>
        </div>
        <div className={styles.passwordWrapper}>
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            value={form.password}
            onChange={handleChange}
            placeholder={t('login.passwordPlaceholder')}
            className={`${styles.inputField} ${invalidClass('password')}`}
          />
          <button
            type="button"
            className={styles.togglePassword}
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? t('login.hidePassword') : t('login.showPassword')}
          >
            <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`} />
          </button>
        </div>
        {fieldErrors.password && (
          <p className={styles.fieldError}>{fieldErrors.password}</p>
        )}
      </div>

      {/* ── Ingat Saya ──────────────────────────────────────────── */}
      <div className="d-flex align-items-center gap-2 mb-3">
        <input
          id="remember"
          name="remember"
          type="checkbox"
          checked={form.remember}
          onChange={handleChange}
          className={`form-check-input ${styles.checkboxInput}`}
        />
        <label className={styles.checkboxLabel} htmlFor="remember">
          {t('login.rememberMe')}
        </label>
      </div>

      {/* ── Tombol Masuk ────────────────────────────────────────── */}
      <button
        type="submit"
        className={styles.submitBtn}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <span
              className="spinner-border spinner-border-sm me-2"
              role="status"
              aria-hidden="true"
            />
            {t('login.loginBtnLoading')}
          </>
        ) : (
          t('login.loginBtn')
        )}
      </button>

      {/* ── Divider ─────────────────────────────────────────────── */}
      <div className={styles.divider}>{t('login.or')}</div>

      {/* ── Tombol Google (OAuth — implementasi di iterasi berikutnya) ── */}
      <button type="button" className={styles.googleBtn} disabled>
        <GoogleIcon />
        {t('login.googleBtn')}
      </button>

      {/* ── Link ke Register ─────────────────────────────────────── */}
      <p className={`text-center mt-3 mb-0 ${styles.authFooter}`}>
        {t('login.noAccount')}{' '}
        <Link to="/register" className={styles.authLink}>
          {t('login.registerFree')}
        </Link>
      </p>
    </form>
  );
}
