/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ command }) => ({
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/apps/web',
  resolve: {
    dedupe: ['react', 'react-dom'],
    // Resolve workspace packages to their TS source during dev so edits
    // trigger HMR immediately, instead of the stale `dist/` build output
    // (see each package.json's "@inithium/source" export condition).
    // Left out of production builds so `vite build` keeps resolving to dist.
    conditions: command === 'serve' ? ['@inithium/source'] : [],
  },
  server: {
    port: 5173,
    host: 'localhost',
  },
  preview: {
    port: 5173,
    host: 'localhost',
  },
  plugins: [react(), tailwindcss()],
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [],
  // },
  build: {
    outDir: './dist',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
}));
