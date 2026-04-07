import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {},
  },
  test: {
    environment: 'happy-dom',
    include: ['tests/**/*.test.js'],
  },
});
