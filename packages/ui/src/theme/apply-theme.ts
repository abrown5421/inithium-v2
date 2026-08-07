import * as React from 'react';
import { CORE_COLOR_TOKENS, type CoreColorToken } from './color-tokens.js';

export type CoreThemeColorValues = Partial<Record<CoreColorToken, string>>;

/**
 * Writes only the tokens actually present in `colors` as CSS custom
 * properties on `target`. Missing/malformed tokens are left untouched so a
 * partial DB value can't blank out the rest — they keep falling through to
 * `globals.css`'s static `:root`/`.dark` values via the normal CSS cascade.
 */
export function applyCoreThemeColors(
  colors: CoreThemeColorValues,
  target: HTMLElement | undefined = typeof document !== 'undefined' ? document.documentElement : undefined,
): void {
  if (!target) return;
  for (const token of CORE_COLOR_TOKENS) {
    const value = colors[token];
    if (typeof value === 'string' && value.trim().length > 0) {
      target.style.setProperty(`--${token}`, value);
    }
  }
}

export function useApplyCoreThemeColors(colors: CoreThemeColorValues | undefined): void {
  React.useEffect(() => {
    if (colors) applyCoreThemeColors(colors);
  }, [colors]);
}

/** Narrows an arbitrary settings-map value (e.g. `settingsMap['site.theme']`) down to the known token keys with string values. */
export function parseCoreThemeColors(value: unknown): CoreThemeColorValues {
  if (typeof value !== 'object' || value === null) return {};
  const result: CoreThemeColorValues = {};
  for (const token of CORE_COLOR_TOKENS) {
    const raw = (value as Record<string, unknown>)[token];
    if (typeof raw === 'string' && raw.trim().length > 0) {
      result[token] = raw;
    }
  }
  return result;
}
