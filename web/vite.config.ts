import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    root: 'web',
  build: {
    outDir: './dist',
    emptyOutDir: true,
  },
  plugins: [react()],
});