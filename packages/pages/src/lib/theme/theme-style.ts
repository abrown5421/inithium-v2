import * as React from 'react';
import { PageTheme } from '@inithium/models';

/**
 * `PageTheme` colors are a CSS color value. New pages store a hex string straight from the color
 * picker, used as-is; pages created before the picker was wired up may still hold a bare semantic
 * token name (e.g. `background`), which only means something once wrapped as `var(--background)`.
 */
const resolveThemeColor = (value: string): string => (value.startsWith('#') ? value : `var(--${value})`);

export const resolvePageThemeStyle = (theme: PageTheme): React.CSSProperties => ({
  backgroundColor: resolveThemeColor(theme.backgroundColor),
  color: resolveThemeColor(theme.foregroundColor)
});
