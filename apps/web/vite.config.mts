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
      // react/react-dom/react-router-dom: standard singleton requirement for any React app.
      // @inithium/* packages: an installed plugin (real node_modules package, e.g.
      // @inithium/blog-plugin) gets pre-bundled by Vite's dependency optimizer independently of
      // this app's own (unbundled, workspace-source) imports of the same @inithium/* packages —
      // without deduping, that produces a *second* module instance of e.g. @inithium/store, with
      // its own copy of module-level state like the apiBaseUrl set by setApiBaseUrl() in main.tsx.
      // A plugin calling getApiBaseUrl() then reads the never-updated default ('/api', resolved
      // by the browser relative to whatever page it's on) instead of the real API origin — every
      // fetch a plugin makes through @inithium/store silently goes to the wrong URL and 404s.
      dedupe: ['react', 'react-dom', 'react-router-dom', '@inithium/store', '@inithium/pages', '@inithium/plugin-engine', '@inithium/ui', '@inithium/types', '@inithium/models'],
      // Resolve workspace packages to their TS source during dev so edits
      // trigger HMR immediately, instead of the stale `dist/` build output
      // (see each package.json's "@inithium/source" export condition).
      // Left out of production builds so `vite build` keeps resolving to dist.
      conditions: command === 'serve' ? ['@inithium/source'] : [],
    },
    optimizeDeps: {
      // Vite's dependency scanner pre-bundles this workspace-linked package into a cached
      // chunk under node_modules/.vite instead of resolving it as live source, so edits to it
      // silently keep serving stale code until a forced re-optimize. Excluding it keeps dev
      // resolution consistent with other @inithium/* workspace packages.
      exclude: ['@inithium/error-capture'],
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
