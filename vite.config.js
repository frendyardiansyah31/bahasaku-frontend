import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Alias agar import lebih pendek, misal: import dari '@/shared/...'
      '@': '/src',
    },
  },
});
