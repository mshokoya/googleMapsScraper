import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from "tailwindcss";


// https://vitejs.dev/config/
export default defineConfig({
    root: 'web',
  build: {
    outDir: './dist',
    emptyOutDir: true,
  },
  plugins: [react()],
  css: {
    postcss: {
      plugins: [
        tailwindcss({
          config: "web/tailwind.config.js",
        }),
      ],
    },
  },
});