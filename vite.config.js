import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Served from javier.xyz/img2css via a vercel rewrite to javierbyte.github.io/img2css.
export default defineConfig({
  base: '/img2css/',
  plugins: [react()],
  build: { outDir: 'dist' }
});
