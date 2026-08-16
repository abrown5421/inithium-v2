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
      //
      // Installed plugins (@inithium/blog-plugin, @inithium/friends-plugin — real node_modules
      // packages, not workspace source) hit the same underlying issue, with a worse symptom: the
      // `dedupe` list above only controls *which file* a given import resolves to once something
      // has already decided to bundle it — it doesn't stop the optimizer from pre-bundling a
      // plugin as its own independent chunk in the first place. Confirmed via Vite's own
      // deps/_metadata.json: even with dedupe covering @inithium/store, both plugins still showed
      // up under "optimized" as separate entries. Once pre-bundled that way, a plugin's own
      // `import ... from '@inithium/store'` resolves through esbuild's scan (which does not honor
      // the `@inithium/source` condition below) instead of the live workspace source this app's
      // own code resolves to — landing on a second, genuinely separate module instance with its
      // own copy of module-level state (e.g. the apiBaseUrl set by setApiBaseUrl() in main.tsx).
      // Excluding the plugin here forces it through the same live-source resolution path as
      // everything else, so it shares the exact same @inithium/store instance.
      //
      // That alone wasn't sufficient: with the plugin itself excluded, Vite's dev server serves
      // it unbundled — but when it then encounters the plugin's *own* `import ... from
      // '@inithium/store'`, it still separately optimizes @inithium/store as a dependency reached
      // through that unbundled code, producing a *different* pre-bundled chunk than the one
      // main.tsx's own (unbundled, `@inithium/source`-resolved) import resolves to. Confirmed by
      // diffing the actual served output: main.tsx imports @inithium/store from
      // `/packages/store/src/index.ts`; the plugin's served bundle imported getApiBaseUrl from
      // `/node_modules/.vite/apps/cms/deps/<hash>.js` — two different files, two module
      // instances, two separate copies of the apiBaseUrl module-level variable. Excluding
      // @inithium/store (and the other dedupe-listed packages, for the same reason) directly
      // closes that path — there is then no way for the optimizer to produce a second copy of
      // any of them, regardless of what pulls them in.
      exclude: [
        '@inithium/error-capture',
        '@inithium/blog-plugin',
        '@inithium/blog-plugin/client',
        '@inithium/friends-plugin',
        '@inithium/friends-plugin/client',
        '@inithium/store',
        '@inithium/pages',
        '@inithium/plugin-engine',
        '@inithium/ui',
        '@inithium/types',
        '@inithium/models'
      ],
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
