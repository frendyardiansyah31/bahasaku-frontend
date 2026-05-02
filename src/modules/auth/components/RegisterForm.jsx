/**
 * RegisterForm.jsx
 * Form pendaftaran akun baru.
 * Validasi client-side dilakukan sebelum request ke API.
 * Error dari API ditampilkan di atas tombol submit.
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../authStore';
import styles from '../auth.module.css';

// ─── Nilai awal state form ─────────────────────────────────────────────────
const INITIAL_FORM = {
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  password_confirm: '',
  terms: false,
};

// ─── Validasi Client-Side ──────────────────────────────────────────────────
const validate = (form) => {
  const errors = {};

  if (!form.first_name.trim()) errors.first_name = 'Nama depan wajib diisi.';
  if (!form.last_name.trim()) errors.last_name = 'Nama belakang wajib diisi.';

  if (!form.email.trim()) {
    errors.email = 'Email wajib diisi.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Format email tidak valid.';
  }

  if (!form.password) {
    errors.password = 'Kata sandi wajib diisi.';
  } else if (form.password.length < 8) {
    errors.password = 'Kata sandi minimal 8 karakter.';
  }

  if (!form.password_confirm) {
    errors.password_confirm = 'Konfirmasi kata sandi wajib diisi.';
  } else if (form.password_confirm !== form.password) {
    errors.password_confirm = 'Kata sandi dan konfirmasi tidak sama.';
  }

  if (!form.terms) errors.terms = 'Kamu harus menyetujui syarat & ketentuan.';

  return errors;
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
export default function RegisterForm() {
  const navigate = useNavigate();
  const { registerUser, isLoading, error, clearError } = useAuthStore();

  const [form, setForm] = useState(INITIAL_FORM);
  const [fieldErrors, setFieldErrors] = useState({});

  // Tampilkan/sembunyikan kata sandi
  const [showPassword, setShowPassword]               = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  // ── Handler perubahan input ────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Hapus error field yang sedang diketik agar UX lebih nyaman
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }

    // Hapus error API saat user mulai mengetik
    if (error) clearError();
  };

  // ── Submit form ────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validate(form);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    try {
      // Kirim data ke API (tanpa field 'terms' yang hanya untuk UI)
      const { terms, ...apiData } = form;
      await registerUser(apiData);

      // Berhasil → arahkan ke onboarding
      navigate('/onboarding');
    } catch {
      // Error sudah dihandle di store, tidak perlu action tambahan
    }
  };

  // ── Helper class untuk field yang invalid ─────────────────────────────
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

      {/* ── Nama Depan & Belakang (2 kolom) ────────────────────── */}
      <div className="row g-2 mb-0">
        <div className="col-6">
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel} htmlFor="first_name">
              Nama Depan
            </label>
            <input
              id="first_name"
              name="first_name"
              type="text"
              autoComplete="given-name"
              value={form.first_name}
              onChange={handleChange}
              placeholder="Andi"
              className={`${styles.inputField} ${invalidClass('first_name')}`}
            />
            {fieldErrors.first_name && (
              <p className={styles.fieldError}>{fieldErrors.first_name}</p>
            )}
          </div>
        </div>
        <div className="col-6">
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel} htmlFor="last_name">
              Nama Belakang
            </label>
            <input
              id="last_name"
              name="last_name"
              type="text"
              autoComplete="family-name"
              value={form.last_name}
              onChange={handleChange}
              placeholder="Pratama"
              className={`${styles.inputField} ${invalidClass('last_name')}`}
            />
            {fieldErrors.last_name && (
              <p className={styles.fieldError}>{fieldErrors.last_name}</p>
            )}
          </div>
        </div>
      </div>

      {/* ── Email ───────────────────────────────────────────────── */}
      <div className={styles.inputGroup}>
        <label className={styles.inputLabel} htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={handleChange}
          placeholder="kamu@email.com"
          className={`${styles.inputField} ${invalidClass('email')}`}
        />
        {fieldErrors.email && (
          <p className={styles.fieldError}>{fieldErrors.email}</p>
        )}
      </div>

      {/* ── Kata Sandi ──────────────────────────────────────────── */}
      <div className={styles.inputGroup}>
        <label className={styles.inputLabel} htmlFor="password">
          Kata Sandi
        </label>
        <div className={styles.passwordWrapper}>
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            value={form.password}
            onChange={handleChange}
            placeholder="Min. 8 karakter"
            className={`${styles.inputField} ${invalidClass('password')}`}
          />
          <button
            type="button"
            className={styles.togglePassword}
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
          >
            <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`} />
          </button>
        </div>
        {fieldErrors.password && (
          <p className={styles.fieldError}>{fieldErrors.password}</p>
        )}
      </div>

      {/* ── Konfirmasi Kata Sandi ───────────────────────────────── */}
      <div className={styles.inputGroup}>
        <label className={styles.inputLabel} htmlFor="password_confirm">
          Konfirmasi Kata Sandi
        </label>
        <div className={styles.passwordWrapper}>
          <input
            id="password_confirm"
            name="password_confirm"
            type={showPasswordConfirm ? 'text' : 'password'}
            autoComplete="new-password"
            value={form.password_confirm}
            onChange={handleChange}
            placeholder="Ulangi kata sandi"
            className={`${styles.inputField} ${invalidClass('password_confirm')}`}
          />
          <button
            type="button"
            className={styles.togglePassword}
            onClick={() => setShowPasswordConfirm((v) => !v)}
            aria-label={showPasswordConfirm ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
          >
            <i className={`bi ${showPasswordConfirm ? 'bi-eye-slash' : 'bi-eye'}`} />
          </button>
        </div>
        {fieldErrors.password_confirm && (
          <p className={styles.fieldError}>{fieldErrors.password_confirm}</p>
        )}
      </div>

      {/* ── Checkbox Terms ──────────────────────────────────────── */}
      <div className="d-flex align-items-start gap-2 mb-3">
        <input
          id="terms"
          name="terms"
          type="checkbox"
          checked={form.terms}
          onChange={handleChange}
          className={`form-check-input mt-1 flex-shrink-0 ${styles.checkboxInput}`}
        />
        <label className={styles.checkboxLabel} htmlFor="terms">
          Saya setuju dengan{' '}
          <a href="/terms" className={styles.authLink}>
            Syarat &amp; Ketentuan
          </a>{' '}
          BahasaKu
        </label>
      </div>
      {fieldErrors.terms && (
        <p className={`${styles.fieldError} ${styles.fieldErrorTerms}`}>
          {fieldErrors.terms}
        </p>
      )}

      {/* ── Tombol Daftar ───────────────────────────────────────── */}
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
            Mendaftar...
          </>
        ) : (
          'Daftar & Lanjut ke Onboarding →'
        )}
      </button>

      {/* ── Divider ─────────────────────────────────────────────── */}
      <div className={styles.divider}>atau</div>

      {/* ── Tombol Google (OAuth — implementasi di iterasi berikutnya) ── */}
      <button type="button" className={styles.googleBtn} disabled>
        <GoogleIcon />
        Daftar dengan Google
      </button>

      {/* ── Link ke Login ────────────────────────────────────────── */}
      <p className={`text-center mt-3 mb-0 ${styles.authFooter}`}>
        Sudah punya akun?{' '}
        <Link to="/login" className={styles.authLink}>
          Masuk
        </Link>
      </p>
    </form>
  );
}
