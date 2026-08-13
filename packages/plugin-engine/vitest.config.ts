import { defineConfig } from 'vitest/config';

export default defineConfig({
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/packages/plugin-engine',
  test: {
    watch: false,
    globals: false,
    environment: 'node',
    include: ['src/**/*.spec.ts'],
    reporters: ['default']
  }
});
