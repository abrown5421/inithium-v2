/// <reference types='vitest' />
import path from 'node:path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { inithiumPluginDiscovery } from '@inithium/plugin-engine/vite';

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiOrigin = env.VITE_API_ORIGIN || 'http://localhost:3000';

  return {
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
      proxy: {
        '/assets': {
          target: apiOrigin,
          changeOrigin: true,
        },
      },
    },
    preview: {
      port: 5173,
      host: 'localhost',
    },
    plugins: [
      react(),
      tailwindcss(),
      inithiumPluginDiscovery({ workspaceRoot: path.resolve(import.meta.dirname, '../..') }),
    ],
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
  };
});
