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
export const defaultThemeColorOptions: readonly ThemeColorOption[] = [
  { label: 'Primary', value: 'var(--primary)' },
  { label: 'Secondary', value: 'var(--secondary)' },
  { label: 'Accent', value: 'var(--accent)' },
  { label: 'Muted', value: 'var(--muted)' },
  { label: 'Success', value: 'var(--success)' },
  { label: 'Warning', value: 'var(--warning)' },
  { label: 'Info', value: 'var(--info)' },
  { label: 'Destructive', value: 'var(--destructive)' },
];
