import { CORE_COLOR_TOKENS, CORE_COLOR_TOKEN_LABELS } from '../../theme/color-tokens.js';

export interface ThemeColorOption {
  readonly label: string;
  /** Any valid CSS color — typically a `var(--token)` reference into globals.css. */
  readonly value: string;
}

/**
 * The semantic tokens defined in `styles/globals.css`. Passed as the picker's
 * default `themeColors` so client apps get their brand palette for free, but
 * fully overridable since each app's token set may differ.
 */
export const defaultThemeColorOptions: readonly ThemeColorOption[] = CORE_COLOR_TOKENS.map((token) => ({
  label: CORE_COLOR_TOKEN_LABELS[token],
  value: `var(--${token})`,
}));
