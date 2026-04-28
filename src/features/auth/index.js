/**
 * index.js — Public API dari feature auth.
 * Import komponen, store, dan API auth melalui file ini,
 * bukan langsung dari subfolder internal.
 *
 * Contoh: import { RegisterForm, useAuthStore } from '@/features/auth'
 */

export { default as RegisterForm } from './components/RegisterForm';
export { default as LoginForm }    from './components/LoginForm';
export { default as useAuthStore } from './store/authStore';
export * as authApi                from './api/authApi';
