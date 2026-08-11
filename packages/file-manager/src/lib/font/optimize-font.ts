import { createRequire } from 'node:module';

/**
 * `wawoff2` ships no type declarations, and this file is compiled through two different
 * pipelines that disagree on module format: file-manager's own `tsc` build (real ESM, where
 * `import.meta.url` is valid) and the API's esbuild bundle (CJS output, where `require` is a
 * real global but `import.meta` is not). `typeof require` is a safe check either way — `typeof`
 * never throws on an unbound identifier — and the ternary short-circuits, so the branch that
 * isn't valid in a given format is never actually evaluated at runtime.
 */
const nodeRequire: NodeJS.Require = typeof require === 'function' ? require : createRequire(import.meta.url);
const wawoff2 = nodeRequire('wawoff2') as { compress: (buffer: Buffer) => Promise<Uint8Array> };

const CONVERTIBLE_FONT_EXTENSIONS: ReadonlySet<string> = new Set(['.ttf', '.otf']);

export interface OptimizedFont {
  readonly buffer: Buffer;
  readonly mimeType: string;
  readonly extension: string;
}

export const isConvertibleFont = (extension: string): boolean =>
  CONVERTIBLE_FONT_EXTENSIONS.has(extension.toLowerCase());

/**
 * TTF/OTF uploads are typically 2-3x the size of the WOFF2 a browser actually fetches.
 * Converting at ingest means every project scaffolded from this boilerplate serves
 * compressed fonts by default, instead of relying on someone remembering to do it later.
 */
export const optimizeFont = async (buffer: Buffer): Promise<OptimizedFont> => {
  const compressed = await wawoff2.compress(buffer);
  return { buffer: Buffer.from(compressed), mimeType: 'font/woff2', extension: '.woff2' };
};
