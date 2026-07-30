import * as React from 'react';
import { PageTheme } from '@inithium/models';

export const themeTokenToCssVar = (token: string): string => `var(--${token})`;

export const resolvePageThemeStyle = (theme: PageTheme): React.CSSProperties => ({
  backgroundColor: themeTokenToCssVar(theme.backgroundColor),
  color: themeTokenToCssVar(theme.foregroundColor)
});
