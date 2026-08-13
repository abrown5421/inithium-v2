import { defineConfig } from 'tsup';

export default defineConfig({
  entry: { index: 'src/index.ts', server: 'src/server.ts', client: 'src/client.ts' },
  format: ['esm'],
  dts: { resolve: true },
  splitting: false,
  sourcemap: true,
  clean: true,
  outDir: 'dist',
  external: [
    'react',
    'react-dom',
    'express',
    'mongodb',
    '@inithium/plugin-engine',
    '@inithium/ui',
    '@inithium/pages',
    '@inithium/store',
    '@inithium/pubsub',
    '@inithium/types',
    '@inithium/db'
  ]
});
